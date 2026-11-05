import { memo } from 'react'
import { useSelector } from 'react-redux'
import BrandSelector from './BrandSelector'
import Loader from './Loader'
import ErrorMessage from './ErrorMessage'

function BrandsSection() {
  const brandsLoading = useSelector((state) => state.parts.brandsLoading)
  const brandsError = useSelector((state) => state.parts.brandsError)

  return (
    <>
      {brandsLoading && <Loader text="Поиск производителей..." />}
      {brandsError && <ErrorMessage message={brandsError} />}
      <BrandSelector />
    </>
  )
}

export default memo(BrandsSection)
