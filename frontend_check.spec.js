import { test, expect } from '@playwright/test';

test('take a screenshot', async ({ page }) => {
    await page.goto('http://localhost:5173');
    // We will bypass fetching logic by stopping network requests just to render components locally.
    await page.route('**/rest/v1/**', route => route.abort());
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshot_bottom.png', fullPage: true });
});
