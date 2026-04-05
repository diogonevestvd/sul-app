import type { Locale } from "@/lib/copy";

export type QuestionOption = {
  label: string;
  value: string;
};

export type GeneratedQuestion = {
  id: string;
  text: string;
  options: QuestionOption[];
  stage: number;
  hint?: string;
};

export function generateQuestions(goal: string, locale: Locale): GeneratedQuestion[] {
  if (locale === "en") {
    return [
      {
        id: "time_commitment",
        stage: 1,
        text: "How much time do you want to dedicate per week?",
        options: [
          { label: "A little", value: "low" },
          { label: "A moderate amount", value: "medium" },
          { label: "A lot", value: "high" }
        ],
        hint: "This helps adjust the pace of the plan."
      },
      {
        id: "deadline",
        stage: 1,
        text: "Do you have a deadline?",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
          { label: "I'd rather answer something else", value: "skip" }
        ]
      },
      {
        id: "energy",
        stage: 2,
        text: "How is your energy right now?",
        options: [
          { label: "Low", value: "low" },
          { label: "Normal", value: "medium" },
          { label: "High", value: "high" }
        ]
      },
      {
        id: "pace",
        stage: 2,
        text: "How do you prefer to move forward?",
        options: [
          { label: "Slowly", value: "slow" },
          { label: "Balanced", value: "balanced" },
          { label: "Intensely", value: "intense" }
        ]
      },
      {
        id: "blocker",
        stage: 3,
        text: "What is the biggest obstacle right now?",
        options: [
          { label: "Time", value: "time" },
          { label: "Money", value: "money" },
          { label: "Motivation", value: "motivation" },
          { label: "Other", value: "other" }
        ]
      }
    ];
  }

  return [
    {
      id: "time_commitment",
      stage: 1,
      text: "Quanto tempo queres dedicar por semana?",
      options: [
        { label: "Pouco", value: "low" },
        { label: "Médio", value: "medium" },
        { label: "Muito", value: "high" }
      ],
      hint: "Isto ajuda a ajustar o ritmo do plano."
    },
    {
      id: "deadline",
      stage: 1,
      text: "Tens um prazo definido?",
      options: [
        { label: "Sim", value: "yes" },
        { label: "Não", value: "no" },
        { label: "Prefiro outra pergunta", value: "skip" }
      ]
    },
    {
      id: "energy",
      stage: 2,
      text: "Como está a tua energia atualmente?",
      options: [
        { label: "Baixa", value: "low" },
        { label: "Normal", value: "medium" },
        { label: "Alta", value: "high" }
      ]
    },
    {
      id: "pace",
      stage: 2,
      text: "Como preferes avançar?",
      options: [
        { label: "Devagar", value: "slow" },
        { label: "Equilibrado", value: "balanced" },
        { label: "Intenso", value: "intense" }
      ]
    },
    {
      id: "blocker",
      stage: 3,
      text: "Qual é o maior obstáculo neste momento?",
      options: [
        { label: "Tempo", value: "time" },
        { label: "Dinheiro", value: "money" },
        { label: "Motivação", value: "motivation" },
        { label: "Outro", value: "other" }
      ]
    }
  ];
}