import { memo } from 'react'
import { useSelector } from 'react-redux'
import OffersTable from './OffersTable'
import Loader from './Loader'
import ErrorMessage from './ErrorMessage'

function OffersSection() {
  const offersLoading = useSelector((state) => state.parts.offersLoading)
  const offersError = useSelector((state) => state.parts.offersError)

  return (
    <>
      {offersLoading && <Loader text="Загрузка предложений и аналогов..." />}
      {offersError && <ErrorMessage message={offersError} />}
      <OffersTable />
    </>
  )
}

export default memo(OffersSection)
