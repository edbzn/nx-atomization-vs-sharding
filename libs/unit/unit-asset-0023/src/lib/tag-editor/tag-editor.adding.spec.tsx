import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TagEditor } from './TagEditor';

describe('TagEditor adding', () => {
  it('edits a list of 6 tag operations', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TagEditor onChange={onChange} />);
    const tagInput = () => screen.getByRole('textbox', { name: 'New tag' });
    await user.type(tagInput(), 'river lark{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'tide{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('2 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(2);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'lumen48{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('3 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(3);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'ember apex{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('4 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(4);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove tide' }));
    expect(screen.getByTestId('tag-count').textContent).toBe('3 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(3);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove ember-apex' }));
    expect(screen.getByTestId('tag-count').textContent).toBe('2 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(2);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(6);
    expect(onChange).toHaveBeenLastCalledWith(["river-lark","lumen48"]);
  });

  it('edits a list of 2 tag operations', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TagEditor onChange={onChange} />);
    const tagInput = () => screen.getByRole('textbox', { name: 'New tag' });
    await user.type(tagInput(), 'falcon{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'LUMEN{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('2 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(2);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(["falcon","lumen"]);
  });
});
