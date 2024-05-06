import React from 'react'
import { CaretLeft } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { Button, Card } from '../../components'
import { NotBookmarks } from '../../assets'
import './Bookmarks.scss'

const Bookmarks = () => {
    const { bookmarksItems } = useSelector(state => state.bookmarks)

    return (
        <div className='bookmarks'>
            {bookmarksItems ?
                <>
                    <div className="bookmarks__header">
                        <Link to='/' className='bookmarks__header--back'>
                            <CaretLeft />
                        </Link>
                        <h1>Мои закладки</h1>
                    </div>
                    <div className="bookmarks__bookmarksItems">
                        {bookmarksItems.map((item, index) =>
                            <Card key={index} {...item} type='list' isLiked />
                        )}
                    </div>
                </> :
                <div className="bookmarks__notBookmarks">
                    <img src={NotBookmarks} alt="notBookmarks" />
                    <h1>Закладок нет :(</h1>
                    <p>Вы ничего не добавляли в закладки</p>
                    <Link to='/'>
                        <Button width={265} type='back' content='Вернуться назад' />
                    </Link>
                </div>
            }
        </div>
    )
}

export default Bookmarks