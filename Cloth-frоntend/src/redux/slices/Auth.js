import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

export const fetchLogin = createAsyncThunk('auth/fetchLogin', async (params) => {
    try {
        const { data } = await axios.post('/auth/login', params)
        return data
    } catch (error) {
        throw error.response.data
    }
})

export const fetchGetMe = createAsyncThunk('auth/fetchGetMe', async () => {
    const { data } = await axios.get('/auth/me')
    return data
})

export const fetchRegister = createAsyncThunk('auth/register', async (params) => {
    try {
        await axios.post('/auth/register', params)
    } catch (error) {
        throw error.response.data
    }
})

const initialState = {
    userData: null,
    status: 'loading',
    error: null,
    registerError: null
}

const authSlice = createSlice({
    name: 'Auth',
    initialState,
    reducers: {
        logout: state => {
            state.data = null
        }
    },
    extraReducers: (bilding) => {
        bilding
            .addCase(fetchLogin.pending, (state) => {
                state.userData = null
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchLogin.fulfilled, (state, action) => {
                state.userData = action.payload
                state.status = 'loaded'
                state.error = null
            })
            .addCase(fetchLogin.rejected, (state, action) => {
                state.userData = null
                state.status = 'error'
                state.error = action.error
            })
            .addCase(fetchGetMe.pending, (state) => {
                state.userData = null
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchGetMe.fulfilled, (state, action) => {
                state.userData = action.payload
                state.status = 'loaded'
                state.error = null
            })
            .addCase(fetchGetMe.rejected, (state) => {
                state.userData = null
                state.status = 'error'
            })
            .addCase(fetchRegister.pending, (state) => {
                state.registerError = null
            })
            .addCase(fetchRegister.rejected, (state, action) => {
                state.registerError = action.error
            })
    }
})

export const selectIsAuth = state => Boolean(state.auth.userData)
export const { logout } = authSlice.actions
export default authSlice.reducer