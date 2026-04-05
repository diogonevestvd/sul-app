import { NextRequest } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/get-user";
import { prisma } from "@/lib/prisma";
import { badRequest, ok } from "@/lib/http";
import { getWorkspaceRecord } from "@/lib/data";

const schema = z.object({
  answer: z.string().min(1)
});

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string; questionId: string }> }
) {
  try {
    const user = await getUser();
    const { id, questionId } = await context.params;

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return badRequest("Invalid answer");

    const workspace = await prisma.workspace.findFirst({
      where: { id, userId: user.id }
    });

    if (!workspace) return badRequest("Not found", 404);

    await prisma.question.update({
      where: { id: questionId },
      data: { answer: parsed.data.answer }
    });

    const full = await getWorkspaceRecord(workspace.id, user.id);
    return ok({ workspace: full });
  } catch (error) {
    console.error("QUESTION PATCH ERROR:", error);
    return badRequest("Could not save answer", 500);
  }
}