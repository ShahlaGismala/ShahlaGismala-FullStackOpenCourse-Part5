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

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('testuser')
      await page.getByRole('textbox').last().fill('testpass')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('testuser')
      await page.getByRole('textbox').last().fill('wrongpass')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
  beforeEach(async ({ page }) => {
    await page.getByRole('textbox').first().fill('testuser')
    await page.getByRole('textbox').last().fill('testpass')
    await page.getByRole('button', { name: 'login' }).click()
  })

  test('a new blog can be created', async ({ page }) => {
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByPlaceholder('title').fill('Test Blog Title')
    await page.getByPlaceholder('author').fill('Test Author')
    await page.getByPlaceholder('url').fill('http://testurl.com')
    await page.getByRole('button', { name: 'create' }).click()

    const blogEntry = page.locator('[data-testid="blog"]').filter({ hasText: 'Test Blog Title' })
    await expect(blogEntry).toBeVisible()
  })

  test('a blog can be liked', async ({ page }) => {
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByPlaceholder('title').fill('Blog to like')
    await page.getByPlaceholder('author').fill('Like Author')
    await page.getByPlaceholder('url').fill('http://likeurl.com')
    await page.getByRole('button', { name: 'create' }).click()

    const blogEntry = page.locator('[data-testid="blog"]').filter({ hasText: 'Blog to like' })
    await expect(blogEntry).toBeVisible()

    await blogEntry.getByRole('button', { name: 'view' }).click()

    await expect(blogEntry).toContainText('likes 0')

    await blogEntry.getByRole('button', { name: 'like' }).click()

    await expect(blogEntry).toContainText('likes 1')
  })
})


})