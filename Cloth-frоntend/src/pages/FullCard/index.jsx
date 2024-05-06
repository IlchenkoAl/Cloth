import React from 'react'
import { Link } from 'react-router-dom'
import { CaretLeft } from 'react-bootstrap-icons'

import './FullCard.scss'

const FullCard = ({ title,  }) => {
  return (
    <div className='fullcard'>
      <div className="fullcard__header">
        <Link to='/' className='fullcard__header--back'>
          <CaretLeft />
        </Link>
        <h1>Мои закладки</h1>
      </div>
    </div >
  )
}

export default FullCard