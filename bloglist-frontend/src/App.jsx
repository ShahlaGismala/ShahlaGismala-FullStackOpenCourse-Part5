import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogView from './components/BlogView'

const Navigation = ({ user, handleLogout }) => (
  <div>
    <Link to="/">blogs</Link>
    {' '}
    {user
      ? <button onClick={handleLogout}>logout</button>
      : <Link to="/login">login</Link>
    }
  </div>
)

const BlogList = ({ blogs }) => (
  <div>
    <h2>blogs</h2>
    <ul>
      {blogs.map(blog => (
        <li key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} by {blog.author}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

const LoginForm = ({ onLogin, notification, notificationType }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const success = await onLogin(username, password)
    if (success) navigate('/')
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <Notification message={notification} type={notificationType} />
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification(message)
    setNotificationType(type)
    setTimeout(() => setNotification(null), 5000)
  }

  const handleLogin = async (username, password) => {
    try {
      const loggedUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedUser))
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
      return true
    } catch {
      showNotification('wrong username or password', 'error')
      return false
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
    navigate('/')
  }

  const handleBlogUpdate = (updatedBlog) => {
  setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
}

  return (
    <div>
      <Navigation user={user} handleLogout={handleLogout} />
      <Notification message={notification} type={notificationType} />
      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} />} />
        <Route
          path="/login"
          element={
            <LoginForm
              onLogin={handleLogin}
              notification={notification}
              notificationType={notificationType}
            />
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <BlogView
              blogs={blogs}
              user={user}
              onUpdate={handleBlogUpdate}
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App