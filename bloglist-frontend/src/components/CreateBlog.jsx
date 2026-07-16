import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateBlog = ({ onCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    await onCreate({ title, author, url })
    navigate('/')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input
            type="text"
            value={title}
            placeholder="title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            placeholder="author"
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            placeholder="url"
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default CreateBlog