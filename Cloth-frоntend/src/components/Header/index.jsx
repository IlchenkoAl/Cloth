import React from 'react'
import { Cart3, Heart, PersonCircle, PatchPlus } from 'react-bootstrap-icons'
import { useDispatch, useSelector } from 'react-redux'
import { Badge } from 'antd'
import { Link } from 'react-router-dom'

import { calcTotalPrice } from '../../utils'
import { setIsVisibCard } from '../../redux/slices/visib'
import { selectIsAuth } from '../../redux/slices/Auth'
import { Logo } from '../../assets'
import './Header.scss'

const Header = () => {
    const dispatch = useDispatch()
    const isAuth = useSelector(selectIsAuth)
    const { totalPrice, cartItems } = useSelector(state => state.cart)
    const { bookmarksItems } = useSelector(state => state.bookmarks)

    const onVisibCart = () => dispatch(setIsVisibCard(true))

    React.useEffect(() => {
        calcTotalPrice(cartItems)
    }, [cartItems])

    return (
        <div className='header'>
            <Link to='/' className="header__logo">
                <img src={Logo} alt="Logo" />
                <div className="header__logo--text">
                    <p>sneakers</p>
                    <b>Магазин лучших кросовок</b>
                </div>
            </Link>
            <div className="header__profile" style={!isAuth ? { border: 'none', borderRadius: 0 } : {}}>
                {isAuth ?
                    <>
                        <div className="header__profile--btn">
                            <Link to='/addsneakers'>Добавить товар <PatchPlus style={{ marginLeft: 10 }}/></Link>
                        </div>
                        <div onClick={onVisibCart} className="header__profile--cart">
                            <Badge color='#87d194' count={cartItems && cartItems.length} offset={[-30]} size='small'>
                                <Cart3 />
                            </Badge>
                            <p>{totalPrice} ₽</p>
                        </div>
                        <div className="header__profile--btn">
                            <Link to='/bookmarks'>
                                <Badge color='#ff9a9a' count={bookmarksItems && bookmarksItems.length} size='small'>
                                    <Heart />
                                </Badge>
                            </Link>
                            <Link to='/profile'>
                                <PersonCircle />
                            </Link>
                        </div>
                    </> :
                    <div className="header__profile--authBtn">
                        <Link to='/auth/login'>Войти</Link>
                        <Link to='/auth/register'>Зарегестрироваться</Link>
                    </div>
                }
            </div>
        </div>
    )
}

export default Header