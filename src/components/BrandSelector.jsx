import { memo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedBrand, fetchOffers } from '../store/partsSlice'

const BrandButton = memo(function BrandButton({ brand, isSelected, onClick }) {
  return (
    <button
      type="button"
      className={`btn btn-sm ${
        isSelected ? 'btn-primary shadow-sm' : 'btn-outline-primary'
      }`}
      onClick={() => onClick(brand)}
    >
      {brand}
    </button>
  )
})

function BrandSelector() {
  const dispatch = useDispatch()
  const brands = useSelector((state) => state.parts.brands)
  const selectedBrand = useSelector((state) => state.parts.selectedBrand)
  const searchQuery = useSelector((state) => state.parts.searchQuery)
  const offersLoading = useSelector((state) => state.parts.offersLoading)

  const handleSelect = useCallback(
    (brand) => {
      if (brand === selectedBrand && !offersLoading) return

      dispatch(setSelectedBrand(brand))
      dispatch(fetchOffers({ number: searchQuery, brand }))
    },
    [dispatch, selectedBrand, offersLoading, searchQuery]
  )

  if (!brands || brands.length === 0) {
    return null
  }

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="card-title mb-0 fw-bold">
            Выберите производителя ({brands.length}):
          </h6>
          {selectedBrand && (
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
              Выбран: {selectedBrand}
            </span>
          )}
        </div>

        <div className="d-flex flex-wrap gap-2">
          {brands.map((brand) => (
            <BrandButton
              key={brand}
              brand={brand}
              isSelected={brand === selectedBrand}
              onClick={handleSelect}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(BrandSelector)
