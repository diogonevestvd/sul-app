'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Languages, Plus, Sparkles } from 'lucide-react';
import { copy, type Locale } from '@/lib/copy';
import type { PlanRecord, QuestionRecord, WorkspaceRecord } from '@/lib/types';
import { cn } from '@/lib/utils';

type TabKey = 'overview' | 'capture' | 'questions' | 'plan';

type ApiState = {
  workspaces: WorkspaceRecord[];
};

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data as T;
}

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('rounded-[1.5rem] sm:rounded-[1.9rem] border border-white/80 bg-white shadow-card', className)}>{children}</div>;
}

function InfoBubble({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-bordeaux-100 bg-bordeaux-50 text-xs font-bold text-bordeaux-700">
      i
      <span className="pointer-events-none absolute right-0 top-10 z-20 hidden w-60 rounded-2xl border border-bordeaux-100 bg-white p-3 text-left text-xs font-medium leading-6 text-neutral-600 shadow-card group-hover:block md:w-64">
        {text || '—'}
      </span>
    </span>
  );
}

function IntroScreen({ locale, onLocaleChange, onStart }: { locale: Locale; onLocaleChange: (locale: Locale) => void; onStart: () => void }) {
  const t = copy[locale];

  return (
    <main className="min-h-screen bg-paper px-4 py-4 text-neutral-900 sm:px-6 sm:py-6 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-5 lg:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.08fr,0.92fr] lg:gap-6">
        <Card className="overflow-hidden bg-gradient-to-br from-white via-white to-bordeaux-50 p-5 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="w-fit rounded-full border border-bordeaux-100 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-bordeaux-700 shadow-sm sm:text-xs">
              {t.labels.silentAi}
            </div>
            <button
              onClick={() => onLocaleChange(locale === 'pt' ? 'en' : 'pt')}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-bordeaux-100 bg-white px-4 py-2 text-sm font-semibold text-bordeaux-800 sm:w-auto"
            >
              <Languages size={16} />
              {locale === 'pt' ? 'PT' : 'EN'}
            </button>
          </div>

          <div className="mt-8 max-w-2xl sm:mt-10 lg:mt-12">
            <h1 className="font-display text-4xl tracking-[-0.05em] text-bordeaux-900 sm:text-5xl lg:text-6xl">Sul</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-700 sm:mt-5 sm:text-base sm:leading-8">
              {t.auth.subtitle}
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:mt-10 md:grid-cols-3 md:gap-4">
            {[
              t.auth.visualHint,
              locale === 'pt' ? 'Planos editáveis em várias abas.' : 'Editable plans across multiple tabs.',
              locale === 'pt' ? 'Perguntas gerais primeiro, específicas depois.' : 'General questions first, specific ones later.'
            ].map((item) => (
              <div key={item} className="rounded-[1rem] sm:rounded-[1.5rem] bg-white/90 p-4 text-sm leading-6 text-neutral-700 shadow-card">
                {item}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 sm:p-7 sm:px-8 self-stretch">
          <div className="rounded-[1.3rem] sm:rounded-[1.5rem] bg-bordeaux-50/70 p-4 sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bordeaux-600 sm:text-xs">
              {locale === 'pt' ? 'Introdução' : 'Introduction'}
            </p>
            <p className="mt-4 text-sm leading-7 text-neutral-700">
              {locale === 'pt'
                ? 'Sul ajuda-te a transformar confusão em estrutura. Escolhes o tipo de objetivo, respondes às perguntas certas e recebes um plano editável e realista.'
                : 'Sul helps you turn confusion into structure. You choose the goal type, answer the right questions, and get an editable realistic plan.'}
            </p>
            <button
              onClick={onStart}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-bordeaux-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-bordeaux-800"
            >
              {locale === 'pt' ? 'Começar' : 'Start'}
            </button>
          </div>
          <div className="mt-5 rounded-[1.1rem] sm:rounded-[1.2rem] border border-bordeaux-100 p-4 text-sm text-neutral-600">
            {locale === 'pt'
              ? 'Nesta fase não precisas de conta. A prioridade é testar o fluxo principal da aplicação.'
              : 'At this stage you do not need an account. The priority is testing the core flow of the application.'}
          </div>
        </Card>
      </div>
    </main>
  );
}

export function HomeShell() {
  const [locale, setLocale] = useState<Locale>('pt');
  const [state, setState] = useState<ApiState>({ workspaces: [] });
  const [booting, setBooting] = useState(true);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    async function boot() {
      try {
        const list = await request<{ workspaces: WorkspaceRecord[] }>('/api/workspaces');
        setState({ workspaces: list.workspaces });
        if (list.workspaces[0]?.locale) {
          setLocale(list.workspaces[0].locale);
        }
      } catch {
        setState({ workspaces: [] });
      } finally {
        setBooting(false);
      }
    }
    void boot();
  }, []);

  if (booting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper text-bordeaux-800">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-bordeaux-200 border-t-bordeaux-700" />
      </div>
    );
  }

  if (!started) {
    return <IntroScreen locale={locale} onLocaleChange={setLocale} onStart={() => setStarted(true)} />;
  }

  return (
    <Dashboard
      locale={locale}
      initialWorkspaces={state.workspaces}
      onLocaleChange={setLocale}
    />
  );
}

function Dashboard({
  locale,
  initialWorkspaces,
  onLocaleChange
}: {
  locale: Locale;
  initialWorkspaces: WorkspaceRecord[];
  onLocaleChange: (locale: Locale) => void;
}) {
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [selectedId, setSelectedId] = useState(initialWorkspaces[0]?.id || null);
  const [tab, setTab] = useState<TabKey>('overview');
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const t = copy[locale];

  useEffect(() => {
    setWorkspaces(initialWorkspaces);
  }, [initialWorkspaces]);

  const activeWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace.id === selectedId) || workspaces[0] || null,
    [selectedId, workspaces]
  );

  useEffect(() => {
    if (!selectedId && workspaces[0]) setSelectedId(workspaces[0].id);
  }, [selectedId, workspaces]);

  async function createWorkspace() {
    if (!title.trim()) return;
    setCreating(true);
    try {
      const data = await request<{ workspace: WorkspaceRecord }>('/api/workspaces', {
        method: 'POST',
        body: JSON.stringify({ title, objective, locale })
      });
      setWorkspaces((current) => [data.workspace, ...current]);
      setSelectedId(data.workspace.id);
      setTitle('');
      setObjective('');
      setMessage(locale === 'pt' ? 'Plano criado.' : 'Plan created.');
    } finally {
      setCreating(false);
    }
  }

  async function addContent(kind: 'ideas' | 'blockers' | 'resources' | 'note', content: string) {
    if (!activeWorkspace || !content.trim()) return;
    setSaving(true);
    try {
      const data = await request<{ workspace: WorkspaceRecord }>(`/api/workspaces/${activeWorkspace.id}/entries`, {
        method: 'POST',
        body: JSON.stringify({ kind, content })
      });
      setWorkspaces((current) => current.map((item) => (item.id === data.workspace.id ? data.workspace : item)));
      setMessage(locale === 'pt' ? 'Guardado.' : 'Saved.');
    } finally {
      setSaving(false);
    }
  }

  async function regenerate() {
    if (!activeWorkspace) return;
    setSaving(true);
    try {
      const data = await request<{ workspace: WorkspaceRecord }>(`/api/workspaces/${activeWorkspace.id}/generate`, {
        method: 'POST'
      });
      setWorkspaces((current) => current.map((item) => (item.id === data.workspace.id ? data.workspace : item)));
      setMessage(locale === 'pt' ? 'Plano atualizado.' : 'Plan refreshed.');
    } finally {
      setSaving(false);
    }
  }

  async function saveAnswer(question: QuestionRecord, answer: string) {
    if (!activeWorkspace || !answer.trim()) return;
    const data = await request<{ workspace: WorkspaceRecord }>(
      `/api/workspaces/${activeWorkspace.id}/questions/${question.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ answer })
      }
    );
    setWorkspaces((current) => current.map((item) => (item.id === data.workspace.id ? data.workspace : item)));
    setMessage(locale === 'pt' ? 'Resposta guardada.' : 'Answer saved.');
  }

  async function savePlan(plan: PlanRecord) {
    if (!activeWorkspace) return;
    const data = await request<{ workspace: WorkspaceRecord }>(`/api/workspaces/${activeWorkspace.id}/plan/${plan.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: plan.title,
        summary: plan.summary,
        phases: plan.phases
      })
    });
    setWorkspaces((current) => current.map((item) => (item.id === data.workspace.id ? data.workspace : item)));
    setMessage(locale === 'pt' ? 'Plano editado.' : 'Plan updated.');
  }

  return (
    <main className="min-h-screen bg-paper px-4 py-4 text-neutral-900 sm:px-6 sm:py-5 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[1.25rem] sm:rounded-[2rem] border border-white/80 bg-gradient-to-br from-white via-white to-bordeaux-50 p-4 shadow-soft sm:p-6 lg:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex rounded-full border border-bordeaux-100 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-bordeaux-700 shadow-sm sm:text-xs">
                {t.labels.silentAi}
              </div>
              <h1 className="mt-4 font-display text-[1.85rem] leading-[1.02] tracking-[-0.05em] text-bordeaux-900 sm:mt-5 sm:text-5xl lg:text-6xl">
                {t.dashboard.welcome}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-700 sm:mt-4 sm:text-base">
                {t.dashboard.intro}
              </p>
              {message && <p className="mt-4 text-sm font-medium text-bordeaux-700">{message}</p>}
            </div>

            <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[340px] lg:items-end">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-1 lg:flex">
                <button
                  onClick={() => onLocaleChange(locale === 'pt' ? 'en' : 'pt')}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-bordeaux-100 bg-white px-4 py-2 text-sm font-semibold text-bordeaux-800"
                >
                  <Languages size={16} />
                  {locale === 'pt' ? 'PT' : 'EN'}
                </button>
              </div>

              <Card className="w-full p-4 sm:p-5 lg:w-[340px]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bordeaux-500 sm:text-xs">
                  {t.labels.createWorkspace}
                </p>
                <div className="mt-4 space-y-3">
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder={t.dashboard.placeholderTitle}
                    className="w-full rounded-[1rem] sm:rounded-[1.15rem] border border-bordeaux-100 bg-bordeaux-50/50 px-4 py-3 outline-none focus:border-bordeaux-300"
                  />
                  <input
                    value={objective}
                    onChange={(event) => setObjective(event.target.value)}
                    placeholder={t.dashboard.objectivePlaceholder}
                    className="w-full rounded-[1rem] sm:rounded-[1.15rem] border border-bordeaux-100 bg-bordeaux-50/50 px-4 py-3 outline-none focus:border-bordeaux-300"
                  />
                </div>
                <button
                  onClick={createWorkspace}
                  disabled={creating}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-bordeaux-700 px-4 py-3.5 text-sm font-semibold text-white active:scale-[0.99]"
                >
                  {creating ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" /> : <Plus size={16} />}
                  {t.labels.createWorkspace}
                </button>
              </Card>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 lg:gap-6 xl:grid-cols-[300px,1fr]">
          <Card className="p-4 xl:sticky xl:top-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bordeaux-500 sm:text-xs">
                {t.labels.yourWorkspaces}
              </p>
              <span className="rounded-full bg-bordeaux-50 px-3 py-1 text-xs font-semibold text-bordeaux-700">
                {workspaces.length}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {workspaces.length === 0 && <p className="text-sm leading-7 text-neutral-600">{t.dashboard.emptyWorkspace}</p>}
              {workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => setSelectedId(workspace.id)}
                  className={cn(
                    'w-full rounded-[1.2rem] sm:rounded-[1.4rem] border p-4 text-left transition active:scale-[0.99]',
                    workspace.id === activeWorkspace?.id
                      ? 'border-bordeaux-200 bg-bordeaux-50/80'
                      : 'border-transparent bg-neutral-50 hover:border-bordeaux-100 hover:bg-bordeaux-50/40'
                  )}
                >
                  <p className="font-semibold text-bordeaux-900">{workspace.title}</p>
                  <p className="mt-1 text-sm leading-6 text-neutral-600 line-clamp-3">
                    {workspace.summary || workspace.objective || t.dashboard.workspaceSummaryFallback}
                  </p>
                </button>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            {activeWorkspace && (
              <>
                <nav className="overflow-x-auto rounded-[1.1rem] sm:rounded-full border border-bordeaux-100 bg-white/95 p-2 shadow-card backdrop-blur">
  <div className="flex min-w-max gap-2 pb-1">
                    {(['overview', 'capture', 'questions', 'plan'] as TabKey[]).map((item) => (
                      <button
                        key={item}
                        onClick={() => setTab(item)}
                        className={cn(
  'rounded-full px-4 py-3.5 text-sm font-semibold whitespace-nowrap transition active:scale-[0.98]',
                          tab === item ? 'bg-bordeaux-700 text-white' : 'text-bordeaux-700 hover:bg-bordeaux-50'
                        )}
                      >
                        {t.dashboard.tabs[item]}
                      </button>
                    ))}
                  </div>
                </nav>

                {tab === 'overview' && <OverviewPanel locale={locale} workspace={activeWorkspace} onRegenerate={regenerate} saving={saving} />}
                {tab === 'capture' && <CapturePanel locale={locale} workspace={activeWorkspace} onSave={addContent} saving={saving} />}
                {tab === 'questions' && <QuestionsPanel locale={locale} workspace={activeWorkspace} onSaveAnswer={saveAnswer} />}
                {tab === 'plan' && <PlanPanel locale={locale} workspace={activeWorkspace} onSavePlan={savePlan} />}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function OverviewPanel({
  locale,
  workspace,
  onRegenerate,
  saving
}: {
  locale: Locale;
  workspace: WorkspaceRecord;
  onRegenerate: () => void;
  saving: boolean;
}) {
  const t = copy[locale];
  const latestPlan = workspace.planVersions[0];

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
      <Card className="p-5 sm:p-6 lg:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bordeaux-500 sm:text-xs">
              {t.labels.overview}
            </p>
            <h2 className="mt-3 font-display text-2xl tracking-[-0.03em] text-bordeaux-900 sm:text-3xl">
              {workspace.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-700">
              {workspace.summary || workspace.objective || t.dashboard.workspaceSummaryFallback}
            </p>
          </div>
          <Sparkles className="shrink-0 text-bordeaux-600" />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            workspace.objective || '—',
            workspace.entries.filter((entry) => entry.kind === 'blockers').length.toString(),
            workspace.questions.filter((question) => question.answer).length.toString()
          ].map((item, index) => (
            <div key={index} className="rounded-[1rem] sm:rounded-[1.5rem] bg-bordeaux-50 p-4">
              <p className="text-sm font-semibold text-bordeaux-800">
                {index === 0 ? t.dashboard.objectiveLabel : index === 1 ? t.dashboard.blockers : t.labels.questions}
              </p>
              <p className="mt-2 text-sm leading-6 text-bordeaux-900/90 break-words">{item}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5 sm:p-6 lg:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bordeaux-500 sm:text-xs">
          {t.labels.silentAi}
        </p>
        <p className="mt-3 text-sm leading-7 text-neutral-700">
          {locale === 'pt'
            ? 'Sempre que carregas em atualizar, o sistema revê entradas, preferências, respostas e cria uma nova versão do plano.'
            : 'Whenever you refresh, the system reviews entries, preferences, answers, and creates a new plan version.'}
        </p>
        <button
          onClick={onRegenerate}
          disabled={saving}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-bordeaux-700 px-4 py-3 text-sm font-semibold text-white sm:w-auto"
        >
          {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" /> : <ChevronDown size={16} />}
          {t.labels.regenerate}
        </button>
        <div className="mt-5 rounded-[1.2rem] sm:rounded-[1.4rem] bg-bordeaux-50/50 p-4 text-sm leading-7 text-neutral-700">
          {latestPlan?.summary || t.labels.noPlan}
        </div>
      </Card>
    </div>
  );
}

function CapturePanel({
  locale,
  workspace,
  onSave,
  saving
}: {
  locale: Locale;
  workspace: WorkspaceRecord;
  onSave: (kind: 'ideas' | 'blockers' | 'resources' | 'note', content: string) => Promise<void>;
  saving: boolean;
}) {
  const t = copy[locale];
  const [ideas, setIdeas] = useState('');
  const [blockers, setBlockers] = useState('');
  const [resources, setResources] = useState('');
  const [note, setNote] = useState('');

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
      <Card className="p-5 sm:p-6 lg:p-7">
        <div className="grid gap-4">
          {[
            ['ideas', t.dashboard.ideas, ideas, setIdeas, t.dashboard.ideasPlaceholder],
            ['blockers', t.dashboard.blockers, blockers, setBlockers, t.dashboard.blockersPlaceholder],
            ['resources', t.dashboard.resources, resources, setResources, t.dashboard.resourcesPlaceholder]
          ].map(([kind, label, value, setter, placeholder]) => (
            <div key={String(kind)}>
              <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <label className="text-sm font-semibold text-bordeaux-900">{String(label)}</label>
                <button
                  onClick={() =>
                    void onSave(kind as 'ideas' | 'blockers' | 'resources', String(value)).then(() =>
                      (setter as (v: string) => void)('')
                    )
                  }
                  className="w-full rounded-full border border-bordeaux-100 px-3 py-3 text-xs font-semibold text-bordeaux-700 sm:w-auto sm:py-1"
                >
                  {saving ? t.labels.loading : t.labels.save}
                </button>
              </div>
              <textarea
                value={String(value)}
                onChange={(event) => (setter as (v: string) => void)(event.target.value)}
                placeholder={String(placeholder)}
                rows={4}
                className="w-full rounded-[1.2rem] sm:rounded-[1.35rem] border border-bordeaux-100 bg-bordeaux-50/30 px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-bordeaux-300"
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5 sm:p-6 lg:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bordeaux-500 sm:text-xs">
              {t.labels.preferences}
            </p>
            <p className="mt-3 text-sm leading-7 text-neutral-700">
              {locale === 'pt'
                ? 'Usa notas para ensinar o sistema sobre o teu ritmo, tolerância à pressão e forma preferida de avançar.'
                : 'Use notes to teach the system about your pace, pressure tolerance, and preferred way of moving forward.'}
            </p>
          </div>
          <InfoBubble text={t.dashboard.questionHint} />
        </div>

        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={t.dashboard.notePlaceholder}
          rows={4}
          className="mt-5 w-full rounded-[1.2rem] sm:rounded-[1.35rem] border border-bordeaux-100 bg-bordeaux-50/30 px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-bordeaux-300"
        />

        <button
          onClick={() => void onSave('note', note).then(() => setNote(''))}
          className="mt-4 w-full rounded-full bg-bordeaux-700 px-4 py-3 text-sm font-semibold text-white sm:w-auto"
        >
          {t.labels.addNote}
        </button>

        <div className="mt-6 space-y-3">
          {workspace.notes.map((item) => (
            <div key={item.id} className="rounded-[1.1rem] sm:rounded-[1.2rem] bg-bordeaux-50/50 p-4 text-sm leading-6 text-neutral-700">
              {item.content}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
function QuestionsPanel({
  locale,
  workspace,
  onSaveAnswer
}: {
  locale: Locale;
  workspace: WorkspaceRecord;
  onSaveAnswer: (question: QuestionRecord, answer: string) => Promise<void>;
}) {
  const t = copy[locale];

  return (
    <Card className="p-5 sm:p-6 lg:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bordeaux-500 sm:text-xs">
            {t.labels.questions}
          </p>
          <p className="mt-3 text-sm leading-7 text-neutral-700">
            {locale === 'pt'
              ? 'As perguntas começam gerais e ficam mais específicas à medida que o sistema entende melhor o teu contexto.'
              : 'Questions start broad and become more specific as the system understands your context better.'}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {workspace.questions.length === 0 && (
          <p className="text-sm text-neutral-600">{t.labels.noQuestions}</p>
        )}
        {workspace.questions.map((question) => (
          <QuestionCard
            key={question.id}
            locale={locale}
            question={question}
            onSaveAnswer={onSaveAnswer}
          />
        ))}
      </div>
    </Card>
  );
}

function QuestionCard({
  locale,
  question,
  onSaveAnswer
}: {
  locale: Locale;
  question: QuestionRecord;
  onSaveAnswer: (question: QuestionRecord, answer: string) => Promise<void>;
}) {
  const [answer, setAnswer] = useState(question.answer || '');

  function renderBooleanButtons() {
    const options =
      question.options.length > 0
        ? question.options
        : locale === 'pt'
          ? [
              { label: 'Sim', value: 'true' },
              { label: 'Não', value: 'false' }
            ]
          : [
              { label: 'Yes', value: 'true' },
              { label: 'No', value: 'false' }
            ];

    return (
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              setAnswer(option.value);
              void onSaveAnswer(question, option.value);
            }}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-semibold transition',
              answer === option.value
                ? 'border-bordeaux-700 bg-bordeaux-700 text-white'
                : 'border-bordeaux-100 bg-white text-bordeaux-800 hover:bg-bordeaux-50'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  }

  function renderChoiceButtons() {
    return (
      <div className="mt-4 flex flex-wrap gap-2">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              setAnswer(option.value);
              void onSaveAnswer(question, option.value);
            }}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-semibold transition',
              answer === option.value
                ? 'border-bordeaux-700 bg-bordeaux-700 text-white'
                : 'border-bordeaux-100 bg-white text-bordeaux-800 hover:bg-bordeaux-50'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  }

  function renderNumberInput() {
    return (
      <div className="mt-4">
        <input
          type="number"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          className="w-full rounded-[1rem] sm:rounded-[1.25rem] border border-bordeaux-100 bg-bordeaux-50/30 px-4 py-3 text-[16px] outline-none focus:border-bordeaux-300"
        />
        <button
          onClick={() => void onSaveAnswer(question, answer)}
          className="mt-3 w-full rounded-full border border-bordeaux-100 px-4 py-3 text-sm font-semibold text-bordeaux-800 sm:w-auto sm:py-2"
        >
          {locale === 'pt' ? 'Guardar resposta' : 'Save answer'}
        </button>
      </div>
    );
  }

  function renderTextInput() {
    return (
      <div className="mt-4">
        <textarea
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          rows={3}
          className="w-full rounded-[1rem] sm:rounded-[1.25rem] border border-bordeaux-100 bg-bordeaux-50/30 px-4 py-3 text-[16px] outline-none focus:border-bordeaux-300"
        />
        <button
          onClick={() => void onSaveAnswer(question, answer)}
          className="mt-3 w-full rounded-full border border-bordeaux-100 px-4 py-3 text-sm font-semibold text-bordeaux-800 sm:w-auto sm:py-2"
        >
          {locale === 'pt' ? 'Guardar resposta' : 'Save answer'}
        </button>
      </div>
    );
  }

  function renderInput() {
    if (question.kind === 'single_choice' && question.options.length > 0) {
      return renderChoiceButtons();
    }

    if (question.kind === 'boolean') {
      return renderBooleanButtons();
    }

    if (question.kind === 'number') {
      return renderNumberInput();
    }

    return renderTextInput();
  }

  return (
    <div className="rounded-[1rem] sm:rounded-[1.5rem] border border-bordeaux-100 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-bordeaux-500 sm:text-xs">
            0{question.stage}
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-bordeaux-900">
            {question.text}
          </p>
        </div>
        <InfoBubble text={question.hint} />
      </div>

      {renderInput()}
    </div>
  );
}
function PlanPanel({
  locale,
  workspace,
  onSavePlan
}: {
  locale: Locale;
  workspace: WorkspaceRecord;
  onSavePlan: (plan: PlanRecord) => Promise<void>;
}) {
  const t = copy[locale];
  const latest = workspace.planVersions[0];

  const [draft, setDraft] = useState<PlanRecord | null>(latest || null);
  const [weekly, setWeekly] = useState(5);
  const [days, setDays] = useState(5);
  const [buffer, setBuffer] = useState(10);

  useEffect(() => {
    setDraft(latest || null);
  }, [latest]);

  function generateSmartPlan() {
    if (!draft) return;

    const daily = days > 0 ? weekly / days : 0;

    const newPhases = draft.phases.map((phase, index) => {
      if (index === 0) {
        return {
          ...phase,
          body: `Daily target: ${daily.toFixed(1)}`
        };
      }

      if (index === 1) {
        return {
          ...phase,
          body: `Work ${days} days/week with ${buffer}% buffer`
        };
      }

      return {
        ...phase,
        body: phase.body || 'Keep progressing'
      };
    });

    setDraft({
      ...draft,
      phases: newPhases
    });
  }

  if (!draft) {
    return (
      <Card className="p-5 sm:p-6 lg:p-7">
        <p className="text-sm text-neutral-600">{t.labels.noPlan}</p>
      </Card>
    );
  }

  return (
    <Card className="p-5 sm:p-6 lg:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bordeaux-500 sm:text-xs">
            {t.labels.editPlan}
          </p>
          <input
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            className="mt-3 w-full rounded-[1rem] sm:rounded-[1.15rem] border border-bordeaux-100 bg-bordeaux-50/30 px-4 py-3 font-display text-xl tracking-[-0.03em] text-bordeaux-900 outline-none sm:text-2xl"
          />
        </div>
        <span className="w-fit rounded-full bg-bordeaux-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-bordeaux-700 sm:text-xs">
          {draft.source}
        </span>
      </div>

      <textarea
        value={draft.summary}
        onChange={(event) => setDraft({ ...draft, summary: event.target.value })}
        rows={4}
        className="mt-5 w-full rounded-[1.2rem] sm:rounded-[1.35rem] border border-bordeaux-100 bg-bordeaux-50/30 px-4 py-3 text-sm leading-7 outline-none focus:border-bordeaux-300"
      />

      <div className="mt-6 space-y-4">
        {draft.phases.map((phase, index) => (
          <div
            key={index}
            className="rounded-[1rem] sm:rounded-[1.5rem] bg-gradient-to-r from-white to-bordeaux-50 p-4 sm:p-5 ring-1 ring-bordeaux-100"
          >
            <input
              value={phase.title}
              onChange={(event) => {
                const phases = [...draft.phases];
                phases[index] = { ...phases[index], title: event.target.value };
                setDraft({ ...draft, phases });
              }}
              className="w-full bg-transparent font-display text-lg tracking-[-0.03em] text-bordeaux-900 outline-none sm:text-xl"
            />

            {index === 0 ? (
              <div className="mt-3 grid gap-3">
                <div>
                  <label className="text-xs text-neutral-500">Meta semanal</label>
                  <input
                    type="number"
                    value={weekly}
                    onChange={(e) => setWeekly(Number(e.target.value))}
                    className="w-full rounded-xl border border-bordeaux-100 px-3 py-3"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-500">Dias por semana</label>
                  <input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full rounded-xl border border-bordeaux-100 3"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-500">Folga (%)</label>
                  <input
                    type="number"
                    value={buffer}
                    onChange={(e) => setBuffer(Number(e.target.value))}
                    className="w-full rounded-xl border border-bordeaux-100 px-3 py-3"
                  />
                </div>

                <div className="text-sm font-semibold text-bordeaux-800">
                  Meta diária: {days > 0 ? (weekly / days).toFixed(2) : '0'}
                </div>
              </div>
            ) : (
              <textarea
                value={phase.body}
                onChange={(event) => {
                  const phases = [...draft.phases];
                  phases[index] = { ...phases[index], body: event.target.value };
                  setDraft({ ...draft, phases });
                }}
                rows={3}
                className="mt-3 w-full rounded-[1rem] sm:rounded-[1.15rem] border border-bordeaux-100 bg-white/60 px-4 py-3 text-sm leading-7 outline-none"
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={generateSmartPlan}
        className="mt-4 w-full rounded-full border border-bordeaux-200 px-5 py-3 text-sm font-semibold text-bordeaux-800"
      >
        Gerar plano automaticamente
      </button>

      <button
        onClick={() => void onSavePlan(draft)}
        className="mt-4 w-full rounded-full bg-bordeaux-700 px-5 py-3 text-sm font-semibold text-white sm:w-auto"
      >
        {t.labels.save}
      </button>
    </Card>
  );
}