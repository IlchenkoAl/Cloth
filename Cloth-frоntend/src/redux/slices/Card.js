import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

export const fetchAddCard = createAsyncThunk('card/fetchAddCard', async (params) => {
    try {
        const { formData, ...data } = params
        await axios.post('/upload', formData)
        await axios.post('/card/add', data)
    } catch (error) {
        throw error.response.data
    }
})

export const fetchAllCard = createAsyncThunk('card/fetchAllCard', async () => {
    try {
        const { data } = await axios.get('/card/all')
        return data
    } catch (error) {
        throw error.response.data
    }
})

const initialState = {
    cardData: null,
    status: 'loading',
    error: null,
    addedError: null
}

const actionOnCardSlice = createSlice({
    name: 'Card',
    initialState,
    reducers: {},
    extraReducers: (bilding) => {
        bilding
            .addCase(fetchAddCard.fulfilled, (state) => {
                state.addedError = null
            })
            .addCase(fetchAddCard.rejected, (state, action) => {
                state.addedError = action.error
            })
            .addCase(fetchAllCard.fulfilled, (state, action) => {
                state.cardData = action.payload
                state.status = 'loaded'
                state.error = null
            })
            .addCase(fetchAllCard.pending, (state) => {
                state.cardData = null
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchAllCard.rejected, (state, action) => {
                state.cardData = null
                state.status = 'error'
                state.error = action.error
            })
    }
})

export default actionOnCardSlice.reducer