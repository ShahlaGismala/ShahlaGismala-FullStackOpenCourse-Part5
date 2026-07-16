import { useParams, useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'

const BlogView = ({ blogs, user, onUpdate }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const blog = blogs.find(b => b.id === id)

  if (!blog) return <div>blog not found</div>

  const handleLike = async () => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user?.id || blog.user,
    }
    const returned = await blogService.update(blog.id, updatedBlog)
    onUpdate({ ...returned, user: blog.user })
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id)
      navigate('/')
    }
  }

  const isCreator = blog.user?.username === user?.username

  const cardStyle = {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  }

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '8px',
  }

  const authorStyle = {
    color: '#555',
    fontSize: '16px',
    marginBottom: '16px',
  }

  const urlStyle = {
    color: '#1565c0',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '16px',
    fontSize: '15px',
  }

  const addedByStyle = {
    color: '#666',
    fontSize: '14px',
    marginBottom: '20px',
  }

  const likesRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
  }

  const likesStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
  }

  const likeButtonStyle = {
    padding: '6px 20px',
    backgroundColor: 'white',
    color: '#1565c0',
    border: '2px solid #1565c0',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: '13px',
  }

  const removeButtonStyle = {
    padding: '6px 20px',
    backgroundColor: 'white',
    color: '#c62828',
    border: '2px solid #c62828',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: '13px',
  }

  return (
    <div style={cardStyle}>
      <div style={titleStyle}>{blog.title}</div>
      <div style={authorStyle}>by {blog.author}</div>
      <a href={blog.url} style={urlStyle}>{blog.url}</a>
      <div style={addedByStyle}>Added by {blog.user?.name}</div>
      <div style={likesRowStyle}>
        <span style={likesStyle}>{blog.likes} likes</span>
        {user && (
          <button onClick={handleLike} style={likeButtonStyle}>like</button>
        )}
        {isCreator && (
          <button onClick={handleDelete} style={removeButtonStyle}>remove</button>
        )}
      </div>
    </div>
  )
}

export default BlogView