export type Locale = 'pt' | 'en';

export const copy = {
  pt: {
    appName: 'Sul',
    labels: {
      language: 'Idioma',
      logout: 'Sair',
      createWorkspace: 'Novo plano',
      create: 'Criar',
      save: 'Guardar',
      regenerate: 'Atualizar',
      loading: 'A carregar…',
      optional: 'Opcional',
      addNote: 'Adicionar nota de preferência',
      addAnswer: 'Guardar resposta',
      noPlan: 'Ainda não há plano gerado.',
      noQuestions: 'Ainda não há perguntas geradas.',
      silentAi: 'Auxiliar silencioso',
      summary: 'Resumo',
      phases: 'Fases',
      editPlan: 'Editar plano',
      yourWorkspaces: 'Os teus planos',
      entries: 'Captura',
      questions: 'Perguntas',
      overview: 'Visão geral',
      preferences: 'Preferências do utilizador',
      signIn: 'Entrar',
      signUp: 'Criar conta'
    },
    auth: {
      title: 'Uma interface calma para objetivos complicados.',
      subtitle:
        'Escreve ideias, identifica bloqueios e deixa o sistema montar um plano realista sem roubar controlo.',
      name: 'Nome',
      email: 'Email',
      password: 'Palavra-passe',
      loginHint: 'Já tens conta?',
      signupHint: 'Ainda não tens conta?',
      loginCta: 'Entrar',
      signupCta: 'Criar conta',
      visualHint: 'Branco, bordeaux e menos ruído logo à entrada.'
    },
    dashboard: {
      welcome: 'Menos pressão. Mais direção.',
      intro:
        'A Sul ajuda a perceberes o que queres, organiza o que escreves e adapta-se ao teu ritmo.',
      emptyWorkspace: 'Cria um plano para começar a despejar ideias e organizar o teu caminho.',
      placeholderTitle: 'Ex.: Sair de casa',
      titleLabel: 'Nome do plano',
      objectiveLabel: 'Objetivo principal',
      objectivePlaceholder: 'Ex.: Quero sair de casa com estabilidade.',
      ideas: 'Ideias',
      blockers: 'Bloqueios',
      resources: 'Recursos',
      ideasPlaceholder: 'Escreve ideias soltas, intenções ou caminhos possíveis.',
      blockersPlaceholder: 'O que te trava mais neste momento?',
      resourcesPlaceholder: 'Tempo, apoios, competências, dinheiro, contactos…',
      notePlaceholder: 'Ex.: Prefiro passos pequenos e pouca pressão semanal.',
      questionHint: 'Esta pergunta existe para tornar o plano mais realista e menos genérico.',
      workspaceSummaryFallback: 'Sem resumo ainda. Guarda entradas e pede ao sistema para atualizar.',
      defaultPlanTitle: 'Plano base',
      tabs: {
        overview: 'Visão geral',
        capture: 'Captura',
        questions: 'Perguntas',
        plan: 'Plano'
      }
    }
  },
  en: {
    appName: 'Sul',
    labels: {
      language: 'Language',
      logout: 'Log out',
      createWorkspace: 'New plan',
      create: 'Create',
      save: 'Save',
      regenerate: 'Refresh',
      loading: 'Loading…',
      optional: 'Optional',
      addNote: 'Add preference note',
      addAnswer: 'Save answer',
      noPlan: 'No plan generated yet.',
      noQuestions: 'No questions generated yet.',
      silentAi: 'Silent assistant',
      summary: 'Summary',
      phases: 'Phases',
      editPlan: 'Edit plan',
      yourWorkspaces: 'Your plans',
      entries: 'Capture',
      questions: 'Questions',
      overview: 'Overview',
      preferences: 'User preferences',
      signIn: 'Sign in',
      signUp: 'Create account'
    },
    auth: {
      title: 'A calm interface for complicated goals.',
      subtitle:
        'Write ideas down, identify blockers, and let the system build a realistic plan without taking control away from you.',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      loginHint: 'Already have an account?',
      signupHint: 'Do not have an account yet?',
      loginCta: 'Sign in',
      signupCta: 'Create account',
      visualHint: 'White, bordeaux, and less noise on first entry.'
    },
    dashboard: {
      welcome: 'Less pressure. More direction.',
      intro:
        'Sul helps you organize what you write and adapts to your pace in order to fulfill your objective.',
      emptyWorkspace: 'Create a plan to start dumping ideas and organizing your path.',
      placeholderTitle: 'Ex.: Move out',
      titleLabel: 'Plan name',
      objectiveLabel: 'Main goal',
      objectivePlaceholder: 'Ex.: I want to move out with stability.',
      ideas: 'Ideas',
      blockers: 'Blockers',
      resources: 'Resources',
      ideasPlaceholder: 'Write loose ideas, intentions, or possible directions.',
      blockersPlaceholder: 'What is holding you back the most right now?',
      resourcesPlaceholder: 'Time, support, skills, money, contacts…',
      notePlaceholder: 'Ex.: I prefer small steps and low weekly pressure.',
      questionHint: 'This question exists to make the plan more realistic and less generic.',
      workspaceSummaryFallback: 'No summary yet. Save entries and ask the system to refresh.',
      defaultPlanTitle: 'Base plan',
      tabs: {
        overview: 'Overview',
        capture: 'Capture',
        questions: 'Questions',
        plan: 'Plan'
      }
    }
  }
} as const;
