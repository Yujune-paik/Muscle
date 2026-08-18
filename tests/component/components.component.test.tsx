import { fireEvent, render, screen } from '@testing-library/react-native';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { AccessibilityInfo } from 'react-native';

import { ExerciseMotion } from '@/components/media/exercise-motion';
import { PrimaryButton } from '@/components/primitives';
import { DifficultyChoice, PrescriptionChip } from '@/components/workout';
import { exercises } from '@/content';

describe('core components', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders and presses the primary action', async () => {
    const onPress = jest.fn();
    await render(<PrimaryButton label="始める" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: '始める' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('exposes prescription editing as an accessible button', async () => {
    await render(<PrescriptionChip value={25} unit="kg" onPress={() => undefined} />);
    expect(screen.getByRole('button', { name: '25kg、変更' })).toBeTruthy();
  });

  it('submits one plain-language difficulty value', async () => {
    const onPress = jest.fn();
    await render(<DifficultyChoice value="good" onPress={onPress} />);
    await fireEvent.press(
      screen.getByRole('button', { name: 'ちょうどよかった、最後まで形を保てた' }),
    );
    expect(onPress).toHaveBeenCalledWith('good');
  });

  it('keeps exercise guidance available in reduced motion', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    await render(<ExerciseMotion exercise={exercises[0]!} failed />);
    expect(screen.getAllByLabelText(/チェストプレス/).length).toBeGreaterThan(0);
    expect(screen.getByText(exercises[0]!.altText)).toBeTruthy();
  });

  it('loads a YouTube demonstration only after the user asks for it', async () => {
    await render(<ExerciseMotion exercise={exercises[0]!} />);
    expect(screen.queryByTestId('mock-webview')).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'チェストプレスの実演動画を見る' }));
    expect(screen.getByTestId('mock-webview')).toBeTruthy();
  });
});
