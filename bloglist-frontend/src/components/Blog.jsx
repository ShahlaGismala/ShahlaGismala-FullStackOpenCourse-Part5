import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, onUpdate }) => {
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

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setDetailsVisible(!detailsVisible)}>
          {detailsVisible ? 'hide' : 'view'}
        </button>
      </div>
      {detailsVisible && (
        <div>
          <a href={blog.url}>{blog.url}</a>
          <div>likes {blog.likes} <button onClick={handleLike}>like</button></div>
          <div>{blog.user?.name}</div>
        </div>
      )}
    </div>
  )
}

export default Blog