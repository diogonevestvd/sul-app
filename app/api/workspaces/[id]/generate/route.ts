import { getUser } from "@/lib/get-user";
import { prisma } from "@/lib/prisma";
import { badRequest, ok } from "@/lib/http";
import { getWorkspaceRecord } from "@/lib/data";
import { getQuestionSet } from "@/lib/question-bank";
import { generateRuleBasedPlan } from "@/lib/planning-rules";

export async function POST(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    const { id } = await context.params;

    const workspace = await getWorkspaceRecord(id, user.id);
    if (!workspace) return badRequest("Not found", 404);

    const answers = Object.fromEntries(
      workspace.questions
        .filter((q) => q.answer !== null && q.answer !== "")
        .map((q) => [q.key, q.answer])
    );

    const existingAnswersByKey = new Map(
      workspace.questions.map((q) => [q.key, q.answer ?? null])
    );

    const goalType =
      answers["goal_type"] === "quantifiable" ||
      answers["goal_type"] === "habit" ||
      answers["goal_type"] === "complex"
        ? (answers["goal_type"] as "quantifiable" | "habit" | "complex")
        : undefined;

    const category =
      typeof answers["goal_category"] === "string"
        ? answers["goal_category"]
        : undefined;

    const questionSet = getQuestionSet({
      locale: workspace.locale,
      goalType,
      category: category as any,
      answers
    });

    await prisma.question.deleteMany({
      where: { workspaceId: workspace.id }
    });

    await prisma.question.createMany({
      data: questionSet.map((q) => ({
        workspaceId: workspace.id,
        key: q.key,
        kind: q.kind,
        text: q.text[workspace.locale],
        hint: q.hint?.[workspace.locale] ?? "",
        stage: q.stage,
        answer:
          typeof existingAnswersByKey.get(q.key) === "string"
            ? existingAnswersByKey.get(q.key)
            : null,
        optionsJson: JSON.stringify(q.options?.[workspace.locale] ?? [])
      }))
    });

    const refreshed = await getWorkspaceRecord(workspace.id, user.id);
    if (!refreshed) return badRequest("Not found", 404);

    const refreshedAnswers = Object.fromEntries(
      refreshed.questions
        .filter((q) => q.answer !== null && q.answer !== "")
        .map((q) => [q.key, q.answer])
    );

    const plan = generateRuleBasedPlan({
      goalTitle: refreshed.title,
      answers: refreshedAnswers
    });

    await prisma.planVersion.create({
      data: {
        workspaceId: refreshed.id,
        title: plan.title,
        summary: plan.summary,
        phasesJson: JSON.stringify(
          plan.phases.map((phase) => ({
            title: phase.title,
            body: phase.tasks
              .map((task) =>
                task.details ? `${task.title} — ${task.details}` : task.title
              )
              .join("\n")
          }))
        ),
        source: "system"
      }
    });

    const full = await getWorkspaceRecord(refreshed.id, user.id);
    return ok({ workspace: full });
  } catch (error) {
    console.error("GENERATE POST ERROR:", error);
    return badRequest("Could not generate plan", 500);
  }
}