const Notification = ({ message, type }) => {
  if (message === null) return null

  const style = {
    padding: '12px 20px',
    marginBottom: '20px',
    borderRadius: '6px',
    fontSize: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: type === 'error' ? '#fdecea' : '#edf7ed',
    color: type === 'error' ? '#b71c1c' : '#1b5e20',
    border: `1px solid ${type === 'error' ? '#f5c6c6' : '#b2dfb2'}`,
  }

  const icon = type === 'error' ? '✕' : '✓'

  return (
    <div style={style}>
      <span>{icon}</span>
      <span>{message}</span>
    </div>
  )
}

export default Notification