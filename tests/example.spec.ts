import { test, expect, devices } from '@playwright/test';
import { formData } from '../fixtures/formData';

interface FormDataType {
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
}

test('Fill and submit practice form, verify results', async ({ page }) => {
  await page.goto('https://demoqa.com/automation-practice-form', { waitUntil: 'domcontentloaded'});
  
  const currentFormData = formData[Math.floor(Math.random() * formData.length)] as FormDataType;

  await page.fill('#firstName', currentFormData.firstName);
  await page.fill('#lastName', currentFormData.lastName);
  await page.click(`//label[text()="${currentFormData.gender}"]`);
  await page.fill('#userNumber', currentFormData.phone);
  
  await page.click('#submit');

  const modal = page.locator('.modal-content');
  await expect(modal).toBeVisible();

  const tableRows = page.locator('.table-responsive tbody tr');
  const expectedData = [
    { label: 'Student Name', value: `${currentFormData.firstName} ${currentFormData.lastName}` },
    { label: 'Gender', value: currentFormData.gender },
    { label: 'Mobile', value: currentFormData.phone },
  ];

  for (const { label, value } of expectedData) {
    const row = tableRows.filter({ hasText: label });
    await expect(row).toContainText(value);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ path: `screenshots/screen${timestamp}.png`, fullPage: true });
});
