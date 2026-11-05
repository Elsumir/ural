const BASE_URL = 'http://api.favorit-parts.ru/hs/hsprice/'
const API_KEY = '00000000-0000-0000-0000-000000000001'

export async function fetchBrandsFromApi(number) {
  const url = `${BASE_URL}?key=${API_KEY}&number=${encodeURIComponent(number)}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Ошибка сервера: ${response.status}`)
  }

  const data = await response.json()

  if (data.error) {
    throw new Error(data.error)
  }

  if (!Array.isArray(data.goods) || data.goods.length === 0) {
    return []
  }

  const validGoods = data.goods.filter(item => item && item.brand && item.brand.trim() !== '')
  const uniqueBrands = [...new Set(validGoods.map(item => item.brand.trim()))]

  return uniqueBrands
}

export async function fetchOffersFromApi(number, brand) {
  const url = `${BASE_URL}?key=${API_KEY}&number=${encodeURIComponent(number)}&brand=${encodeURIComponent(brand)}&analogues=on`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Ошибка сервера: ${response.status}`)
  }

  const data = await response.json()

  if (data.error) {
    throw new Error(data.error)
  }

  const goods = Array.isArray(data.goods) ? data.goods : []

  const requestedItems = goods.filter(item => item && item.brand && item.brand.trim() !== '')

  const analogues = []
  goods.forEach(item => {
    if (Array.isArray(item.analogues)) {
      item.analogues.forEach(an => {
        if (an && an.brand && an.brand.trim() !== '') {
          analogues.push(an)
        }
      })
    }
  })

  return {
    requestedItems,
    analogues
  }
}
