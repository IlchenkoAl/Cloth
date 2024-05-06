import React from 'react'
import { CaretLeft } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'

import { NotPurchase } from '../../assets'
import { Button, Card } from '../../components'
import './Profile.scss'

const Profile = () => {
    // const items = [
    //     {
    //         title: 'ADIDAS DEERUPT RUNNER БЕЛО-ЧЕРНЫЕ МУЖСКИЕ-ЖЕНСКИЕ (35-44)',
    //         imgUrl: 'https://streetfoot.ru/wp-content/uploads/2020/07/adidas-deerupt-runner-belo-chernye-40-44.jpg',
    //         price: 5090
    //     },
    // ]
    const items = null

    return (
        <div className='profile'>
            {items ?
                <>
                    <div className="profile__header">
                        <Link to='/' className='bookmarks__header--back'>
                            <CaretLeft />
                        </Link>
                        <h1>Мои покупки</h1>
                    </div>
                    <div className="profile__profileItems">
                        {items.map((item, index) =>
                            <Card key={index} {...item} type='list' />
                        )}
                    </div>
                </> :
                <div className="profile__notPurchase">
                    <img src={NotPurchase} alt="notPurchase" />
                    <h1>У вас нет заказов</h1>
                    <p>Вы нищеброд? <br /> Оформите хотя бы один заказ.</p>
                    <Link to='/'>
                        <Button width={265} type='back' content='Вернуться назад' />
                    </Link>
                </div>
            }
        </div>
    )
}

export default Profile