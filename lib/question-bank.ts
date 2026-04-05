export type GoalType = "quantifiable" | "habit" | "complex";

export type GoalCategory =
  | "reading"
  | "study"
  | "fitness"
  | "money"
  | "housing"
  | "career"
  | "creative"
  | "productivity"
  | "health"
  | "custom";

export type QuestionKind =
  | "single_choice"
  | "number"
  | "text"
  | "boolean"
  | "date";

export type Locale = "pt" | "en";

export type QuestionOption = {
  label: string;
  value: string;
};

export type QuestionDefinition = {
  key: string;
  stage: number;
  kind: QuestionKind;
  appliesTo?: GoalType[];
  categories?: GoalCategory[];
  text: {
    pt: string;
    en: string;
  };
  hint?: {
    pt: string;
    en: string;
  };
  placeholder?: {
    pt: string;
    en: string;
  };
  options?: {
    pt: QuestionOption[];
    en: QuestionOption[];
  };
  min?: number;
  max?: number;
  unit?: string;
};

export type AnswerMap = Record<string, string | number | boolean | null | undefined>;

function choice(pt: [string, string][], en: [string, string][]) {
  return {
    pt: pt.map(([label, value]) => ({ label, value })),
    en: en.map(([label, value]) => ({ label, value }))
  };
}

export const UNIVERSAL_QUESTIONS: QuestionDefinition[] = [
  {
    key: "goal_type",
    stage: 1,
    kind: "single_choice",
    text: {
      pt: "Que tipo de objetivo é este?",
      en: "What kind of goal is this?"
    },
    hint: {
      pt: "Isto ajuda a escolher a estrutura do plano.",
      en: "This helps choose the structure of the plan."
    },
    options: choice(
      [
        ["Algo com quantidade definida", "quantifiable"],
        ["Um hábito ou rotina", "habit"],
        ["Algo com várias etapas", "complex"]
      ],
      [
        ["Something with a fixed quantity", "quantifiable"],
        ["A habit or routine", "habit"],
        ["Something with multiple stages", "complex"]
      ]
    )
  },
  {
    key: "goal_category",
    stage: 1,
    kind: "single_choice",
    text: {
      pt: "Qual destas áreas descreve melhor o teu objetivo?",
      en: "Which of these areas best describes your goal?"
    },
    options: choice(
      [
        ["Leitura", "reading"],
        ["Estudo", "study"],
        ["Saúde / exercício", "fitness"],
        ["Dinheiro", "money"],
        ["Casa / independência", "housing"],
        ["Carreira / trabalho", "career"],
        ["Projeto criativo", "creative"],
        ["Organização / produtividade", "productivity"],
        ["Saúde / bem-estar", "health"],
        ["Outra", "custom"]
      ],
      [
        ["Reading", "reading"],
        ["Study", "study"],
        ["Fitness / exercise", "fitness"],
        ["Money", "money"],
        ["Housing / independence", "housing"],
        ["Career / work", "career"],
        ["Creative project", "creative"],
        ["Organization / productivity", "productivity"],
        ["Health / wellbeing", "health"],
        ["Other", "custom"]
      ]
    )
  },
  {
    key: "clarity_level",
    stage: 1,
    kind: "single_choice",
    text: {
      pt: "Quão claro está o teu objetivo neste momento?",
      en: "How clear is your goal right now?"
    },
    options: choice(
      [
        ["Muito claro", "high"],
        ["Mais ou menos", "medium"],
        ["Ainda muito confuso", "low"]
      ],
      [
        ["Very clear", "high"],
        ["Somewhat clear", "medium"],
        ["Still very unclear", "low"]
      ]
    )
  },
  {
    key: "deadline_exists",
    stage: 1,
    kind: "boolean",
    text: {
      pt: "Tens um prazo definido?",
      en: "Do you have a defined deadline?"
    }
  },
  {
    key: "deadline_value_months",
    stage: 1,
    kind: "number",
    text: {
      pt: "Em quantos meses gostavas de atingir isto?",
      en: "In how many months would you like to achieve this?"
    },
    placeholder: {
      pt: "Ex.: 6",
      en: "E.g. 6"
    },
    min: 1,
    max: 120,
    unit: "months"
  },
  {
    key: "time_per_week_hours",
    stage: 1,
    kind: "number",
    text: {
      pt: "Quantas horas reais por semana tens para dedicar a isto?",
      en: "How many real hours per week do you have for this?"
    },
    hint: {
      pt: "Não é o ideal. É o que tens mesmo.",
      en: "Not ideally. Realistically."
    },
    placeholder: {
      pt: "Ex.: 4",
      en: "E.g. 4"
    },
    min: 0,
    max: 80,
    unit: "hours"
  },
  {
    key: "energy_level",
    stage: 1,
    kind: "single_choice",
    text: {
      pt: "Como está a tua energia neste momento?",
      en: "How is your energy right now?"
    },
    options: choice(
      [
        ["Baixa", "low"],
        ["Normal", "medium"],
        ["Alta", "high"]
      ],
      [
        ["Low", "low"],
        ["Normal", "medium"],
        ["High", "high"]
      ]
    )
  },
  {
    key: "pace_preference",
    stage: 1,
    kind: "single_choice",
    text: {
      pt: "Como preferes avançar?",
      en: "How do you prefer to move forward?"
    },
    options: choice(
      [
        ["Devagar e consistente", "slow"],
        ["Equilibrado", "balanced"],
        ["Intenso e rápido", "intense"]
      ],
      [
        ["Slow and consistent", "slow"],
        ["Balanced", "balanced"],
        ["Intense and fast", "intense"]
      ]
    )
  },
  {
    key: "main_blocker",
    stage: 1,
    kind: "single_choice",
    text: {
      pt: "Qual é o maior obstáculo neste momento?",
      en: "What is the biggest obstacle right now?"
    },
    options: choice(
      [
        ["Tempo", "time"],
        ["Dinheiro", "money"],
        ["Falta de energia", "energy"],
        ["Falta de foco", "focus"],
        ["Medo / ansiedade", "fear"],
        ["Falta de clareza", "clarity"],
        ["Dependo de outras pessoas", "dependency"],
        ["Outro", "other"]
      ],
      [
        ["Time", "time"],
        ["Money", "money"],
        ["Low energy", "energy"],
        ["Lack of focus", "focus"],
        ["Fear / anxiety", "fear"],
        ["Lack of clarity", "clarity"],
        ["I depend on other people", "dependency"],
        ["Other", "other"]
      ]
    )
  },
  {
    key: "consistency_vs_speed",
    stage: 1,
    kind: "single_choice",
    text: {
      pt: "O que valorizas mais neste plano?",
      en: "What do you value most in this plan?"
    },
    options: choice(
      [
        ["Consistência", "consistency"],
        ["Velocidade", "speed"],
        ["Sustentabilidade", "sustainability"]
      ],
      [
        ["Consistency", "consistency"],
        ["Speed", "speed"],
        ["Sustainability", "sustainability"]
      ]
    )
  },
  {
    key: "external_dependency",
    stage: 2,
    kind: "boolean",
    text: {
      pt: "Isto depende de outras pessoas para avançar?",
      en: "Does this depend on other people to move forward?"
    }
  },
  {
    key: "pressure_tolerance",
    stage: 2,
    kind: "single_choice",
    text: {
      pt: "Como lidas com pressão?",
      en: "How do you handle pressure?"
    },
    options: choice(
      [
        ["Mal", "low"],
        ["Razoavelmente", "medium"],
        ["Bem", "high"]
      ],
      [
        ["Poorly", "low"],
        ["Reasonably", "medium"],
        ["Well", "high"]
      ]
    )
  },
  {
    key: "wants_reminders",
    stage: 2,
    kind: "boolean",
    text: {
      pt: "Queres lembretes e revisões frequentes?",
      en: "Do you want reminders and frequent reviews?"
    }
  },
  {
    key: "risk_tolerance",
    stage: 2,
    kind: "single_choice",
    text: {
      pt: "Quão confortável estás com risco ou imprevisibilidade?",
      en: "How comfortable are you with risk or unpredictability?"
    },
    options: choice(
      [
        ["Pouco", "low"],
        ["Médio", "medium"],
        ["Muito", "high"]
      ],
      [
        ["Not much", "low"],
        ["Moderately", "medium"],
        ["Very", "high"]
      ]
    )
  }
];

export const QUANTIFIABLE_QUESTIONS: QuestionDefinition[] = [
  {
    key: "total_quantity",
    stage: 2,
    kind: "number",
    appliesTo: ["quantifiable"],
    text: {
      pt: "Qual é a quantidade total que queres completar?",
      en: "What is the total quantity you want to complete?"
    },
    placeholder: {
      pt: "Ex.: 2000",
      en: "E.g. 2000"
    },
    min: 1,
    max: 10000000
  },
  {
    key: "quantity_unit",
    stage: 2,
    kind: "single_choice",
    appliesTo: ["quantifiable"],
    text: {
      pt: "Qual é a unidade principal?",
      en: "What is the main unit?"
    },
    options: choice(
      [
        ["Páginas", "pages"],
        ["Capítulos", "chapters"],
        ["Horas", "hours"],
        ["Euros", "euros"],
        ["Temas", "topics"],
        ["Sessões", "sessions"],
        ["Outra", "other"]
      ],
      [
        ["Pages", "pages"],
        ["Chapters", "chapters"],
        ["Hours", "hours"],
        ["Euros", "euros"],
        ["Topics", "topics"],
        ["Sessions", "sessions"],
        ["Other", "other"]
      ]
    )
  },
  {
    key: "days_per_week_available",
    stage: 2,
    kind: "number",
    appliesTo: ["quantifiable"],
    text: {
      pt: "Em quantos dias por semana queres trabalhar nisto?",
      en: "On how many days per week do you want to work on this?"
    },
    min: 1,
    max: 7
  },
  {
    key: "wants_rest_days",
    stage: 2,
    kind: "boolean",
    appliesTo: ["quantifiable"],
    text: {
      pt: "Queres deixar dias de folga sem tocar nisto?",
      en: "Do you want rest days without touching this?"
    }
  },
  {
    key: "target_style",
    stage: 2,
    kind: "single_choice",
    appliesTo: ["quantifiable"],
    text: {
      pt: "Preferes metas diárias ou semanais?",
      en: "Do you prefer daily or weekly targets?"
    },
    options: choice(
      [
        ["Diárias", "daily"],
        ["Semanais", "weekly"]
      ],
      [
        ["Daily", "daily"],
        ["Weekly", "weekly"]
      ]
    )
  },
  {
    key: "buffer_percentage",
    stage: 3,
    kind: "number",
    appliesTo: ["quantifiable"],
    text: {
      pt: "Quanta folga queres deixar no plano em percentagem?",
      en: "How much buffer do you want in the plan, in percent?"
    },
    placeholder: {
      pt: "Ex.: 15",
      en: "E.g. 15"
    },
    min: 0,
    max: 80
  }
];

export const HABIT_QUESTIONS: QuestionDefinition[] = [
  {
    key: "habit_frequency_per_week",
    stage: 2,
    kind: "number",
    appliesTo: ["habit"],
    text: {
      pt: "Quantas vezes por semana queres fazer isto?",
      en: "How many times per week do you want to do this?"
    },
    min: 1,
    max: 14
  },
  {
    key: "habit_session_minutes",
    stage: 2,
    kind: "number",
    appliesTo: ["habit"],
    text: {
      pt: "Quanto tempo queres que dure cada sessão em minutos?",
      en: "How long do you want each session to last in minutes?"
    },
    min: 5,
    max: 300
  },
  {
    key: "habit_anchor",
    stage: 2,
    kind: "single_choice",
    appliesTo: ["habit"],
    text: {
      pt: "Queres associar este hábito a algum momento fixo?",
      en: "Do you want to attach this habit to a fixed moment?"
    },
    options: choice(
      [
        ["De manhã", "morning"],
        ["À tarde", "afternoon"],
        ["À noite", "night"],
        ["Depois de outra rotina", "after_existing_routine"],
        ["Ainda não sei", "unknown"]
      ],
      [
        ["Morning", "morning"],
        ["Afternoon", "afternoon"],
        ["Night", "night"],
        ["After another routine", "after_existing_routine"],
        ["Not sure yet", "unknown"]
      ]
    )
  },
  {
    key: "habit_start_small",
    stage: 2,
    kind: "boolean",
    appliesTo: ["habit"],
    text: {
      pt: "Queres começar com uma versão mínima para facilitar consistência?",
      en: "Do you want to start with a minimum version to make consistency easier?"
    }
  },
  {
    key: "habit_tracking_style",
    stage: 3,
    kind: "single_choice",
    appliesTo: ["habit"],
    text: {
      pt: "Como queres acompanhar este hábito?",
      en: "How do you want to track this habit?"
    },
    options: choice(
      [
        ["Só marcar feito/não feito", "simple"],
        ["Contar dias seguidos", "streak"],
        ["Rever por semana", "weekly_review"]
      ],
      [
        ["Just done/not done", "simple"],
        ["Count streaks", "streak"],
        ["Review weekly", "weekly_review"]
      ]
    )
  }
];

export const COMPLEX_QUESTIONS: QuestionDefinition[] = [
  {
    key: "subgoal_count",
    stage: 2,
    kind: "number",
    appliesTo: ["complex"],
    text: {
      pt: "Em quantas partes principais sentes que este objetivo se divide?",
      en: "Into how many main parts do you feel this goal divides?"
    },
    min: 1,
    max: 12
  },
  {
    key: "needs_money",
    stage: 2,
    kind: "boolean",
    appliesTo: ["complex"],
    text: {
      pt: "Este objetivo precisa de dinheiro para avançar?",
      en: "Does this goal require money to move forward?"
    }
  },
  {
    key: "needs_other_people",
    stage: 2,
    kind: "boolean",
    appliesTo: ["complex"],
    text: {
      pt: "Este objetivo depende de resposta ou ajuda de outras pessoas?",
      en: "Does this goal depend on replies or help from other people?"
    }
  },
  {
    key: "knowledge_gap",
    stage: 2,
    kind: "single_choice",
    appliesTo: ["complex"],
    text: {
      pt: "Quanto sentes que te falta saber antes de avançar?",
      en: "How much do you feel you still need to learn before moving forward?"
    },
    options: choice(
      [
        ["Pouco", "low"],
        ["Alguma coisa", "medium"],
        ["Muito", "high"]
      ],
      [
        ["Not much", "low"],
        ["Some", "medium"],
        ["A lot", "high"]
      ]
    )
  },
  {
    key: "current_readiness",
    stage: 2,
    kind: "single_choice",
    appliesTo: ["complex"],
    text: {
      pt: "Quão preparado te sentes neste momento?",
      en: "How ready do you feel right now?"
    },
    options: choice(
      [
        ["Nada preparado", "low"],
        ["Mais ou menos", "medium"],
        ["Bastante preparado", "high"]
      ],
      [
        ["Not ready at all", "low"],
        ["Somewhat ready", "medium"],
        ["Quite ready", "high"]
      ]
    )
  },
  {
    key: "preferred_first_step",
    stage: 3,
    kind: "single_choice",
    appliesTo: ["complex"],
    text: {
      pt: "Que tipo de primeiro passo te parece mais adequado?",
      en: "What kind of first step feels most appropriate?"
    },
    options: choice(
      [
        ["Clarificar mais", "clarify"],
        ["Pesquisar opções", "research"],
        ["Começar já com uma ação", "action"],
        ["Resolver o bloqueio principal", "solve_blocker"]
      ],
      [
        ["Clarify more", "clarify"],
        ["Research options", "research"],
        ["Start with an action now", "action"],
        ["Solve the main blocker first", "solve_blocker"]
      ]
    )
  }
];

export const HOUSING_QUESTIONS: QuestionDefinition[] = [
  {
    key: "income_monthly_net",
    stage: 3,
    kind: "number",
    categories: ["housing", "money"],
    text: {
      pt: "Qual é o teu rendimento líquido mensal?",
      en: "What is your monthly net income?"
    },
    min: 0,
    max: 100000
  },
  {
    key: "current_savings",
    stage: 3,
    kind: "number",
    categories: ["housing", "money"],
    text: {
      pt: "Quanto tens atualmente em poupanças?",
      en: "How much do you currently have in savings?"
    },
    min: 0,
    max: 10000000
  },
  {
    key: "fixed_expenses_monthly",
    stage: 3,
    kind: "number",
    categories: ["housing", "money"],
    text: {
      pt: "Quais são as tuas despesas fixas mensais atuais?",
      en: "What are your current monthly fixed expenses?"
    },
    min: 0,
    max: 100000
  },
  {
    key: "rent_ratio_max",
    stage: 3,
    kind: "number",
    categories: ["housing", "money"],
    text: {
      pt: "Qual a percentagem máxima do salário que aceitarias gastar em renda?",
      en: "What maximum percentage of your salary would you accept spending on rent?"
    },
    placeholder: {
      pt: "Ex.: 60",
      en: "E.g. 60"
    },
    min: 10,
    max: 90
  },
  {
    key: "wants_shared_housing",
    stage: 3,
    kind: "boolean",
    categories: ["housing"],
    text: {
      pt: "Estarias disposto a partilhar casa/quarto?",
      en: "Would you be willing to share a home/room?"
    }
  },
  {
    key: "move_urgency",
    stage: 3,
    kind: "single_choice",
    categories: ["housing"],
    text: {
      pt: "Quão urgente é sair de casa?",
      en: "How urgent is moving out?"
    },
    options: choice(
      [
        ["Baixa", "low"],
        ["Média", "medium"],
        ["Alta", "high"]
      ],
      [
        ["Low", "low"],
        ["Medium", "medium"],
        ["High", "high"]
      ]
    )
  }
];

export const READING_QUESTIONS: QuestionDefinition[] = [
  {
    key: "book_pages_total",
    stage: 3,
    kind: "number",
    categories: ["reading", "study"],
    text: {
      pt: "Quantas páginas tem no total?",
      en: "How many pages are there in total?"
    },
    min: 1,
    max: 20000
  },
  {
    key: "reading_days_per_week",
    stage: 3,
    kind: "number",
    categories: ["reading"],
    text: {
      pt: "Em quantos dias por semana queres ler?",
      en: "On how many days per week do you want to read?"
    },
    min: 1,
    max: 7
  },
  {
    key: "reading_target_style",
    stage: 3,
    kind: "single_choice",
    categories: ["reading"],
    text: {
      pt: "Preferes meta por páginas ou por tempo?",
      en: "Do you prefer a pages-based or time-based target?"
    },
    options: choice(
      [
        ["Páginas", "pages"],
        ["Tempo", "time"]
      ],
      [
        ["Pages", "pages"],
        ["Time", "time"]
      ]
    )
  }
];

export const BLOCKER_FOLLOW_UPS: Record<string, QuestionDefinition[]> = {
  money: [
    {
      key: "money_blocker_type",
      stage: 4,
      kind: "single_choice",
      text: {
        pt: "O problema principal do dinheiro é qual?",
        en: "What is the main money problem?"
      },
      options: choice(
        [
          ["Ganho pouco", "low_income"],
          ["Gasto demasiado", "high_expenses"],
          ["Não tenho poupanças", "no_savings"],
          ["Os custos são incertos", "uncertain_costs"]
        ],
        [
          ["I earn too little", "low_income"],
          ["I spend too much", "high_expenses"],
          ["I have no savings", "no_savings"],
          ["Costs are uncertain", "uncertain_costs"]
        ]
      )
    }
  ],
  time: [
    {
      key: "time_blocker_pattern",
      stage: 4,
      kind: "single_choice",
      text: {
        pt: "A falta de tempo vem mais de quê?",
        en: "What mostly causes your lack of time?"
      },
      options: choice(
        [
          ["Trabalho / estudo", "work_study"],
          ["Cansaço", "fatigue"],
          ["Má organização", "poor_structure"],
          ["Distrações", "distractions"]
        ],
        [
          ["Work / study", "work_study"],
          ["Fatigue", "fatigue"],
          ["Poor structure", "poor_structure"],
          ["Distractions", "distractions"]
        ]
      )
    }
  ],
  fear: [
    {
      key: "fear_blocker_type",
      stage: 4,
      kind: "single_choice",
      text: {
        pt: "O medo está mais ligado a quê?",
        en: "What is the fear mostly related to?"
      },
      options: choice(
        [
          ["Falhar", "failure"],
          ["Mudar demasiado", "change"],
          ["Perder segurança", "security"],
          ["Ser julgado", "judgment"]
        ],
        [
          ["Failing", "failure"],
          ["Too much change", "change"],
          ["Losing security", "security"],
          ["Being judged", "judgment"]
        ]
      )
    }
  ],
  focus: [
    {
      key: "focus_blocker_type",
      stage: 4,
      kind: "single_choice",
      text: {
        pt: "O foco falha mais por quê?",
        en: "Why does focus fail the most?"
      },
      options: choice(
        [
          ["Telemóvel / internet", "phone_internet"],
          ["Excesso de tarefas", "too_many_tasks"],
          ["Falta de interesse", "low_interest"],
          ["Cansaço mental", "mental_fatigue"]
        ],
        [
          ["Phone / internet", "phone_internet"],
          ["Too many tasks", "too_many_tasks"],
          ["Low interest", "low_interest"],
          ["Mental fatigue", "mental_fatigue"]
        ]
      )
    }
  ],
  clarity: [
    {
      key: "clarity_blocker_type",
      stage: 4,
      kind: "single_choice",
      text: {
        pt: "O que está menos claro?",
        en: "What is least clear?"
      },
      options: choice(
        [
          ["O objetivo final", "end_goal"],
          ["Os passos", "steps"],
          ["O prazo", "deadline"],
          ["Se isto vale a pena", "worth_it"]
        ],
        [
          ["The final goal", "end_goal"],
          ["The steps", "steps"],
          ["The deadline", "deadline"],
          ["Whether it is worth it", "worth_it"]
        ]
      )
    }
  ]
};

export function getInitialQuestions(locale: Locale): QuestionDefinition[] {
  return UNIVERSAL_QUESTIONS;
}

export function getQuestionSet(params: {
  locale: Locale;
  goalType?: GoalType;
  category?: GoalCategory;
  answers?: AnswerMap;
}): QuestionDefinition[] {
  const { goalType, category, answers = {} } = params;

  const result: QuestionDefinition[] = [...UNIVERSAL_QUESTIONS];

  if (goalType === "quantifiable") result.push(...QUANTIFIABLE_QUESTIONS);
  if (goalType === "habit") result.push(...HABIT_QUESTIONS);
  if (goalType === "complex") result.push(...COMPLEX_QUESTIONS);

  if (category === "housing" || category === "money") result.push(...HOUSING_QUESTIONS);
  if (category === "reading" || category === "study") result.push(...READING_QUESTIONS);

  const blocker = answers["main_blocker"];
  if (typeof blocker === "string" && BLOCKER_FOLLOW_UPS[blocker]) {
    result.push(...BLOCKER_FOLLOW_UPS[blocker]);
  }

  return dedupeQuestions(result);
}

function dedupeQuestions(list: QuestionDefinition[]) {
  const seen = new Set<string>();
  return list.filter((item) => {
    if (seen.has(item.key)) return false;
    seen.add(item.key);
    return true;
  });
}