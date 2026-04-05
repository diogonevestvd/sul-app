export type SessionUser = {
  id: string;
  name: string;
  email: string;
  locale: 'pt' | 'en';
};

export type EntryRecord = {
  id: string;
  kind: 'ideas' | 'blockers' | 'resources';
  content: string;
};

export type QuestionOption = {
  label: string;
  value: string;
};

export type QuestionKind =
  | 'single_choice'
  | 'number'
  | 'text'
  | 'boolean'
  | 'date';

export type QuestionRecord = {
  id: string;
  key: string;
  kind: QuestionKind;
  text: string;
  hint: string;
  stage: number;
  answer: string | null;
  options: QuestionOption[];
};

export type PlanPhase = {
  title: string;
  body: string;
};

export type PlanRecord = {
  id: string;
  title: string;
  summary: string;
  phases: PlanPhase[];
  source: string;
};

export type PreferenceNoteRecord = {
  id: string;
  content: string;
};

export type WorkspaceRecord = {
  id: string;
  title: string;
  objective: string | null;
  summary: string | null;
  locale: 'pt' | 'en';
  entries: EntryRecord[];
  questions: QuestionRecord[];
  planVersions: PlanRecord[];
  notes: PreferenceNoteRecord[];
  updatedAt: string;
};
