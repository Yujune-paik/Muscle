import { expect, test, type Page } from '@playwright/test';

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

test('onboarding, replacement, completion, protein, and refresh persistence', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.getByTestId('welcome-start').click();
  await page.getByTestId('goal-next').click();
  await page.getByTestId('science-weight').fill('65');
  await page.getByRole('radio', { name: /少ない/ }).click();
  await page.getByTestId('science-next').click();
  await page.getByTestId('experience-next').click();
  await page.getByTestId('schedule-next').click();
  await page.getByTestId('gym-next').click();
  await page.getByTestId('protein-next').click();
  await page.getByTestId('ready-finish').click();
  await expect(page.getByText('今日も、迷わず一台ずつ。')).toBeVisible();

  await page.getByRole('button', { name: 'トレーニングを始める' }).click();
  await page.getByTestId('recovery-start').click();
  await completeExercise(page, 3);
  await answerGood(page);

  await page.getByRole('button', { name: 'この器具が使えない' }).filter({ visible: true }).click();
  await page.getByRole('button', { name: /混んでいる/ }).filter({ visible: true }).click();
  await expect(page.getByTestId('unavailable-screen').filter({ visible: true })).toBeVisible();
  await page.getByRole('button', { name: /に変える/ }).filter({ visible: true }).first().click();
  await completeExercise(page, 3);
  await answerGood(page);

  await completeExercise(page, 3);
  await answerGood(page);
  await completeExercise(page, 2);
  await answerGood(page);
  await completeExercise(page, 2);
  await answerGood(page);

  await expect(page.getByTestId('complete-screen').filter({ visible: true })).toBeVisible();
  const proteinAction = page.getByRole('button', { name: /プロテインを飲んだ/ }).filter({ visible: true });
  await proteinAction.click();
  await proteinAction.click();
  await page.getByRole('button', { name: 'ホームへ' }).filter({ visible: true }).click();
  await page.reload();

  await expect(page.getByText('今日の補助プラン達成')).toBeVisible();
  await page.getByText('進捗', { exact: true }).last().click();
  await expect(page.getByTestId('progress-screen').filter({ visible: true })).toBeVisible();
  await expect(page.getByText(/種目で次回調整/)).toBeVisible();
});

test('recovery suggestion only changes volume after explicit acceptance', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByTestId('welcome-start').click();
  await page.getByTestId('goal-next').click();
  await page.getByTestId('science-weight').fill('65');
  await page.getByTestId('science-next').click();
  for (const id of ['experience-next', 'schedule-next', 'gym-next', 'protein-next', 'ready-finish']) {
    await page.getByTestId(id).click();
  }
  await page.getByRole('button', { name: 'トレーニングを始める' }).click();
  await page.getByRole('button', { name: '6時間未満' }).click();
  await expect(page.getByText('今日は各種目を1セット減らす提案')).toBeVisible();
  await page.getByTestId('recovery-start').click();
  await expect(page.getByText('0/2 SETS')).toBeVisible();
});

test('multiple protein servings persist as plain data', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByTestId('welcome-start').click();
  await page.getByTestId('goal-next').click();
  await page.getByTestId('science-weight').fill('65');
  await page.getByRole('radio', { name: /少ない/ }).click();
  await page.getByTestId('science-next').click();
  for (const id of ['experience-next', 'schedule-next', 'gym-next', 'protein-next', 'ready-finish']) {
    await page.getByTestId(id).click();
  }
  const proteinAction = page.getByRole('button', { name: /プロテインを飲んだ/ }).filter({ visible: true });
  await proteinAction.click();
  await proteinAction.click();
  await expect(page.getByText('今日の補助プラン達成')).toBeVisible();
  await expect(page.locator('#error-overlay')).toHaveCount(0);
  await page.reload();
  await expect(page.getByText('今日の補助プラン達成')).toBeVisible();
});
