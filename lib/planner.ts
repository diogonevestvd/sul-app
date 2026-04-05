export type GoalType = 'quantifiable' | 'complex' | 'habit';

export type PlannerInput = {
  goal: string;
  type: GoalType;
  deadline?: Date;
  totalAmount?: number; // ex: 2000 páginas
  timePerWeek?: number; // horas
  energyLevel: 'low' | 'medium' | 'high';
  pace: 'slow' | 'balanced' | 'intense';
  blockers: string[];
};

export type PlanPhase = {
  title: string;
  tasks: string[];
};

export type GeneratedPlan = {
  title: string;
  phases: PlanPhase[];
};

export function generatePlan(input: PlannerInput): GeneratedPlan {
  if (input.type === 'quantifiable') {
    return generateQuantifiablePlan(input);
  }

  if (input.type === 'habit') {
    return generateHabitPlan(input);
  }

  return generateComplexPlan(input);
}
function generateQuantifiablePlan(input: PlannerInput): GeneratedPlan {
  if (!input.totalAmount || !input.deadline) {
    return {
      title: input.goal,
      phases: [
        {
          title: 'Definir estrutura',
          tasks: ['Define quantidade total e prazo']
        }
      ]
    };
  }

  const now = new Date();
  const totalDays = Math.max(
    1,
    Math.ceil((input.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  let dailyAmount = input.totalAmount / totalDays;

  // ajuste por energia
  if (input.energyLevel === 'low') dailyAmount *= 0.7;
  if (input.energyLevel === 'high') dailyAmount *= 1.2;

  dailyAmount = Math.max(1, Math.round(dailyAmount));

  return {
    title: input.goal,
    phases: [
      {
        title: 'Execução diária',
        tasks: [
          `Fazer ${dailyAmount} unidades por dia`,
          `Ajustar ritmo semanalmente`,
          `Não falhar 2 dias seguidos`
        ]
      }
    ]
  };
}
function generateHabitPlan(input: PlannerInput): GeneratedPlan {
  const frequency =
    input.pace === 'slow' ? 3 : input.pace === 'intense' ? 6 : 4;

  return {
    title: input.goal,
    phases: [
      {
        title: 'Construir consistência',
        tasks: [
          `${frequency} vezes por semana`,
          'Manter horário fixo',
          'Não quebrar cadeia'
        ]
      },
      {
        title: 'Aumentar intensidade',
        tasks: [
          'Aumentar dificuldade gradualmente',
          'Monitorizar progresso'
        ]
      }
    ]
  };
}
function generateComplexPlan(input: PlannerInput): GeneratedPlan {
  const phases: PlanPhase[] = [
    {
      title: 'Clarificar',
      tasks: [
        'Definir objetivo concreto',
        'Identificar maior bloqueio'
      ]
    },
    {
      title: 'Preparar',
      tasks: [
        'Reunir recursos necessários',
        'Eliminar obstáculos simples'
      ]
    },
    {
      title: 'Executar',
      tasks: [
        'Começar com ações pequenas',
        'Criar consistência'
      ]
    },
    {
      title: 'Ajustar',
      tasks: [
        'Rever progresso semanalmente',
        'Adaptar plano'
      ]
    }
  ];

  // adaptação por bloqueios
  if (input.blockers.includes('money')) {
    phases.splice(1, 0, {
      title: 'Resolver financeiro',
      tasks: ['Criar plano de poupança', 'Aumentar rendimento']
    });
  }

  if (input.energyLevel === 'low') {
    phases[2].tasks = phases[2].tasks.map(
      (t) => t + ' (versão simplificada)'
    );
  }

  return {
    title: input.goal,
    phases
  };
}