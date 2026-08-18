import { expect, test, type Page } from '@playwright/test';

async function capture(page: Page, name: string) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => [...document.images]
    .filter((image) => {
      const rect = image.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && getComputedStyle(image).visibility !== 'hidden';
    })
    .every((image) => image.complete && image.naturalWidth > 0), undefined, { timeout: 10_000 });
  await page.screenshot({ path: `screenshots/${name}.png`, animations: 'disabled' });
}

async function completeExercise(page: Page, sets: number) {
  const primary = page.getByTestId('set-primary').filter({ visible: true });
  for (let index = 0; index < sets; index += 1) {
    await primary.click();
    await primary.click();
  }
  await expect(page.getByTestId('feedback-screen').filter({ visible: true })).toBeVisible();
}

async function answerGood(page: Page) {
  await page.getByRole('button', { name: /ちょうどよかった/ }).filter({ visible: true }).click();
}

test('capture the seven required product screens', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await expect(page.getByTestId('welcome-start')).toBeVisible();
  await capture(page, '01-welcome');
  await page.getByTestId('welcome-start').click();
  await page.getByTestId('goal-next').click();
  await page.getByTestId('science-weight').fill('65');
  await page.getByTestId('science-next').click();
  for (const id of ['experience-next', 'schedule-next', 'gym-next', 'protein-next', 'ready-finish']) {
    await page.getByTestId(id).click();
  }

  await expect(page.getByText('今日も、迷わず一台ずつ。')).toBeVisible();
  await capture(page, '02-today');
  await page.getByRole('button', { name: 'トレーニングを始める' }).click();
  await page.getByTestId('recovery-start').click();

  await expect(page.getByTestId('set-primary').filter({ visible: true })).toBeVisible();
  await capture(page, '03-active-exercise');
  await completeExercise(page, 3);
  await capture(page, '04-exercise-feedback');
  await answerGood(page);

  await page.getByRole('button', { name: 'この器具が使えない' }).filter({ visible: true }).click();
  await page.getByRole('button', { name: /混んでいる/ }).filter({ visible: true }).click();
  await expect(page.getByTestId('unavailable-screen').filter({ visible: true })).toBeVisible();
  await capture(page, '05-equipment-alternative');
  await page.getByRole('button', { name: /に変える/ }).filter({ visible: true }).first().click();

  for (const sets of [3, 3, 2, 2]) {
    await completeExercise(page, sets);
    await answerGood(page);
  }

  await expect(page.getByTestId('complete-screen').filter({ visible: true })).toBeVisible();
  await capture(page, '06-workout-complete');
  await page.getByRole('button', { name: /プロテインを飲んだ/ }).filter({ visible: true }).click();
  await page.getByRole('button', { name: 'ホームへ' }).filter({ visible: true }).click();
  await page.getByRole('tab', { name: /進捗/ }).click();
  await expect(page.getByTestId('progress-screen').filter({ visible: true })).toBeVisible();
  await capture(page, '07-progress');
});
