import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TagEditor } from './TagEditor';

describe('TagEditor adding', () => {
  it('edits a list of 4 tag operations', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TagEditor onChange={onChange} />);
    const tagInput = () => screen.getByRole('textbox', { name: 'New tag' });
    await user.type(tagInput(), 'zinc kestrel{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), '  zinc-kestrel {Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.getByTestId('tag-message').textContent).toBe('"zinc-kestrel" is already added');
    await user.type(tagInput(), 'sage drift{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('2 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(2);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'onyx{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('3 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(3);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenLastCalledWith(["zinc-kestrel","sage-drift","onyx"]);
  });

  it('edits a list of 2 tag operations', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TagEditor onChange={onChange} />);
    const tagInput = () => screen.getByRole('textbox', { name: 'New tag' });
    await user.type(tagInput(), 'summit{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'nectar fern{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('2 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(2);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(["summit","nectar-fern"]);
  });

  it('edits a list of 3 tag operations', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TagEditor onChange={onChange} />);
    const tagInput = () => screen.getByRole('textbox', { name: 'New tag' });
    await user.type(tagInput(), 'raven{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), '  raven {Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.getByTestId('tag-message').textContent).toBe('"raven" is already added');
    await user.type(tagInput(), 'KESTREL{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('2 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(2);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(["raven","kestrel"]);
  });
});
