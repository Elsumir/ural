import { useState, useEffect, useRef, memo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBrands, resetSearch, setSearchQuery } from '../store/partsSlice'

const SAMPLE_ARTICLES = ['01089', '7160500039S', '0189']

function SearchBar() {
  const dispatch = useDispatch()
  const searchQuery = useSelector((state) => state.parts.searchQuery)
  const [inputValue, setInputValue] = useState(searchQuery)
  const debounceTimerRef = useRef(null)
  const lastFetchedRef = useRef('')

  useEffect(() => {
    setInputValue(searchQuery)
  }, [searchQuery])

  const executeSearch = useCallback((value) => {
    const trimmed = value.trim()
    if (!trimmed) {
      lastFetchedRef.current = ''
      dispatch(resetSearch())
      return
    }

    if (trimmed === lastFetchedRef.current) {
      return
    }

    lastFetchedRef.current = trimmed
    dispatch(setSearchQuery(trimmed))
    dispatch(fetchBrands(trimmed))
  }, [dispatch])

  const handleChange = (e) => {
    const val = e.target.value
    setInputValue(val)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    const trimmed = val.trim()
    if (!trimmed) {
      lastFetchedRef.current = ''
      dispatch(resetSearch())
      return
    }

    if (trimmed.length >= 2) {
      debounceTimerRef.current = setTimeout(() => {
        executeSearch(trimmed)
      }, 500)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    executeSearch(inputValue)
  }

  const handleClear = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    setInputValue('')
    lastFetchedRef.current = ''
    dispatch(resetSearch())
  }

  const handleSampleClick = (sample) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    setInputValue(sample)
    executeSearch(sample)
  }

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>
          <label htmlFor="article-input" className="form-label fw-semibold">
            Артикул (номер) автозапчасти
          </label>
          <div className="input-group input-group-lg">
            <input
              id="article-input"
              type="text"
              className="form-control"
              placeholder="Например: 01089 или 7160500039S"
              value={inputValue}
              onChange={handleChange}
              autoComplete="off"
            />
            {inputValue && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleClear}
                title="Очистить"
              >
                &times;
              </button>
            )}
            <button type="submit" className="btn btn-primary px-4">
              Найти
            </button>
          </div>
        </form>

        <div className="mt-3 d-flex align-items-center gap-2 flex-wrap">
          <span className="text-muted small">Примеры для проверки:</span>
          {SAMPLE_ARTICLES.map((sample) => (
            <button
              key={sample}
              type="button"
              className="btn btn-sm btn-outline-secondary py-0 px-2"
              onClick={() => handleSampleClick(sample)}
            >
              {sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(SearchBar)
