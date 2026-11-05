export default function ErrorMessage({ message }) {
  if (!message) return null

  return (
    <div className="alert alert-danger my-3" role="alert">
      {message}
    </div>
  )
}
