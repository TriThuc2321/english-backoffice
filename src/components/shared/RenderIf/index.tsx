import type { ReactNode } from 'react';

type RenderIfProps = {
  condition: boolean;
  children: ReactNode;
};

export default function RenderIf({ condition, children }: RenderIfProps) {
  if (!condition) return null;
  return children;
}
