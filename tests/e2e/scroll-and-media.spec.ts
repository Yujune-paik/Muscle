import { expect, test, type Page } from '@playwright/test';

async function scrollMetrics(page: Page) {
  return page.evaluate(() => {
    const element = [...document.querySelectorAll<HTMLElement>('*')].find((candidate) => {
      const style = getComputedStyle(candidate);
      return (style.overflowY === 'auto' || style.overflowY === 'scroll') && candidate.scrollHeight > candidate.clientHeight;
    });
    return element ? {
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      scrollTop: element.scrollTop,
    } : null;
  });
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

async function resetOnboarding(page: Page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.getByTestId('welcome-start')).toBeVisible();
}

test('scroll input works across the full viewport and all content remains reachable', async ({ page }, testInfo) => {
  await resetOnboarding(page);
  await expectNoHorizontalOverflow(page);

  const before = await scrollMetrics(page);
  expect(before, 'short viewports must expose a scroll container').not.toBeNull();
  expect(before!.scrollHeight).toBeGreaterThan(before!.clientHeight);

  if (testInfo.project.name === 'scroll-wide-chromium') {
    await page.evaluate(() => {
      const target = window as Window & { __nxtsetLongTasks?: number[] };
      target.__nxtsetLongTasks = [];
      new PerformanceObserver((list) => {
        target.__nxtsetLongTasks!.push(...list.getEntries().map((entry) => entry.duration));
      }).observe({ entryTypes: ['longtask'] });
    });
  }

  if (testInfo.project.name === 'scroll-webkit-iphone') {
    // Playwright does not expose a swipe primitive for mobile WebKit. Programmatic
    // scrolling plus the CTA auto-scroll below verifies the same native scroller.
    await page.evaluate(() => {
      const element = [...document.querySelectorAll<HTMLElement>('*')].find((candidate) => {
        const style = getComputedStyle(candidate);
        return (style.overflowY === 'auto' || style.overflowY === 'scroll') && candidate.scrollHeight > candidate.clientHeight;
      });
      element?.scrollBy({ top: 500, behavior: 'instant' });
    });
  } else {
    await page.mouse.move(2, Math.floor(before!.clientHeight / 2));
    await page.mouse.wheel(0, 500);
  }
  await expect.poll(async () => (await scrollMetrics(page))?.scrollTop ?? 0).toBeGreaterThan(0);

  if (testInfo.project.name === 'scroll-wide-chromium') {
    const longestTask = await page.evaluate(() => Math.max(0, ...((window as Window & { __nxtsetLongTasks?: number[] }).__nxtsetLongTasks ?? [])));
    expect(longestTask).toBeLessThan(100);
  }

  if (testInfo.project.name === 'scroll-wide-chromium' || testInfo.project.name === 'scroll-firefox') {
    const scroller = page.getByLabel('画面コンテンツ').filter({ visible: true });
    await scroller.evaluate((element) => { element.scrollTop = 0; });
    await scroller.focus();
    await page.keyboard.press('End');
    await expect.poll(async () => (await scrollMetrics(page))?.scrollTop ?? 0).toBeGreaterThan(0);
  }

  await page.getByTestId('welcome-start').click();
  for (const id of ['goal-next', 'experience-next', 'schedule-next', 'gym-next', 'protein-next', 'ready-finish']) {
    const action = page.getByTestId(id);
    await action.scrollIntoViewIfNeeded();
    await expect(action).toBeVisible();
    await action.click();
    await expectNoHorizontalOverflow(page);
  }

  await page.getByRole('button', { name: 'トレーニングを始める' }).click();
  await expect(page.getByTestId('active-exercise').filter({ visible: true })).toBeVisible();
  await expect(page.getByTestId('exercise-video-open').filter({ visible: true })).toBeVisible();
  await page.getByTestId('exercise-video-open').filter({ visible: true }).click();
  await expect(page.getByTestId('youtube-player').filter({ visible: true })).toBeVisible();
  await expect(page.getByText(/提供: PureGym/).filter({ visible: true })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  for (const path of ['/progress', '/profile', '/settings', '/help', '/account/privacy']) {
    await page.goto(path);
    await expectNoHorizontalOverflow(page);
    const actions = page.getByRole('button').filter({ visible: true });
    const count = await actions.count();
    if (count > 0) {
      await actions.nth(count - 1).scrollIntoViewIfNeeded();
      await expect(actions.nth(count - 1)).toBeVisible();
    }
  }
});

test('reduced motion still exposes unambiguous start and end poses', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await resetOnboarding(page);
  await page.getByTestId('welcome-start').click();
  for (const id of ['goal-next', 'experience-next', 'schedule-next', 'gym-next', 'protein-next', 'ready-finish']) {
    await page.getByTestId(id).click();
  }
  await page.getByRole('button', { name: 'トレーニングを始める' }).click();
  await expect(page.getByText('開始').filter({ visible: true })).toBeVisible();
  await expect(page.getByText('終了').filter({ visible: true })).toBeVisible();
});
