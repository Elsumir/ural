import SearchBar from './components/SearchBar'
import BrandsSection from './components/BrandsSection'
import OffersSection from './components/OffersSection'

export default function App() {
  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container" style={{ maxWidth: '1200px' }}>
        <header className="mb-4 text-center">
          <h1 className="h3 fw-bold text-dark">Поиск автозапчастей и аналогов</h1>
          <p className="text-secondary mb-0">
            Введите артикул детали, выберите производителя и получите актуальные предложения
          </p>
        </header>

        <SearchBar />
        <BrandsSection />
        <OffersSection />
      </div>
    </div>
  )
}
