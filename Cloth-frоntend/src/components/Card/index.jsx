import React from 'react'
import { Heart, Plus, HeartFill, Check, X } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { message, Modal } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'

import { selectIsAuth } from '../../redux/slices/Auth'
import { fetchAllCard } from '../../redux/slices/Card'
import { fetchGetMe } from '../../redux/slices/Auth'
import { setAddCardBookmarks, setRemoveCardBookmarks } from '../../redux/slices/Bookmarks'
import { setRemoveCardCart, setAddCardCart } from '../../redux/slices/Cart'
import axios from '../../axios'
import './Card.scss'

const Card = ({ _id, title, imgUrl, price, type, isLiked }) => {
    const dispatch = useDispatch()

    const { userData } = useSelector(state => state.auth)
    const isAuth = useSelector(selectIsAuth)
    const [liked, setLiked] = React.useState(false)
    const [added, setAdded] = React.useState(false)

    const addedCard = userData && userData.cart.includes(_id)
    const addedBookmarks = userData && userData.bookmarks.includes(_id)

    const { confirm } = Modal
    const showDeleteConfirm = (confirmObj, reqestType) => {
        confirm({
            ...confirmObj,
            icon: <QuestionCircleOutlined style={{ color: 'red' }} />,
            onOk() { onRemove(_id, title, reqestType) },
        })
    }

    const onAdded = async (card, reqestType) => {
        switch (reqestType) {
            case 'ADD_CART':
                message.success(`${card.title} добавленны в корзину`, 1.3)
                dispatch(setAddCardCart(card))
                setAdded(!added)
                await axios.post('/user/addCart', { cardId: card._id })
                break
            case 'ADD_BOOKSMARKS':
                message.success(`${card.title} добавленны в закладки`, 1.3)
                dispatch(setAddCardBookmarks(card))
                setLiked(!liked)
                await axios.post('/user/addBookmarks', { cardId: card._id })
                break
        }
        dispatch(fetchGetMe())
    }

    const onRemove = async (id, title, reqestType) => {
        switch (reqestType) {
            case 'REMOVE_CART':
                message.success(`${title} были убраны из корзины`, 1.3)
                dispatch(setRemoveCardCart(id))
                if (type === 'list') {
                    setAdded(false)
                } else {
                    dispatch(fetchAllCard())
                }
                await axios.post('/user/removeCart', { cardId: id })
                break
            case 'REMOVE_BOOKSMARKS':
                message.success(`${title} были убраны из закладок`, 1.3)
                dispatch(setRemoveCardBookmarks(id))
                setLiked(false)
                await axios.post('/user/removeBookmarks', { cardId: id })
                break
        }
        dispatch(fetchGetMe())
    }

    return (
        <div
            style={type === 'list' ? {
                width: 220,
                padding: 30,
                borderRadius: 40
            } : {
                width: '100%',
                padding: '10px 20px',
                borderRadius: 20,
                marginBottom: 20
            }}
            className={classnames('card', {
                'card-list': type === 'list',
                'card-cart': type === 'cart'
            })}
        >
            <div className="card__img">
                {isAuth && type === 'list' &&
                    <div
                        onClick={(addedBookmarks || liked || isLiked) ? () =>
                            showDeleteConfirm({
                                title: 'Убрать товар',
                                content: `Убрать ${title} из закладок?`,
                                okText: 'Убрать',
                                okType: 'danger',
                                cancelText: 'Отмена',
                            }, 'REMOVE_BOOKSMARKS') :
                            () => onAdded({ _id, title, imgUrl, price }, 'ADD_BOOKSMARKS')
                        }
                        className={classnames('card__img--likeBtn', {
                            'card__img--likeBtn-liked': addedBookmarks || liked || isLiked
                        })}
                    >
                        {(addedBookmarks || liked || isLiked) ? <HeartFill color='#FF8585' /> : <Heart />}
                    </div>
                }
                <img src={'http://snapi.candy.anosov.ru' + imgUrl} alt="Sneakers" />
            </div>
            <div className="card__title">
                <Link to={"/" + _id}>{title}</Link>
                {type === 'cart' && <b>{price} ₽</b>}
            </div>
            {type === 'list' ?
                <div className="card__bottom">
                    <div className="card__bottom--price">
                        <b>Цена:</b>
                        <p>{price} ₽</p>
                    </div>
                    {isAuth &&
                        <div
                            onClick={(addedCard || added) ? () =>
                                showDeleteConfirm({
                                    title: 'Убрать товар',
                                    content: `Убрать ${title} из корзины?`,
                                    okText: 'Убрать',
                                    okType: 'danger',
                                    cancelText: 'Отмена',
                                }, 'REMOVE_CART') :
                                () => onAdded({ _id, title, imgUrl, price }, 'ADD_CART')
                            }
                            className={classnames('card__bottom--addBtn', {
                                'card__bottom--addBtn-added': addedCard || added
                            })}
                        >
                            {addedCard || added ? <Check color='#fff' /> : <Plus />}
                        </div>
                    }
                </div> :
                <div
                    onClick={() => showDeleteConfirm({
                        title: 'Убрать товар',
                        content: `Убрать ${title} из корзины?`,
                        okText: 'Убрать',
                        okType: 'danger',
                        cancelText: 'Отмена',
                    }, 'REMOVE_CART')
                    }
                    className='card__bottom--remove'>
                    <X />
                </div>
            }
        </div>
    )
}

Card.propTypes = {
    _id: PropTypes.string,
    title: PropTypes.string,
    imgUrl: PropTypes.string,
    price: PropTypes.number,
    type: PropTypes.string,
    isLiked: PropTypes.bool
}

export default Card