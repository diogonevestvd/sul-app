import type { GoalCategory, GoalType, AnswerMap } from "@/lib/question-bank";

export type GeneratedTask = {
  title: string;
  details?: string;
};

export type GeneratedPhase = {
  title: string;
  tasks: GeneratedTask[];
};

export type GeneratedPlan = {
  title: string;
  summary: string;
  phases: GeneratedPhase[];
  metrics?: Record<string, string | number>;
};

function n(value: unknown, fallback = 0) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") return Number(value);
  return fallback;
}

function s(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function b(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value === "true") return true;
    if (value === "false") return false;
  }
  return fallback;
}

export function inferGoalTypeFromAnswers(answers: AnswerMap): GoalType {
  const explicit = answers["goal_type"];
  if (explicit === "quantifiable" || explicit === "habit" || explicit === "complex") {
    return explicit;
  }
  return "complex";
}

export function inferCategoryFromAnswers(answers: AnswerMap): GoalCategory {
  const explicit = answers["goal_category"];
  const allowed: GoalCategory[] = [
    "reading",
    "study",
    "fitness",
    "money",
    "housing",
    "career",
    "creative",
    "productivity",
    "health",
    "custom"
  ];
  if (typeof explicit === "string" && allowed.includes(explicit as GoalCategory)) {
    return explicit as GoalCategory;
  }
  return "custom";
}

export function generateRuleBasedPlan(params: {
  goalTitle: string;
  answers: AnswerMap;
}) {
  const { goalTitle, answers } = params;

  const goalType = inferGoalTypeFromAnswers(answers);
  const category = inferCategoryFromAnswers(answers);

  if (goalType === "quantifiable") {
    return generateQuantifiablePlan(goalTitle, category, answers);
  }

  if (goalType === "habit") {
    return generateHabitPlan(goalTitle, category, answers);
  }

  return generateComplexPlan(goalTitle, category, answers);
}

function generateQuantifiablePlan(goalTitle: string, category: GoalCategory, answers: AnswerMap): GeneratedPlan {
  const total = n(answers["total_quantity"], n(answers["book_pages_total"], 0));
  const months = Math.max(1, n(answers["deadline_value_months"], 1));
  const daysPerWeek = Math.max(1, n(answers["days_per_week_available"], n(answers["reading_days_per_week"], 5)));
  const bufferPercent = n(answers["buffer_percentage"], 10);
  const targetStyle = s(answers["target_style"], s(answers["reading_target_style"], "daily"));
  const unit = s(answers["quantity_unit"], category === "reading" ? "pages" : "units");
  const energy = s(answers["energy_level"], "medium");
  const pace = s(answers["pace_preference"], "balanced");

  const totalWeeks = Math.max(1, Math.round(months * 4.345));
  const totalDays = Math.max(1, totalWeeks * daysPerWeek);
  const bufferedTotal = Math.ceil(total * (1 + bufferPercent / 100));

  let perWeek = bufferedTotal / totalWeeks;
  let perDay = bufferedTotal / totalDays;

  if (energy === "low") {
    perWeek *= 0.9;
    perDay *= 0.9;
  }
  if (energy === "high") {
    perWeek *= 1.05;
    perDay *= 1.05;
  }

  if (pace === "slow") {
    perWeek *= 0.9;
    perDay *= 0.9;
  }
  if (pace === "intense") {
    perWeek *= 1.1;
    perDay *= 1.1;
  }

  perWeek = Math.max(1, Math.ceil(perWeek));
  perDay = Math.max(1, Math.ceil(perDay));

  const metricDaily = `${perDay} ${unit}/${targetStyle === "daily" ? "day" : "session"}`;
  const metricWeekly = `${perWeek} ${unit}/week`;

  return {
    title: goalTitle,
    summary:
      category === "reading"
        ? `Plano quantitativo com meta semanal e diária para terminares a leitura sem depender de motivação aleatória.`
        : `Plano quantitativo com metas distribuídas de forma sustentável ao longo do prazo.`,
    metrics: {
      total,
      months,
      totalWeeks,
      perWeek,
      perDay
    },
    phases: [
      {
        title: "Definir o ritmo base",
        tasks: [
          {
            title: `Meta semanal: ${metricWeekly}`
          },
          {
            title: `Meta diária aproximada: ${metricDaily}`
          },
          {
            title: `Folga embutida: ${bufferPercent}%`
          }
        ]
      },
      {
        title: "Executar com consistência",
        tasks: [
          {
            title: `Distribuir por ${daysPerWeek} dias por semana`
          },
          {
            title: "Evitar falhar dois períodos seguidos"
          },
          {
            title: "Reduzir meta pontualmente em semanas difíceis em vez de desistir"
          }
        ]
      },
      {
        title: "Rever e recalcular",
        tasks: [
          {
            title: "Rever progresso ao fim de cada semana"
          },
          {
            title: "Se estiveres atrasado, recalcular a meta restante"
          },
          {
            title: "Se estiveres adiantado, criar margem e baixar pressão"
          }
        ]
      }
    ]
  };
}

function generateHabitPlan(goalTitle: string, category: GoalCategory, answers: AnswerMap): GeneratedPlan {
  const frequency = Math.max(1, n(answers["habit_frequency_per_week"], 4));
  const duration = Math.max(5, n(answers["habit_session_minutes"], 20));
  const anchor = s(answers["habit_anchor"], "unknown");
  const startSmall = b(answers["habit_start_small"]);
  const tracking = s(answers["habit_tracking_style"], "simple");
  const energy = s(answers["energy_level"], "medium");
  const pace = s(answers["pace_preference"], "balanced");

  let adjustedFrequency = frequency;
  if (energy === "low") adjustedFrequency = Math.max(1, frequency - 1);
  if (pace === "intense") adjustedFrequency = frequency + 1;

  return {
    title: goalTitle,
    summary:
      `Plano de hábito pensado para consistência, não para entusiasmo momentâneo.`,
    metrics: {
      frequencyPerWeek: adjustedFrequency,
      sessionMinutes: duration
    },
    phases: [
      {
        title: "Tornar o hábito leve o suficiente para começar",
        tasks: [
          {
            title: `Fazer ${adjustedFrequency} vezes por semana`
          },
          {
            title: `Cada sessão dura cerca de ${duration} minutos`
          },
          {
            title: startSmall ? "Começar com versão mínima nos primeiros dias" : "Começar já na versão base do hábito"
          }
        ]
      },
      {
        title: "Fixar contexto e repetição",
        tasks: [
          {
            title:
              anchor === "unknown"
                ? "Escolher um contexto consistente para o hábito"
                : `Associar o hábito ao momento: ${anchor}`
          },
          {
            title: "Evitar depender de motivação alta"
          },
          {
            title: "Manter a fricção baixa"
          }
        ]
      },
      {
        title: "Acompanhar e ajustar",
        tasks: [
          {
            title: `Forma de acompanhamento: ${tracking}`
          },
          {
            title: "Rever semanalmente se a frequência é sustentável"
          },
          {
            title: "Aumentar só depois da consistência base estar estável"
          }
        ]
      }
    ]
  };
}

function generateComplexPlan(goalTitle: string, category: GoalCategory, answers: AnswerMap): GeneratedPlan {
  const blocker = s(answers["main_blocker"], "other");
  const clarity = s(answers["clarity_level"], "medium");
  const readiness = s(answers["current_readiness"], "medium");
  const firstStep = s(answers["preferred_first_step"], "clarify");
  const needsMoney = b(answers["needs_money"]);
  const income = n(answers["income_monthly_net"], 0);
  const savings = n(answers["current_savings"], 0);
  const fixedExpenses = n(answers["fixed_expenses_monthly"], 0);
  const rentRatio = Math.max(10, n(answers["rent_ratio_max"], 60));
  const wantsSharedHousing = b(answers["wants_shared_housing"]);
  const urgency = s(answers["move_urgency"], "medium");
  const knowledgeGap = s(answers["knowledge_gap"], "medium");
  const timePerWeek = n(answers["time_per_week_hours"], 4);

  const phases: GeneratedPhase[] = [
    {
      title: "Clarificar o objetivo",
      tasks: [
        { title: "Definir o resultado final em termos concretos" },
        { title: "Separar o essencial do desejável" },
        { title: clarity === "low" ? "Fazer mais clarificação antes de executar" : "Passar à preparação com base suficiente" }
      ]
    },
    {
      title: "Preparar a base",
      tasks: [
        { title: `Reservar cerca de ${Math.max(1, timePerWeek)} horas por semana para este objetivo` },
        { title: knowledgeGap === "high" ? "Fechar as maiores lacunas de informação primeiro" : "Usar a informação atual para começar" },
        { title: blockerMessage(blocker) }
      ]
    }
  ];

  if (category === "housing" || needsMoney) {
    const maxRent = income > 0 ? Math.floor((income * rentRatio) / 100) : 0;
    const freeAfterFixed = income > 0 ? Math.max(0, income - fixedExpenses) : 0;

    phases.push({
      title: "Validar sustentabilidade financeira",
      tasks: [
        {
          title:
            income > 0
              ? `Com rendimento de ${income}, renda máxima sugerida (${rentRatio}%): ${maxRent}`
              : "Definir rendimento mensal antes de validar renda"
        },
        {
          title:
            fixedExpenses > 0
              ? `Depois das despesas fixas (${fixedExpenses}), sobra estimada: ${freeAfterFixed}`
              : "Mapear despesas fixas reais"
        },
        {
          title:
            savings > 0
              ? `Usar poupanças atuais (${savings}) apenas com margem de segurança`
              : "Criar colchão mínimo de poupança"
        },
        {
          title:
            wantsSharedHousing
              ? "Considerar opção partilhada para reduzir pressão financeira"
              : "Testar cenário de viver sozinho só se os números forem sustentáveis"
        }
      ]
    });
  }

  phases.push({
    title: "Executar os primeiros passos",
    tasks: [
      { title: firstStepMessage(firstStep) },
      { title: readiness === "low" ? "Usar micro-passos para baixar resistência inicial" : "Começar com passo concreto ainda esta semana" },
      { title: urgency === "high" ? "Priorizar velocidade sem perder sustentabilidade" : "Manter avanço estável sem dramatizar atrasos" }
    ]
  });

  phases.push({
    title: "Rever e adaptar",
    tasks: [
      { title: "Fazer revisão semanal curta" },
      { title: "Ajustar ritmo quando houver semanas piores" },
      { title: "Recalcular o plano quando os dados reais mudarem" }
    ]
  });

  return {
    title: goalTitle,
    summary:
      category === "housing"
        ? "Plano complexo com foco em sustentabilidade, redução de risco e avanço gradual."
        : "Plano complexo com clarificação, preparação, execução e ajuste contínuo.",
    phases
  };
}

function blockerMessage(blocker: string) {
  switch (blocker) {
    case "money":
      return "Identificar exatamente onde o dinheiro está a bloquear";
    case "time":
      return "Reduzir fricção e proteger blocos de tempo reais";
    case "energy":
      return "Desenhar plano mais leve para não depender de energia alta";
    case "focus":
      return "Diminuir distrações e limitar o número de frentes abertas";
    case "fear":
      return "Transformar medo em passos menores e mais reversíveis";
    case "clarity":
      return "Clarificar antes de exigir execução";
    case "dependency":
      return "Separar o que depende de ti do que depende de terceiros";
    default:
      return "Escolher o primeiro bloqueio que realmente vale a pena resolver";
  }
}

function firstStepMessage(firstStep: string) {
  switch (firstStep) {
    case "clarify":
      return "Escrever uma versão mais concreta do objetivo e dos critérios mínimos";
    case "research":
      return "Pesquisar opções reais e comparáveis antes de decidir";
    case "action":
      return "Dar um passo tangível ainda hoje ou esta semana";
    case "solve_blocker":
      return "Resolver primeiro o bloqueio principal que trava tudo o resto";
    default:
      return "Começar por um passo pequeno mas inequívoco";
  }
}