import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Kent C. Dodds',
    url: 'https://reactjs.org',
    likes: 10,
    user: { name: 'Test User', username: 'testuser' },
  }

  test('renders title and author, but not url or likes by default', () => {
    render(<Blog blog={blog} />)

    screen.getByText(
      'Component testing is done with react-testing-library',
      { exact: false }
    )
    screen.getByText('Kent C. Dodds', { exact: false })

    const div = screen.getByText(
      'Component testing is done with react-testing-library',
      { exact: false }
    ).closest('.blog')

    expect(div.querySelector('.blogDetails')).toBeNull()
  })

  test('url and likes are shown when the details button is clicked', async () => {
  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  screen.getByText('https://reactjs.org', { exact: false })
  screen.getByText('likes', { exact: false })
})
})