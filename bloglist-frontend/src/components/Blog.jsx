import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, onUpdate, onDelete, currentUser }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

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
      onDelete(blog.id)
    }
  }

  const isCreator = blog.user?.username === currentUser?.username

  return (
    <div className="blog" style={blogStyle} data-testid="blog">
      <div className="blogSummary">
        {blog.title} {blog.author}
        <button onClick={() => setDetailsVisible(!detailsVisible)}>
          {detailsVisible ? 'hide' : 'view'}
        </button>
      </div>
      {detailsVisible && (
        <div className="blogDetails">
          <a href={blog.url}>{blog.url}</a>
          <div className="likes">
            likes {blog.likes}{' '}
            <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          {isCreator && <button onClick={handleDelete}>remove</button>}
        </div>
      )}
    </div>
  )
}

export default Blog