import { test, expect } from "../playwright-fixture";

/**
 * Newsletter end-to-end: composer preview → test send → bulk broadcast.
 *
 * Requires an authenticated admin session (injected by the Lovable fixture).
 * The broadcast step is gated behind DP_RUN_BROADCAST=1 so a normal test run
 * never mails the real subscriber list.
 */

const COMPOSER = "/dashboard/admin/newsletter";
const SUBJECT = `E2E newsletter ${Date.now()}`;
const BODY = "<h1>E2E body</h1><p>Hello {{name}}, this is an automated check.</p>";

test.describe("newsletter composer", () => {
  test("preview renders subject + interpolated body", async ({ page }) => {
    await page.goto(COMPOSER);
    await expect(page.getByTestId("newsletter-subject")).toBeVisible();

    await page.getByTestId("newsletter-subject").fill(SUBJECT);
    await page.getByTestId("newsletter-body").fill(BODY);

    const preview = page.frameLocator('[data-testid="newsletter-preview"]');
    await expect(preview.locator("body")).toContainText(SUBJECT);
    // {{name}} must be replaced with the preview placeholder
    await expect(preview.locator("body")).toContainText("Hello Friend");
    await expect(preview.locator("body")).not.toContainText("{{name}}");
  });

  test("audience switch updates recipient count and is persisted on the draft", async ({ page }) => {
    await page.goto(COMPOSER);
    await page.getByTestId("newsletter-subject").fill(SUBJECT + " draft");
    await page.getByTestId("newsletter-body").fill(BODY);

    await page.getByTestId("audience-all").click();
    await expect(page.getByText(/recipients/)).toBeVisible();

    await page.getByTestId("save-draft").click();
    await expect(page.getByText(/Draft saved/i)).toBeVisible({ timeout: 15_000 });

    // The saved draft appears in the audit list with its audience recorded
    const row = page.getByTestId("campaign-row").first();
    await expect(row).toContainText(SUBJECT + " draft");
    await expect(row).toContainText("audience: all");
  });

  test("test send delivers to a single address and is logged", async ({ page }) => {
    const testAddress = process.env.DP_TEST_EMAIL || "digitalpentaagency@gmail.com";
    await page.goto(COMPOSER);
    await page.getByTestId("newsletter-subject").fill(SUBJECT + " test");
    await page.getByTestId("newsletter-body").fill(BODY);
    await page.getByTestId("test-email").fill(testAddress);

    const sendResponse = page.waitForResponse(
      (r) => r.url().includes("/functions/v1/send-email") && r.request().method() === "POST",
      { timeout: 30_000 },
    );
    await page.getByTestId("send-test").click();
    const res = await sendResponse;
    expect(res.status()).toBe(200);
    await expect(page.getByText(new RegExp(`Test sent to ${testAddress}`, "i"))).toBeVisible({
      timeout: 20_000,
    });
  });

  test("bulk broadcast reaches the whole audience", async ({ page }) => {
    test.skip(process.env.DP_RUN_BROADCAST !== "1", "Set DP_RUN_BROADCAST=1 to mail the real list.");

    await page.goto(COMPOSER);
    await page.getByTestId("newsletter-subject").fill(SUBJECT + " broadcast");
    await page.getByTestId("newsletter-body").fill(BODY);
    await page.getByTestId("audience-confirmed").click();

    page.once("dialog", (d) => d.accept()); // confirm() guard
    const broadcast = page.waitForResponse(
      (r) => r.url().includes("/functions/v1/newsletter-broadcast"),
      { timeout: 120_000 },
    );
    await page.getByTestId("broadcast").click();
    const res = await broadcast;
    expect(res.status()).toBe(200);

    const payload = await res.json();
    expect(payload.ok).toBe(true);
    expect(payload.failed).toBe(0);
    expect(payload.campaignId).toBeTruthy();

    await expect(page.getByText(/Broadcast queued/i)).toBeVisible({ timeout: 30_000 });

    // Recipient-level audit trail must exist for the campaign
    const row = page.getByTestId("campaign-row").first();
    await row.getByText(/Audit recipients/i).click();
    await expect(row).toContainText("@");
  });
});
