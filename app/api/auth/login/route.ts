import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';
import { badRequest, ok } from '@/lib/http';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return badRequest('Invalid data');

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) return badRequest('Invalid credentials', 401);

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) return badRequest('Invalid credentials', 401);

  await createSession({ id: user.id, name: user.name, email: user.email, locale: user.locale as 'pt' | 'en' });
  return ok({ user: { id: user.id, name: user.name, email: user.email, locale: user.locale } });
}
