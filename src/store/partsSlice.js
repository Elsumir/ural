import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchBrandsFromApi, fetchOffersFromApi } from '../api/partsApi'

export const fetchBrands = createAsyncThunk(
  'parts/fetchBrands',
  async (number, { rejectWithValue }) => {
    try {
      const brands = await fetchBrandsFromApi(number)
      return brands
    } catch (err) {
      return rejectWithValue(err.message || 'Не удалось загрузить список производителей')
    }
  }
)

export const fetchOffers = createAsyncThunk(
  'parts/fetchOffers',
  async ({ number, brand }, { rejectWithValue }) => {
    try {
      const data = await fetchOffersFromApi(number, brand)
      return data
    } catch (err) {
      return rejectWithValue(err.message || 'Не удалось загрузить предложения и аналоги')
    }
  }
)

const initialState = {
  searchQuery: '',
  brands: [],
  brandsLoading: false,
  brandsError: null,
  selectedBrand: null,
  requestedItems: [],
  analogues: [],
  offersLoading: false,
  offersError: null
}

const partsSlice = createSlice({
  name: 'parts',
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload
    },
    setSelectedBrand(state, action) {
      state.selectedBrand = action.payload
    },
    clearOffers(state) {
      state.requestedItems = []
      state.analogues = []
      state.selectedBrand = null
      state.offersError = null
    },
    resetSearch(state) {
      state.searchQuery = ''
      state.brands = []
      state.brandsLoading = false
      state.brandsError = null
      state.selectedBrand = null
      state.requestedItems = []
      state.analogues = []
      state.offersLoading = false
      state.offersError = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.brandsLoading = true
        state.brandsError = null
        state.brands = []
        state.selectedBrand = null
        state.requestedItems = []
        state.analogues = []
        state.offersError = null
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.brandsLoading = false
        state.brands = action.payload
        if (action.payload.length === 0) {
          state.brandsError = 'По данному артикулу производителей не найдено'
        }
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.brandsLoading = false
        state.brandsError = action.payload
      })
      .addCase(fetchOffers.pending, (state) => {
        state.offersLoading = true
        state.offersError = null
        state.requestedItems = []
        state.analogues = []
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.offersLoading = false
        state.requestedItems = action.payload.requestedItems
        state.analogues = action.payload.analogues
        if (
          action.payload.requestedItems.length === 0 &&
          action.payload.analogues.length === 0
        ) {
          state.offersError = 'Предложений и аналогов не найдено'
        }
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.offersLoading = false
        state.offersError = action.payload
      })
  }
})

export const { setSearchQuery, setSelectedBrand, clearOffers, resetSearch } = partsSlice.actions
export default partsSlice.reducer
