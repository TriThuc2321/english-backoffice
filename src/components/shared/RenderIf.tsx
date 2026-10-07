import type { ReactNode } from 'react';

type RenderIfProps = {
  condition?: boolean;
  children: ReactNode;
  fallback?: ReactNode;
};

export default function RenderIf({
  children,
  condition,
  fallback,
}: RenderIfProps) {
  return condition ? children : (fallback ?? null);
}
