import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';
import { badRequest, ok } from '@/lib/http';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  locale: z.enum(['pt', 'en']).default('pt')
});

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return badRequest('Invalid data');

  const { name, email, password, locale } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return badRequest('Email already exists', 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, locale }
  });

  await createSession({ id: user.id, name: user.name, email: user.email, locale: user.locale as 'pt' | 'en' });
  return ok({ user: { id: user.id, name: user.name, email: user.email, locale: user.locale } });
}
