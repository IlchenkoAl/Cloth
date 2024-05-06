import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { calcTotalPrice } from '../../utils'
import axios from '../../axios'

export const fetchAllCart = createAsyncThunk('card/fetchAllCart', async () => {
    try {
        const { data } = await axios.get('/user/allCart')
        return data
    } catch (error) {
        throw error.response.data
    }
})

const initialState = {
    cartItems: null,
    status: 'loading',
    error: null,
    totalPrice: 0
}

const cartSlice = createSlice({
    name: 'Cart',
    initialState,
    reducers: {
        setAddCardCart: (state, action) => {
            state.cartItems ? state.cartItems.push({ ...action.payload }) : state.cartItems = new Array(action.payload)
            state.totalPrice = calcTotalPrice(state.cartItems)
        },
        setRemoveCardCart: (state, actios) => {
            const newCartItems = state.cartItems.filter(item => item._id !== actios.payload)
            state.cartItems = newCartItems.length === 0 ? null : newCartItems
            state.totalPrice = calcTotalPrice(state.cartItems)
        }
    },
    extraReducers: (bilding) => {
        bilding
            .addCase(fetchAllCart.fulfilled, (state, action) => {
                state.cartItems = action.payload.length === 0 ? null : action.payload
                state.status = 'loaded'
                state.error = null
                state.totalPrice = calcTotalPrice(state.cartItems)
            })
            .addCase(fetchAllCart.pending, (state) => {
                state.cartItems = null
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchAllCart.rejected, (state, action) => {
                state.cartItems = null
                state.status = 'error'
                state.error = action.error
            })
    }
})

export const { setRemoveCardCart, setAddCardCart } = cartSlice.actions
export default cartSlice.reducer