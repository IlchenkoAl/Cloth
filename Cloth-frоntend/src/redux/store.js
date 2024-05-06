import { configureStore } from '@reduxjs/toolkit'

import visib from './slices/visib'
import auth from './slices/Auth'
import card from './slices/Card'
import cart from './slices/Cart'
import bookmarks from './slices/Bookmarks'

const store = configureStore({
    reducer: { visib, auth, card, cart, bookmarks }
})

export default store