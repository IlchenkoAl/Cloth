import React from 'react'
import { Input } from 'antd'
import { Search } from 'react-bootstrap-icons'
import { useDispatch, useSelector } from 'react-redux'

import { Card } from '../../components'
import { fetchAllCard } from '../../redux/slices/Card'
import './Home.scss'

const Home = () => {
  const dispatch = useDispatch()
  const { cardData } = useSelector(state => state.card)

  React.useEffect(() => {
    dispatch(fetchAllCard())
  }, [])

  return (
    <div className='home'>
      <div className="home__header">
        <h1>Все кроссовки</h1>
        <Input
          size="large"
          style={{ width: 250, height: 37 }}
          placeholder="Поиск..."
          prefix={<Search color='#E4E4E4' />}
        />
      </div>
      <div className="home__priceList">
        {cardData && cardData.map(item =>
          <Card key={item._id} {...item} type='list' />
        )}
      </div>
    </div>
  )
}

export default Home