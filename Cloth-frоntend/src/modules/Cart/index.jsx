import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Drawer } from 'antd'

import { fetchAllCart } from '../../redux/slices/Cart'
import { Box } from '../../assets'
import { Card } from '../../components'
import { setIsVisibCard } from '../../redux/slices/visib'
import { Button } from '../../components'
import { calcTotalPrice } from '../../utils'
import './Cart.scss'

const Cart = () => {
  const dispatch = useDispatch()
  const { cartItems, totalPrice } = useSelector(state => state.cart)
  const { isVisibCart } = useSelector(state => state.visib)

  const onCloseCart = () => dispatch(setIsVisibCard(false))


  React.useEffect(() => {
    calcTotalPrice(cartItems)
  }, [cartItems])

  React.useEffect(() => {
    dispatch(fetchAllCart())
  }, [])

  return (
    <Drawer closable={false} open={isVisibCart} onClose={onCloseCart} >
      <div className='cart'>
        <div className="cart__block">
          <div className="cart__block--top">
            <div className="cart__block--top--title">
              <h1>Корзина</h1>
            </div>
            {cartItems ?
              <div className="cart__block--top--items">
                {cartItems && cartItems.map(item => <Card key={item._id} {...item} type='cart' />)}
              </div> :
              <div className="cart__block--top--empty">
                <div className="cart__block--top--empty-block">
                  <img src={Box} alt="Box" />
                  <h1>Корзина пустая</h1>
                  <p>Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ.</p>
                  <Button type='back' content='Вернуться назад' action={onCloseCart} />
                </div>
              </div>
            }
          </div>
          {cartItems &&
            <div className="cart__block--bottom">
              <div className="cart__block--bottom--price">
                <p>Итого:</p>
                <span></span>
                <b>{totalPrice} ₽</b>
              </div>
              <div className="cart__block--bottom--btn">
                <Button type='next' content='Оформить заказ' />
              </div>
            </div>
          }
        </div>
      </div>
    </Drawer>
  )
}

export default Cart