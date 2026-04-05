import OpenAI from 'openai';
import type { Locale } from '@/lib/copy';
import type { PlanPhase, WorkspaceRecord } from '@/lib/types';

function splitLines(text: string) {
  return text
    .split(/\n|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function inferGoal(workspace: WorkspaceRecord, locale: Locale) {
  if (workspace.objective?.trim()) return workspace.objective.trim();
  const ideas = workspace.entries.filter((entry) => entry.kind === 'ideas').flatMap((entry) => splitLines(entry.content));
  return ideas[0] || (locale === 'pt' ? 'Organizar um objetivo importante' : 'Organize an important goal');
}

function localQuestions(workspace: WorkspaceRecord, locale: Locale) {
  const blockers = workspace.entries.filter((entry) => entry.kind === 'blockers').flatMap((entry) => splitLines(entry.content));
  const resources = workspace.entries.filter((entry) => entry.kind === 'resources').flatMap((entry) => splitLines(entry.content));
  const notes = workspace.notes.map((note) => note.content.toLowerCase()).join(' ');
  const prefersSmallSteps = /pequenos|small/.test(notes);

  if (locale === 'pt') {
    return [
      {
        text: 'Qual é o maior bloqueio prático neste momento?',
        hint: 'Isto ajuda a escolher o primeiro passo com menos fricção.',
        stage: 1
      },
      {
        text: blockers.length > 0 ? `O bloqueio "${blockers[0]}" é financeiro, emocional ou logístico?` : 'Qual destes pesa mais: tempo, dinheiro, energia ou clareza?',
        hint: 'O sistema tenta perceber a natureza do bloqueio e não apenas a sua superfície.',
        stage: 2
      },
      {
        text: resources.length > 0 ? `Qual destes recursos está mesmo disponível para usar já: ${resources[0]}?` : 'Que recurso teu está disponível já esta semana?',
        hint: 'Os planos melhores começam no que já existe, não no que falta.',
        stage: 2
      },
      {
        text: prefersSmallSteps ? 'Qual é uma micro-ação que consegues cumprir em 20 minutos?' : 'Preferes uma meta intermédia rápida ou um plano mais completo?',
        hint: 'A resposta define o ritmo e a profundidade da primeira fase.',
        stage: 3
      }
    ];
  }

  return [
    {
      text: 'What is the biggest practical blocker right now?',
      hint: 'This helps choose the first step with the least friction.',
      stage: 1
    },
    {
      text: blockers.length > 0 ? `Is the blocker "${blockers[0]}" financial, emotional, or logistical?` : 'Which weighs more right now: time, money, energy, or clarity?',
      hint: 'The system tries to understand the nature of the blocker, not just its surface.',
      stage: 2
    },
    {
      text: resources.length > 0 ? `Which of these resources is truly available right now: ${resources[0]}?` : 'Which resource do you already have available this week?',
      hint: 'The best plans start from what already exists, not only from what is missing.',
      stage: 2
    },
    {
      text: prefersSmallSteps ? 'What micro-action can you complete in 20 minutes?' : 'Would you rather begin with a quick milestone or a more complete structure?',
      hint: 'This answer defines the rhythm and depth of the first phase.',
      stage: 3
    }
  ];
}

function localPlan(workspace: WorkspaceRecord, locale: Locale) {
  const goal = inferGoal(workspace, locale);
  const blockers = workspace.entries.filter((entry) => entry.kind === 'blockers').flatMap((entry) => splitLines(entry.content));
  const resources = workspace.entries.filter((entry) => entry.kind === 'resources').flatMap((entry) => splitLines(entry.content));
  const answered = workspace.questions.filter((item) => item.answer?.trim()).map((item) => item.answer?.trim());
  const notes = workspace.notes.map((note) => note.content).filter(Boolean);

  if (locale === 'pt') {
    const phases: PlanPhase[] = [
      {
        title: 'Fase 1 — Clarificar o primeiro passo',
        body: `Transformar o objetivo "${goal}" numa meta intermédia de 30 dias. Escolher apenas uma prioridade realista.`
      },
      {
        title: 'Fase 2 — Remover o bloqueio dominante',
        body: blockers[0]
          ? `Atacar diretamente o bloqueio principal (${blockers[0]}) com ações pequenas, semanais e verificáveis.`
          : 'Identificar o maior bloqueio prático e reduzir fricção antes de aumentar ambição.'
      },
      {
        title: 'Fase 3 — Usar o que já tens',
        body: resources[0]
          ? `Apoiar o plano nos recursos já disponíveis, como ${resources.slice(0, 2).join(' e ')}.`
          : 'Construir o plano em cima do tempo, energia e recursos que já existem neste momento.'
      },
      {
        title: 'Fase 4 — Ajustar ao teu ritmo',
        body: answered.length > 0 || notes.length > 0
          ? `Integrar respostas e preferências do utilizador (${[...answered, ...notes].slice(0, 2).join(' | ')}) para que o plano seja sustentável.`
          : 'Recolher feedback rápido após os primeiros passos e adaptar o plano sem perder direção.'
      }
    ];

    return {
      title: workspace.title || 'Plano base',
      summary: `Objetivo central: ${goal}. O plano foi organizado para reduzir overwhelm, focar no bloqueio principal e criar progresso sustentável com um assistente silencioso em segundo plano.`,
      phases,
      source: 'local-ai'
    };
  }

  const phases: PlanPhase[] = [
    {
      title: 'Phase 1 — Clarify the first step',
      body: `Turn the goal "${goal}" into a 30-day intermediate milestone. Choose only one realistic priority.`
    },
    {
      title: 'Phase 2 — Remove the dominant blocker',
      body: blockers[0]
        ? `Target the main blocker (${blockers[0]}) directly with small, weekly, trackable actions.`
        : 'Identify the biggest practical blocker and reduce friction before increasing ambition.'
    },
    {
      title: 'Phase 3 — Use what already exists',
      body: resources[0]
        ? `Build the plan on resources already available, such as ${resources.slice(0, 2).join(' and ')}.`
        : 'Build the plan on top of the time, energy, and resources that already exist right now.'
    },
    {
      title: 'Phase 4 — Adapt to your pace',
      body: answered.length > 0 || notes.length > 0
        ? `Integrate user answers and preferences (${[...answered, ...notes].slice(0, 2).join(' | ')}) so the plan remains sustainable.`
        : 'Collect quick feedback after the first actions and adapt the plan without losing direction.'
    }
  ];

  return {
    title: workspace.title || 'Base plan',
    summary: `Core goal: ${goal}. The plan was organized to reduce overwhelm, focus on the main blocker, and create sustainable progress with a silent assistant in the background.`,
    phases,
    source: 'local-ai'
  };
}

async function openAiPlan(workspace: WorkspaceRecord, locale: Locale) {
  if (!process.env.OPENAI_API_KEY) return null;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `You are the silent planning engine inside a product named Northstar.\nReturn strict JSON with this shape: {"summary": string, "questions": [{"text": string, "hint": string, "stage": number}], "plan": {"title": string, "summary": string, "phases": [{"title": string, "body": string}]}}.\nLanguage: ${locale}.\nConstraints: concise, calm, practical, not overly motivational, progressive disclosure, user remains in control, AI stays invisible.\nWorkspace JSON:\n${JSON.stringify(workspace)}`;

  const response = await client.chat.completions.create({
    model: 'gpt-4.1-mini',
    temperature: 0.6,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: 'Return only valid JSON.'
      },
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  const content = response.choices[0]?.message?.content;
  if (!content) return null;
  return JSON.parse(content) as {
    summary: string;
    questions: { text: string; hint: string; stage: number }[];
    plan: { title: string; summary: string; phases: PlanPhase[] };
  };
}

export async function generateWorkspaceIntelligence(workspace: WorkspaceRecord, locale: Locale) {
  const ai = await openAiPlan(workspace, locale).catch(() => null);
  if (ai) {
    return {
      summary: ai.summary,
      questions: ai.questions,
      plan: {
        ...ai.plan,
        source: 'openai'
      }
    };
  }

  return {
    summary: localPlan(workspace, locale).summary,
    questions: localQuestions(workspace, locale),
    plan: localPlan(workspace, locale)
  };
}
