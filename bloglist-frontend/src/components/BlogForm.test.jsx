import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('calls onCreate with the right details when a new blog is created', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    render(<BlogForm onCreate={createBlog} />)

    const titleInput = screen.getByPlaceholderText('title')
    const authorInput = screen.getByPlaceholderText('author')
    const urlInput = screen.getByPlaceholderText('url')
    const sendButton = screen.getByText('create')

    await user.type(titleInput, 'Testing forms in React')
    await user.type(authorInput, 'Jane Doe')
    await user.type(urlInput, 'https://example.com')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: 'Testing forms in React',
      author: 'Jane Doe',
      url: 'https://example.com',
    })
  })
})