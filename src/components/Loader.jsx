export default function Loader({ text = 'Загрузка...' }) {
  return (
    <div className="d-flex align-items-center justify-content-center py-4 text-primary">
      <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
      <span>{text}</span>
    </div>
  )
}
