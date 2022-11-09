import { test, expect } from '@playwright/test';

test('/api/example/hello', async ({ request }) => {
  const response = await request.get(`/api/example/hello`);
  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();
});

test('GET /api/example/hello', async ({ request }) => {
  const response = await request.post(`/api/example/hello`);
  expect(response.status()).toBe(405);
  expect(response.ok()).toBeFalsy();
});

test('GET /api/example/not-found', async ({ request }) => {
  const response = await request.post(`/api/example/not-found`);
  expect(response.status()).toBe(404);
  expect(response.ok()).toBeFalsy();
});
