import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import RenderIf from './RenderIf';

describe('<RenderIf>', () => {
  it('renders children when the condition holds', () => {
    render(<RenderIf condition>Visible</RenderIf>);

    expect(screen.getByText('Visible')).toBeInTheDocument();
  });

  it('renders the fallback otherwise', () => {
    render(
      <RenderIf condition={false} fallback="Fallback">
        Hidden
      </RenderIf>,
    );

    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
    expect(screen.getByText('Fallback')).toBeInTheDocument();
  });
});
