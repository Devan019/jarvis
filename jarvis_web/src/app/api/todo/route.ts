import { NextRequest, NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';

import { db } from '@/db';
import { todos } from '@/db/schema';

const parseDateTime = (value: string) => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
};

export async function GET() {
  const allTodos = await db.select().from(todos).orderBy(desc(todos.timestamp));

  return NextResponse.json({ todos: allTodos });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.task !== 'string' || !body.task.trim()) {
    return NextResponse.json({ error: 'task is required' }, { status: 400 });
  }

  const scheduledAt = typeof body.date === 'string' && body.date.trim() ? parseDateTime(body.date) : null;

  if (typeof body.date === 'string' && body.date.trim() && !scheduledAt) {
    return NextResponse.json({ error: 'date must be a valid date-time value' }, { status: 400 });
  }

  const values: {
    task: string;
    completed: boolean;
    date?: string;
    timestamp?: number;
  } = {
    task: body.task.trim(),
    completed: typeof body.completed === 'boolean' ? body.completed : false,
  };

  if (scheduledAt) {
    values.date = scheduledAt.toISOString();
    values.timestamp = Math.floor(scheduledAt.getTime() / 1000);
  }

  const [createdTodo] = await db.insert(todos).values(values).returning();

  return NextResponse.json({ todo: createdTodo }, { status: 201 });
}