const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'testuser',
        name: 'Test User',
        password: 'testpass'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('login succeeds with correct credentials', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await page.getByRole('textbox').first().fill('testuser')
    await page.getByRole('textbox').last().fill('testpass')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
  })

  test('login fails with wrong credentials', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await page.getByRole('textbox').first().fill('testuser')
    await page.getByRole('textbox').last().fill('wrongpass')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.locator('div').filter({ hasText: 'wrong username or password' }).first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'logout' })).not.toBeVisible()
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByRole('textbox').first().fill('testuser')
      await page.getByRole('textbox').last().fill('testpass')
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByRole('button', { name: 'logout' }).waitFor()
    })

    test('a logged in user can create a blog', async ({ page }) => {
      await page.getByRole('link', { name: 'new blog' }).click()
      await page.getByPlaceholder('title').fill('Playwright Test Blog')
      await page.getByPlaceholder('author').fill('Playwright Author')
      await page.getByPlaceholder('url').fill('http://playwright.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByRole('link', { name: /Playwright Test Blog/ })).toBeVisible()
    })

    test('a logged in user can like a blog', async ({ page }) => {
      await page.getByRole('link', { name: 'new blog' }).click()
      await page.getByPlaceholder('title').fill('Blog to like')
      await page.getByPlaceholder('author').fill('Like Author')
      await page.getByPlaceholder('url').fill('http://like.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('link', { name: /Blog to like/ }).click()

      await expect(page.getByText(/likes 0/)).toBeVisible()

      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText(/likes 1/)).toBeVisible()
    })

    test('a logged in user can delete a blog', async ({ page }) => {
      await page.getByRole('link', { name: 'new blog' }).click()
      await page.getByPlaceholder('title').fill('Blog to delete')
      await page.getByPlaceholder('author').fill('Delete Author')
      await page.getByPlaceholder('url').fill('http://delete.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('link', { name: /Blog to delete/ }).click()

      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByRole('link', { name: /Blog to delete/ })).not.toBeVisible()
    })
  })
})