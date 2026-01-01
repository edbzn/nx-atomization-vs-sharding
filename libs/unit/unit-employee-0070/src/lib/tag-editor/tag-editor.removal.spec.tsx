import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TagEditor } from './TagEditor';

describe('TagEditor removal', () => {
  it('edits a list of 6 tag operations', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TagEditor onChange={onChange} />);
    const tagInput = () => screen.getByRole('textbox', { name: 'New tag' });
    await user.type(tagInput(), 'river maple{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('1 tag');
    expect(screen.queryAllByTestId('tag')).toHaveLength(1);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'nectar{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('2 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(2);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'velvet{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('3 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(3);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'zephyr98{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('4 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(4);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'juniper85{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('5 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(5);
    expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();
    await user.type(tagInput(), 'RIVER-MAPLE{Enter}');
    expect(screen.getByTestId('tag-count').textContent).toBe('5 tags');
    expect(screen.queryAllByTestId('tag')).toHaveLength(5);
    expect(screen.getByTestId('tag-message').textContent).toBe('"river-maple" is already added');
    expect(onChange).toHaveBeenCalledTimes(5);
    expect(onChange).toHaveBeenLastCalledWith(["river-maple","nectar","velvet","zephyr98","juniper85"]);
  });
});
