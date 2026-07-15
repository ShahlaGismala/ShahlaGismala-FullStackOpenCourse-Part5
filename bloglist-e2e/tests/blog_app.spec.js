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
      // login before each test
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
      await blogEntry.getByRole('button', { name: 'view' }).click()
      await expect(blogEntry).toContainText('likes 0')

      await blogEntry.getByRole('button', { name: 'like' }).click()
      await expect(blogEntry).toContainText('likes 1')
    })

    test('the user who added the blog can delete it', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill('Blog to delete')
      await page.getByPlaceholder('author').fill('Delete Author')
      await page.getByPlaceholder('url').fill('http://deleteurl.com')
      await page.getByRole('button', { name: 'create' }).click()

      const blogEntry = page.locator('[data-testid="blog"]').filter({ hasText: 'Blog to delete' })
      await expect(blogEntry).toBeVisible()

      await blogEntry.getByRole('button', { name: 'view' }).click()
      await expect(blogEntry.getByRole('button', { name: 'remove' })).toBeVisible()

      page.once('dialog', dialog => dialog.accept())
      await blogEntry.getByRole('button', { name: 'remove' }).click()

      await expect(blogEntry).not.toBeVisible()
    })

    test('only the creator sees the delete button', async ({ page, request }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill('Creators blog')
      await page.getByPlaceholder('author').fill('Creator')
      await page.getByPlaceholder('url').fill('http://creator.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'logout' }).click()

      await request.post('http://localhost:3003/api/users', {
        data: { username: 'otheruser', name: 'Other User', password: 'otherpass' }
     })

      await page.getByRole('textbox').first().fill('otheruser')
      await page.getByRole('textbox').last().fill('otherpass')
      await page.getByRole('button', { name: 'login' }).click()

      const blogEntry = page.locator('[data-testid="blog"]').filter({ hasText: 'Creators blog' })
      await blogEntry.getByRole('button', { name: 'view' }).click()

      await expect(blogEntry.getByRole('button', { name: 'remove' })).not.toBeVisible()
  })

    test('blogs are ordered by likes, most liked first', async ({ page }) => {
    const createBlog = async (title, author, url) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill(title)
      await page.getByPlaceholder('author').fill(author)
      await page.getByPlaceholder('url').fill(url)
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.locator('[data-testid="blog"]').filter({ hasText: title })).toBeVisible()
    }

    await createBlog('First blog', 'Author 1', 'http://first.com')
    await createBlog('Second blog', 'Author 2', 'http://second.com')
    await createBlog('Third blog', 'Author 3', 'http://third.com')

    const secondBlog = page.locator('[data-testid="blog"]').filter({ hasText: 'Second blog' })
    const thirdBlog = page.locator('[data-testid="blog"]').filter({ hasText: 'Third blog' })

    await expect(secondBlog).toBeVisible()
    await expect(thirdBlog).toBeVisible()

    await secondBlog.getByRole('button', { name: 'view' }).click()
    await thirdBlog.getByRole('button', { name: 'view' }).click()

    await expect(secondBlog.getByRole('button', { name: 'like' })).toBeVisible()
    await expect(thirdBlog.getByRole('button', { name: 'like' })).toBeVisible()

    await secondBlog.getByRole('button', { name: 'like' }).click()
    await secondBlog.getByRole('button', { name: 'like' }).click()
    await thirdBlog.getByRole('button', { name: 'like' }).click()

    const blogs = page.locator('[data-testid="blog"]')
    await expect(blogs.nth(0)).toContainText('Second blog')
    await expect(blogs.nth(1)).toContainText('Third blog')
    await expect(blogs.nth(2)).toContainText('First blog')
  })
 
})



})