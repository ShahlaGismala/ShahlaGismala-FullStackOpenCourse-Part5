import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BlogView from './BlogView'

const blog = {
  id: '1',
  title: 'Test Blog',
  author: 'Test Author',
  url: 'http://test.com',
  likes: 5,
  user: {
    id: 'u1',
    username: 'testuser',
    name: 'Test User',
  },
}

const renderBlogView = (user = null, onUpdate = vi.fn()) => {
  return render(
    <MemoryRouter initialEntries={['/blogs/1']}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <BlogView
              blogs={[blog]}
              user={user}
              onUpdate={onUpdate}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

test('blog info and likes shown to unauthenticated users, no buttons', () => {
  renderBlogView(null)

  expect(screen.getByText('Test Author: Test Blog')).toBeInTheDocument()
  expect(screen.getByText('http://test.com')).toBeInTheDocument()
  expect(screen.getByText(/likes 5/)).toBeInTheDocument()

  expect(screen.queryByRole('button', { name: 'like' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument()
})

test('authenticated non-creator sees only like button', () => {
  const otherUser = { username: 'otheruser', name: 'Other User' }
  renderBlogView(otherUser)

  expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument()
})

test('creator sees both like and delete buttons', () => {
  const creator = { username: 'testuser', name: 'Test User' }
  renderBlogView(creator)

  expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'remove' })).toBeInTheDocument()
})