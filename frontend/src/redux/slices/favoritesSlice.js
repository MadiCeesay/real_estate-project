import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { favoriteService } from '../../services/favorite.service'

// Keeps a Set of favorited property IDs in memory so PropertyCard components
// across different pages (grid, detail, dashboard) stay in sync without
// each one re-fetching favorite status individually.

export const fetchFavoriteIds = createAsyncThunk(
  'favorites/fetchIds',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await favoriteService.getMine({ limit: 100 })
      return data.data.filter((p) => p?._id).map((p) => p._id)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const toggleFavorite = createAsyncThunk(
  'favorites/toggle',
  async (propertyId, { rejectWithValue }) => {
    try {
      const { data } = await favoriteService.toggle(propertyId)
      return { propertyId, isFavorited: data.data.isFavorited }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { ids: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoriteIds.fulfilled, (state, action) => {
        state.ids = action.payload
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { propertyId, isFavorited } = action.payload
        state.ids = isFavorited
          ? [...state.ids, propertyId]
          : state.ids.filter((id) => id !== propertyId)
      })
  },
})

export default favoritesSlice.reducer
