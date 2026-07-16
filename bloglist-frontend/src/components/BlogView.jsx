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

  return (
    <div>
      <h2>{blog.author}: {blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        likes {blog.likes}
        {user && (
          <button onClick={handleLike}>like</button>
        )}
      </div>
      <div>Added by {blog.user?.name}</div>
      {isCreator && (
        <button onClick={handleDelete}>remove</button>
      )}
    </div>
  )
}

export default BlogView