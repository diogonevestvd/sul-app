import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { badRequest, ok } from '@/lib/http';
import { getWorkspaceRecord } from '@/lib/data';
import { getUser } from '@/lib/get-user';

const schema = z.object({
  title: z.string().min(1).optional(),
  objective: z.string().nullable().optional(),
  locale: z.enum(['pt', 'en']).optional()
});

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    const { id } = await context.params;

    const workspace = await getWorkspaceRecord(id, user.id);
    if (!workspace) return badRequest('Not found', 404);

    return ok({ workspace });
  } catch (error) {
    console.error('WORKSPACE GET ERROR:', error);
    return badRequest('Could not load workspace', 500);
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    const { id } = await context.params;

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return badRequest('Invalid payload');

    const existing = await prisma.workspace.findFirst({
      where: { id, userId: user.id }
    });

    if (!existing) return badRequest('Not found', 404);

    await prisma.workspace.update({
      where: { id },
      data: {
        title: parsed.data.title ?? existing.title,
        objective: parsed.data.objective === undefined ? existing.objective : parsed.data.objective,
        locale: parsed.data.locale ?? existing.locale
      }
    });

    const workspace = await getWorkspaceRecord(id, user.id);
    return ok({ workspace });
  } catch (error) {
    console.error('WORKSPACE PATCH ERROR:', error);
    return badRequest('Could not update workspace', 500);
  }
}
