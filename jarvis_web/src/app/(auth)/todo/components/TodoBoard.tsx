'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { CheckCircle2, Circle, Loader2, Plus, RefreshCcw, Trash2 } from 'lucide-react';

import type { Todo } from './types';

const API_BASE = '/api/todo';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function toDateTimeLocalValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function TodoStats({ todos }: { todos: Todo[] }) {
  const completedCount = todos.filter((todo) => todo.completed).length;
  const pendingCount = todos.length - completedCount;

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <StatCard label="Total" value={todos.length} tone="from-cyan-400/20 to-cyan-500/5" />
      <StatCard label="Pending" value={pendingCount} tone="from-amber-400/20 to-amber-500/5" />
      <StatCard label="Completed" value={completedCount} tone="from-emerald-400/20 to-emerald-500/5" />
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-linear-to-br ${tone} p-4 shadow-[0_20px_80px_rgba(0,0,0,0.2)]`}>
      <p className="text-xs uppercase tracking-[0.28em] text-slate-300/70">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

function TodoComposer({
  onCreate,
  isSaving,
}: {
  onCreate: (task: string, date: string) => Promise<void>;
  isSaving: boolean;
}) {
  const [task, setTask] = useState('');
  const [scheduledFor, setScheduledFor] = useState(() => toDateTimeLocalValue(new Date()));

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await onCreate(task, scheduledFor);
        setTask('');
        setScheduledFor(toDateTimeLocalValue(new Date()));
      }}
      className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl"
    >
      <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr_auto] lg:items-end">
        <div>
          <label htmlFor="todo-task" className="mb-2 block text-sm font-medium text-slate-200">
            New todo
          </label>
          <input
            id="todo-task"
            value={task}
            onChange={(event) => setTask(event.target.value)}
            placeholder="Plan the day, finish the build, review the code"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
          />
        </div>

        <div>
          <label htmlFor="todo-date" className="mb-2 block text-sm font-medium text-slate-200">
            Date and time
          </label>
          <input
            id="todo-date"
            type="datetime-local"
            value={scheduledFor}
            onChange={(event) => setScheduledFor(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add todo
        </button>
      </div>
    </form>
  );
}

function TodoList({
  todos,
  onToggle,
  onDelete,
  isUpdatingId,
}: {
  todos: Todo[];
  onToggle: (todo: Todo) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isUpdatingId: number | null;
}) {
  if (todos.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-slate-950/40 px-6 py-14 text-center text-slate-300">
        <p className="text-lg font-medium text-white">No todos yet</p>
        <p className="mt-2 text-sm text-slate-400">Add your first task above and start building momentum.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {todos.map((todo) => {
        const isBusy = isUpdatingId === todo.id;

        return (
          <article
            key={todo.id}
            className="group rounded-3xl border border-white/10 bg-slate-950/55 p-4 shadow-lg shadow-black/10 transition hover:border-cyan-400/30 hover:bg-slate-950/70"
          >
            <div className="flex items-start gap-4">
              <button
                type="button"
                onClick={() => onToggle(todo)}
                disabled={isBusy}
                className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-cyan-400/30 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={todo.completed ? 'Mark todo as incomplete' : 'Mark todo as complete'}
              >
                {todo.completed ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <Circle className="h-5 w-5" />}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className={`text-base font-medium ${todo.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
                      {todo.task}
                    </h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">
                      Scheduled {formatDateTime(todo.date)}
                    </p>
                  </div>

                  <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${todo.completed ? 'bg-emerald-400/15 text-emerald-300' : 'bg-amber-400/15 text-amber-300'}`}>
                    {todo.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onDelete(todo.id)}
                disabled={isBusy}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-rose-400/30 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Delete todo"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function TodoBoard() {
  const { data, error: fetchError, isLoading, mutate } = useSWR<{ todos: Todo[] }>(
    API_BASE,
    fetcher,
    { refreshInterval: 1000 }
  );

  const todos = data?.todos ?? [];

  const [actionError, setActionError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingId, setIsUpdatingId] = useState<number | null>(null);

  const displayError = actionError || (fetchError ? 'Failed to fetch background data' : null);

  const sortedTodos = useMemo(
    () => [...todos].sort((left, right) => Number(right.timestamp) - Number(left.timestamp)),
    [todos],
  );

  const createTodo = async (task: string, date: string) => {
    const trimmedTask = task.trim();

    if (!trimmedTask) {
      return;
    }

    setIsSaving(true);
    setActionError(null);

    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: trimmedTask,
          date: date ? new Date(date).toISOString() : undefined,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? 'Unable to create todo');
      }

      await mutate();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to create todo');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTodo = async (todo: Todo) => {
    setIsUpdatingId(todo.id);
    setActionError(null);

    try {
      const response = await fetch(`${API_BASE}/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? 'Unable to update todo');
      }

      await mutate();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to update todo');
    } finally {
      setIsUpdatingId(null);
    }
  };

  const deleteTodo = async (id: number) => {
    setIsUpdatingId(id);
    setActionError(null);

    try {
      const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? 'Unable to delete todo');
      }

      await mutate();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to delete todo');
    } finally {
      setIsUpdatingId(null);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_30%),linear-gradient(180deg,#020617_0%,#020617_45%,#07111f_100%)] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-4xl border border-white/10 bg-white/5 p-5 shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">JARVIS task control</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Manage your day with a sharper todo board.
              </h1>
              <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base">
                Create, complete, inspect, and delete todos through the SQLite-backed Next.js API.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void mutate()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-400/30 hover:text-white"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="mt-6 grid gap-4">
            <TodoComposer onCreate={createTodo} isSaving={isSaving} />
            <TodoStats todos={todos} />

            {displayError ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {displayError}
              </div>
            ) : null}

            {isLoading ? (
              <div className="flex min-h-65 items-center justify-center rounded-3xl border border-white/10 bg-slate-950/40 text-slate-300">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-cyan-300" />
                  Loading todos...
                </div>
              </div>
            ) : (
              <TodoList
                todos={sortedTodos}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                isUpdatingId={isUpdatingId}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}