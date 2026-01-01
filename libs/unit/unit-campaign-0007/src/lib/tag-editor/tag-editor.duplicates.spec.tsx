import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TagEditor } from './TagEditor';

describe('TagEditor duplicates', () => {
  it('edits a list of 6 tag operations', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TagEditor onChange={onChange} />);
    const tagInput = () => screen.getByRole('textbox', { name: 'New tag' });
    await user.type(tagInput(), 'harbor15{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'reef42{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('2 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(2);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'garnet98{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('3 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(3);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'hazel{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('4 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(4);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'nova{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('5 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(5);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'falcon maple{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('6 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(6);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(6);
    expect(onChange).toHaveBeenLastCalledWith(["harbor15","reef42","garnet98","hazel","nova","falcon-maple"]);
  });

  it('edits a list of 2 tag operations', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TagEditor onChange={onChange} />);
    const tagInput = () => screen.getByRole('textbox', { name: 'New tag' });
    await user.type(tagInput(), 'ONYX{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'pebble{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('2 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(2);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(["onyx","pebble"]);
  });

  it('edits a list of 2 tag operations', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TagEditor onChange={onChange} />);
    const tagInput = () => screen.getByRole('textbox', { name: 'New tag' });
    await user.type(tagInput(), 'tide79{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'zephyr{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('2 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(2);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(["tide79","zephyr"]);
  });
});
