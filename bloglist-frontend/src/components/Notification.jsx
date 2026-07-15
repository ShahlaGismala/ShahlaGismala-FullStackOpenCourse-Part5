const Notification = ({ message, type }) => {
  if (message === null) return null

  const style = {
    border: '2px solid',
    padding: '10px',
    marginBottom: '10px',
    color: type === 'error' ? 'red' : 'green',
    borderColor: type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    borderRadius: '5px',
    fontSize: '16px',
  }

  return <div style={style}>{message}</div>
}

export default Notification