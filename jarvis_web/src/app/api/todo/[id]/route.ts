import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { todos } from '@/db/schema';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const parseTodoId = (value: string) => {
  const id = Number.parseInt(value, 10);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id: rawId } = await params;
  const id = parseTodoId(rawId);

  if (id === null) {
    return NextResponse.json({ error: 'invalid todo id' }, { status: 400 });
  }

  const todo = await db.select().from(todos).where(eq(todos.id, id)).get();

  if (!todo) {
    return NextResponse.json({ error: 'todo not found' }, { status: 404 });
  }

  return NextResponse.json({ todo });
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id: rawId } = await params;
  const id = parseTodoId(rawId);

  if (id === null) {
    return NextResponse.json({ error: 'invalid todo id' }, { status: 400 });
  }

  const todo = await db.select().from(todos).where(eq(todos.id, id)).get();

  if (!todo) {
    return NextResponse.json({ error: 'todo not found' }, { status: 404 });
  }

  await db.delete(todos).where(eq(todos.id, id));

  return NextResponse.json({ message: 'todo deleted', todo });
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id: rawId } = await params;
  const id = parseTodoId(rawId);

  if (id === null) {
    return NextResponse.json({ error: 'invalid todo id' }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const completed = body?.completed;

  if (typeof completed !== 'boolean' && completed !== undefined) {
    return NextResponse.json(
      { error: 'completed must be a boolean when provided' },
      { status: 400 },
    );
  }

  const [updatedTodo] = await db
    .update(todos)
    .set({ completed: completed ?? true })
    .where(eq(todos.id, id))
    .returning();

  if (!updatedTodo) {
    return NextResponse.json({ error: 'todo not found' }, { status: 404 });
  }

  return NextResponse.json({ todo: updatedTodo });
}