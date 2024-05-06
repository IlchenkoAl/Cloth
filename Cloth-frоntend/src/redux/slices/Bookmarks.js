import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from '../../axios'

export const fetchAllBookmarks = createAsyncThunk('card/fetchAllBookmarks', async () => {
    try {
        const { data } = await axios.get('/user/allbookmarks')
        return data
    } catch (error) {
        throw error.response.data
    }
})

const initialState = {
    bookmarksItems: null,
    status: 'loading',
    error: null,
}

const bookmarksSlice = createSlice({
    name: 'Cart',
    initialState,
    reducers: {
        setAddCardBookmarks: (state, action) => {
            state.bookmarksItems ? state.bookmarksItems.push({ ...action.payload }) : state.bookmarksItems = new Array(action.payload)
        },
        setRemoveCardBookmarks: (state, actios) => {
            const newBookmarksItems = state.bookmarksItems.filter(item => item._id !== actios.payload)
            state.bookmarksItems = newBookmarksItems.length === 0 ? null : newBookmarksItems
        }
    },
    extraReducers: (bilding) => {
        bilding
            .addCase(fetchAllBookmarks.fulfilled, (state, action) => {
                state.bookmarksItems = action.payload.length === 0 ? null : action.payload
                state.status = 'loaded'
                state.error = null
            })
            .addCase(fetchAllBookmarks.pending, (state) => {
                state.bookmarksItems = null
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchAllBookmarks.rejected, (state, action) => {
                state.bookmarksItems = null
                state.status = 'error'
                state.error = action.error
            })
    }
})

export const { setRemoveCardBookmarks, setAddCardBookmarks } = bookmarksSlice.actions
export default bookmarksSlice.reducer