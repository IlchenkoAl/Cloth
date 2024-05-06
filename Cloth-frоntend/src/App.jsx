import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Outlet } from 'react-router-dom'

import { Header } from './components'
import { fetchGetMe } from './redux/slices/Auth'
import { Bookmarks, Home, Auth, Profile, FullCard, AddSneakers } from './pages'
import { Cart, Login, Register} from './modules'
import { fetchAllBookmarks } from './redux/slices/Bookmarks'

const App = () => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (window.localStorage.getItem('token')) {
      dispatch(fetchGetMe())
      dispatch(fetchAllBookmarks())
      return
    }
  }, [])

  return (
    <div className="wrapper">
      <Cart />
      <Routes>
        <Route path='/auth' element={<Auth />}>
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
        </Route>
        <Route path='/' element={
          <div className="wrapper__content">
            <Header />
            <Outlet />
          </div>
        }>
          <Route path='' element={<Home />} />
          <Route path='bookmarks' element={<Bookmarks />} />
          <Route path='profile' element={<Profile />} />
          <Route path='addsneakers' element={<AddSneakers />} />
          <Route path=':_id' element={<FullCard />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
