import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jarvis_TODO',
  description: 'JARVIS task control dashboard',
};

export default function TodoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}