import { prisma } from '@/lib/prisma';
import { tryJsonParse } from '@/lib/utils';
import type { QuestionKind, QuestionOption, WorkspaceRecord } from '@/lib/types';

export async function getWorkspaceRecord(workspaceId: string, userId: string): Promise<WorkspaceRecord | null> {
  const workspace = await prisma.workspace.findFirst({
    where: { id: workspaceId, userId },
    include: {
      entries: { orderBy: { updatedAt: 'desc' } },
      questions: { orderBy: [{ stage: 'asc' }, { createdAt: 'asc' }] },
      planVersions: { orderBy: { createdAt: 'desc' } },
      notes: { orderBy: { createdAt: 'desc' } }
    }
  });

  if (!workspace) return null;

  return {
    id: workspace.id,
    title: workspace.title,
    objective: workspace.objective,
    summary: workspace.summary,
    locale: (workspace.locale === 'en' ? 'en' : 'pt') as 'pt' | 'en',
    updatedAt: workspace.updatedAt.toISOString(),
    entries: workspace.entries.map((entry: any) => ({
      id: entry.id,
      kind: entry.kind as 'ideas' | 'blockers' | 'resources',
      content: entry.content
    })),
    questions: workspace.questions.map((question: any) => ({
      id: question.id,
      key: question.key,
      kind: question.kind as QuestionKind,
      text: question.text,
      hint: question.hint,
      stage: question.stage,
      answer: question.answer,
      options: tryJsonParse<QuestionOption[]>(question.optionsJson ?? '[]', [])
    })),
    planVersions: workspace.planVersions.map((plan: any) => ({
      id: plan.id,
      title: plan.title,
      summary: plan.summary,
      phases: tryJsonParse(plan.phasesJson, []),
      source: plan.source
    })),
    notes: workspace.notes.map((note: any) => ({ id: note.id, content: note.content }))
  };
}

export async function getWorkspaceList(userId: string) {
  const workspaces = await prisma.workspace.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: {
      planVersions: { orderBy: { createdAt: 'desc' }, take: 1 },
      entries: true,
      questions: true,
      notes: true
    }
  });

  return workspaces.map((workspace: any) => ({
    id: workspace.id,
    title: workspace.title,
    objective: workspace.objective,
    summary: workspace.summary,
    locale: (workspace.locale === 'en' ? 'en' : 'pt') as 'pt' | 'en',
    updatedAt: workspace.updatedAt.toISOString(),
    entries: workspace.entries.map((entry: any) => ({ id: entry.id, kind: entry.kind as 'ideas' | 'blockers' | 'resources', content: entry.content })),
    questions: workspace.questions.map((question: any) => ({
      id: question.id,
      key: question.key,
      kind: question.kind as QuestionKind,
      text: question.text,
      hint: question.hint,
      stage: question.stage,
      answer: question.answer,
      options: tryJsonParse<QuestionOption[]>(question.optionsJson ?? '[]', [])
    })),
    planVersions: workspace.planVersions.map((plan: any) => ({
      id: plan.id,
      title: plan.title,
      summary: plan.summary,
      phases: tryJsonParse(plan.phasesJson, []),
      source: plan.source
    })),
    notes: workspace.notes.map((note: any) => ({ id: note.id, content: note.content }))
  }));
}
