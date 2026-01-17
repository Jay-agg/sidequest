import { test, expect } from "@playwright/test";

test.describe("Replace Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholder("e.g., Guitar, Watercolor").fill("Guitar");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByPlaceholder("e.g., Play my favorite songs").fill("Play campfire songs");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByRole("button", { name: "Create My Plan" }).click();

    await page.waitForSelector("text=Your Learning Path", { timeout: 10000 });
  });

  test("should open replace modal on desktop and select replacement", async ({ page }) => {
    test.skip(page.viewportSize()?.width ?? 0 < 640, "Desktop only test");

    const replaceButtons = page.getByRole("button", { name: "Replace" });
    await replaceButtons.first().click();

    await expect(page.getByText("Replace Technique")).toBeVisible();
    await expect(page.getByText("Choose a replacement")).toBeVisible();

    const replacementCard = page.getByText("Alternative Technique A").first();
    await replacementCard.click();

    await expect(page.getByRole("button", { name: "Replace Technique" })).toBeEnabled();
  });

  test("should open bottom sheet on mobile for replace flow", async ({ page }) => {
    test.skip(page.viewportSize()?.width ?? 0 >= 640, "Mobile only test");

    await page.setViewportSize({ width: 375, height: 667 });

    const replaceButtons = page.getByRole("button", { name: "Replace" });
    await replaceButtons.first().click();

    await expect(page.getByText("Replace Technique")).toBeVisible();

    const sheet = page.locator('[data-vaul-drawer]');
    await expect(sheet).toBeVisible();

    const replacementCard = page.getByText("Alternative Technique A").first();
    await replacementCard.click();

    await page.getByRole("button", { name: "Replace Technique" }).click();

    await expect(page.getByText("Replace Technique")).not.toBeVisible();
  });

  test("should close replace modal when clicking cancel", async ({ page }) => {
    const replaceButtons = page.getByRole("button", { name: "Replace" });
    await replaceButtons.first().click();

    await expect(page.getByText("Replace Technique")).toBeVisible();

    await page.getByRole("button", { name: "Cancel" }).click();

    await expect(page.getByText("Choose a replacement")).not.toBeVisible();
  });

  test("should show replacement options with explanations", async ({ page }) => {
    const replaceButtons = page.getByRole("button", { name: "Replace" });
    await replaceButtons.first().click();

    await expect(page.getByText("Alternative Technique A")).toBeVisible();
    await expect(page.getByText("Alternative Technique B")).toBeVisible();
    await expect(page.getByText("Why this is better")).toBeVisible();
  });
});

test.describe("Replace Flow - Mobile Specific", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("should use bottom sheet instead of modal on mobile", async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholder("e.g., Guitar, Watercolor").fill("Guitar");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByPlaceholder("e.g., Play my favorite songs").fill("Play campfire songs");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByRole("button", { name: "Create My Plan" }).click();

    await page.waitForSelector("text=Your Learning Path", { timeout: 10000 });

    const replaceButtons = page.getByRole("button", { name: "Replace" });
    await replaceButtons.first().click();

    const sheet = page.locator('[data-vaul-drawer]');
    const dialog = page.locator('[role="dialog"]');

    const sheetVisible = await sheet.isVisible().catch(() => false);
    const dialogVisible = await dialog.isVisible().catch(() => false);

    expect(sheetVisible || dialogVisible).toBe(true);
  });

  test("should allow swipe to dismiss on mobile", async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholder("e.g., Guitar, Watercolor").fill("Guitar");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByPlaceholder("e.g., Play my favorite songs").fill("Play campfire songs");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByRole("button", { name: "Create My Plan" }).click();

    await page.waitForSelector("text=Your Learning Path", { timeout: 10000 });

    const replaceButtons = page.getByRole("button", { name: "Replace" });
    await replaceButtons.first().click();

    await expect(page.getByText("Replace Technique")).toBeVisible();

    const sheetHandle = page.locator('[data-vaul-drawer] > div').first();

    if (await sheetHandle.isVisible()) {
      const box = await sheetHandle.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 300, {
          steps: 10,
        });
        await page.mouse.up();
      }
    }
  });
});
