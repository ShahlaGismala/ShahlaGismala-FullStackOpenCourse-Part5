import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogView from './components/BlogView'
import CreateBlog from './components/CreateBlog'

const Navigation = ({ user, handleLogout }) => {
  const navStyle = {
    backgroundColor: '#1565c0',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginBottom: '24px',
  }

  const brandStyle = {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '20px',
    textDecoration: 'none',
    marginRight: 'auto',
  }

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
    textTransform: 'uppercase',
    fontSize: '14px',
    letterSpacing: '0.5px',
  }

  const logoutStyle = {
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    padding: '6px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    textTransform: 'uppercase',
    fontSize: '14px',
    letterSpacing: '0.5px',
  }

  return (
    <div style={navStyle}>
      <Link to="/" style={brandStyle}>Blog App</Link>
      {user ? (
        <>
          <Link to="/" style={linkStyle}>blogs</Link>
          <Link to="/create" style={linkStyle}>new blog</Link>
          <button onClick={handleLogout} style={logoutStyle}>logout</button>
        </>
      ) : (
        <Link to="/login" style={linkStyle}>login</Link>
      )}
    </div>
  )
}

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

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const success = await onLogin(username, password)
    if (success) navigate('/')
  }

  const formStyle = {
    maxWidth: '400px',
    margin: '40px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  }

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '8px 0 16px 0',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box',
  }

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#1565c0',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  }

  const labelStyle = {
    fontWeight: '500',
    color: '#333',
  }

  return (
    <div style={formStyle}>
      <h2>Log in to application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label style={labelStyle}>username</label>
          <input
            type="text"
            value={username}
            style={inputStyle}
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>password</label>
          <input
            type="password"
            value={password}
            style={inputStyle}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" style={buttonStyle}>login</button>
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

  const handleBlogCreate = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(createdBlog))
      showNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
    } catch {
      showNotification('failed to add blog', 'error')
    }
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navigation user={user} handleLogout={handleLogout} />
      <div style={{ padding: '0 24px' }}></div>
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
            <Route
              path="/create"
              element={<CreateBlog onCreate={handleBlogCreate} />}
            />
          </Routes>
      <div />
    </div>
  )
}

export default App