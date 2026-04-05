import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { badRequest, ok } from '@/lib/http';
import { getWorkspaceRecord } from '@/lib/data';
import { getUser } from '@/lib/get-user';

const schema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  phases: z.array(
    z.object({
      title: z.string().min(1),
      body: z.string().min(1)
    })
  )
});

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string; planId: string }> }
) {
  try {
    const user = await getUser();
    const { id, planId } = await context.params;

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return badRequest('Invalid plan');

    const workspace = await prisma.workspace.findFirst({
      where: { id, userId: user.id }
    });

    if (!workspace) return badRequest('Not found', 404);

    await prisma.planVersion.update({
      where: { id: planId },
      data: {
        title: parsed.data.title,
        summary: parsed.data.summary,
        phasesJson: JSON.stringify(parsed.data.phases)
      }
    });

    await prisma.preferenceNote.create({
      data: {
        workspaceId: workspace.id,
        content: user.locale === 'pt' ? 'O utilizador editou manualmente o plano.' : 'The user manually edited the plan.'
      }
    });

    const full = await getWorkspaceRecord(workspace.id, user.id);
    return ok({ workspace: full });
  } catch (error) {
    console.error('PLAN PATCH ERROR:', error);
    return badRequest('Could not update plan', 500);
  }
}
