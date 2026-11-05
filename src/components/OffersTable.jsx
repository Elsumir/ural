import { useState, useMemo, memo } from 'react'
import { useSelector } from 'react-redux'

function formatPrice(value) {
  if (typeof value !== 'number' || value <= 0) return '—'
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2
  }).format(value)
}

function formatDate(dateString) {
  if (!dateString) return '—'
  try {
    const d = new Date(dateString)
    return d.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return dateString
  }
}

function getPriceDisplay(item) {
  if (item.warehouses && item.warehouses.length > 0) {
    const prices = item.warehouses
      .map((w) => w.price)
      .filter((p) => typeof p === 'number' && p > 0)

    if (prices.length > 0) {
      const min = Math.min(...prices)
      const max = Math.max(...prices)
      if (min === max) {
        return formatPrice(min)
      }
      return `от ${formatPrice(min)}`
    }
  }

  if (item.price && item.price > 0) {
    return formatPrice(item.price)
  }

  return '—'
}

const OfferRow = memo(function OfferRow({ item }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const warehousesCount = item.warehouses ? item.warehouses.length : 0

  return (
    <tr className={!item.isAnalogue ? 'table-primary bg-opacity-10' : ''}>
      <td colSpan="7" className="p-0 border-0">
        <table className="table table-borderless mb-0 align-middle">
          <tbody>
            <tr>
              <td style={{ width: '130px' }}>
                {item.isAnalogue ? (
                  <span className="badge bg-secondary-subtle text-secondary border">
                    Аналог
                  </span>
                ) : (
                  <span className="badge bg-primary text-white">Основной</span>
                )}
              </td>
              <td className="fw-semibold text-nowrap" style={{ width: '140px' }}>
                {item.number}
              </td>
              <td className="fw-bold" style={{ width: '160px' }}>
                {item.brand}
              </td>
              <td>{item.name || '—'}</td>
              <td className="text-center" style={{ width: '160px' }}>
                {item.count > 0 ? (
                  <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                    {item.count} шт.
                  </span>
                ) : (
                  <span className="badge bg-light text-muted border px-2 py-1">
                    0 шт.
                  </span>
                )}
              </td>
              <td className="text-end fw-bold text-nowrap" style={{ width: '160px' }}>
                {getPriceDisplay(item)}
              </td>
              <td className="text-center" style={{ width: '130px' }}>
                {warehousesCount > 0 ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary py-0 px-2"
                    onClick={() => setIsExpanded((prev) => !prev)}
                  >
                    {isExpanded ? 'Скрыть' : `Склады (${warehousesCount})`}
                  </button>
                ) : (
                  <span className="text-muted small">—</span>
                )}
              </td>
            </tr>

            {isExpanded && warehousesCount > 0 && (
              <tr>
                <td colSpan="7" className="bg-light p-3 border-top border-bottom">
                  <div className="small fw-semibold mb-2 text-secondary">
                    Предложения со складов для {item.brand} {item.number}:
                  </div>
                  <div className="table-responsive bg-white rounded border">
                    <table className="table table-sm table-striped mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Склад</th>
                          <th>Собственный склад</th>
                          <th>Дата отгрузки</th>
                          <th className="text-center">Остаток</th>
                          <th className="text-end">Цена</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.warehouses.map((w, wIdx) => (
                          <tr key={w.id || wIdx}>
                            <td className="fw-semibold">
                              {w.code || w.id || 'Склад'}
                            </td>
                            <td>{w.own ? 'Да' : 'Партнерский'}</td>
                            <td>{formatDate(w.shipmentDate)}</td>
                            <td className="text-center">{w.stock} шт.</td>
                            <td className="text-end fw-bold text-primary">
                              {formatPrice(w.price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </td>
    </tr>
  )
})

function OffersTable() {
  const requestedItems = useSelector((state) => state.parts.requestedItems)
  const analogues = useSelector((state) => state.parts.analogues)
  const selectedBrand = useSelector((state) => state.parts.selectedBrand)

  const [activeTab, setActiveTab] = useState('all')
  const [onlyInStock, setOnlyInStock] = useState(false)
  const [filterText, setFilterText] = useState('')

  const combinedList = useMemo(() => {
    const mainList = (requestedItems || []).map((item, idx) => ({
      ...item,
      id: item.goodsID || `main-${idx}`,
      isAnalogue: false
    }))

    const analogList = (analogues || []).map((item, idx) => ({
      ...item,
      id: item.goodsID || `analog-${idx}`,
      isAnalogue: true
    }))

    return [...mainList, ...analogList]
  }, [requestedItems, analogues])

  const filteredList = useMemo(() => {
    return combinedList.filter((item) => {
      if (activeTab === 'requested' && item.isAnalogue) return false
      if (activeTab === 'analogues' && !item.isAnalogue) return false

      if (onlyInStock && (!item.count || item.count <= 0)) return false

      if (filterText.trim()) {
        const query = filterText.toLowerCase().trim()
        const matchName = item.name && item.name.toLowerCase().includes(query)
        const matchBrand = item.brand && item.brand.toLowerCase().includes(query)
        const matchNumber = item.number && item.number.toLowerCase().includes(query)
        if (!matchName && !matchBrand && !matchNumber) return false
      }

      return true
    })
  }, [combinedList, activeTab, onlyInStock, filterText])

  if (!selectedBrand || combinedList.length === 0) {
    return null
  }

  return (
    <div className="card shadow-sm border-0 mb-5">
      <div className="card-header bg-white border-bottom p-3">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <ul className="nav nav-pills">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link py-1 px-3 ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                Все ({combinedList.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link py-1 px-3 ${activeTab === 'requested' ? 'active' : ''}`}
                onClick={() => setActiveTab('requested')}
              >
                Запрошенный артикул ({requestedItems.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link py-1 px-3 ${activeTab === 'analogues' ? 'active' : ''}`}
                onClick={() => setActiveTab('analogues')}
              >
                Аналоги ({analogues.length})
              </button>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3 flex-wrap">
            <div className="form-check form-switch mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="onlyInStockSwitch"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
              />
              <label className="form-check-label small" htmlFor="onlyInStockSwitch">
                Только в наличии
              </label>
            </div>

            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Фильтр по названию/номеру..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              style={{ maxWidth: '240px' }}
            />
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th scope="col" style={{ width: '130px' }}>
                Тип
              </th>
              <th scope="col" style={{ width: '140px' }}>
                Артикул
              </th>
              <th scope="col" style={{ width: '160px' }}>
                Производитель
              </th>
              <th scope="col">Название детали</th>
              <th scope="col" className="text-center" style={{ width: '160px' }}>
                Остаток на складе
              </th>
              <th scope="col" className="text-end" style={{ width: '160px' }}>
                Стоимость (цена)
              </th>
              <th scope="col" className="text-center" style={{ width: '130px' }}>
                Склады
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">
                  По выбранным фильтрам ничего не найдено
                </td>
              </tr>
            ) : (
              filteredList.map((item) => <OfferRow key={item.id} item={item} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default memo(OffersTable)
