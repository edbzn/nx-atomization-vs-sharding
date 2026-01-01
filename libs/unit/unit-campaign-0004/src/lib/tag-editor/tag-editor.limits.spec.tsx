import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TagEditor } from './TagEditor';

describe('TagEditor limits', () => {
  it('edits a list of 6 tag operations', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TagEditor onChange={onChange} />);
    const tagInput = () => screen.getByRole('textbox', { name: 'New tag' });
    await user.type(tagInput(), 'oak zinc{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'cobalt57{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('2 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(2);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'flint{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('3 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(3);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'tide{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('4 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(4);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'juniper{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('5 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(5);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'velvet{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('6 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(6);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(6);
    expect(onChange).toHaveBeenLastCalledWith(["oak-zinc","cobalt57","flint","tide","juniper","velvet"]);
  });
});
