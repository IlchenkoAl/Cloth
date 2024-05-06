import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { ArrowRightShort, ArrowLeftShort } from 'react-bootstrap-icons'

import './Button.scss'

const Button = ({ isSubmitting, width, padding, borderRadius, type, content, action }) => {
  return (
    <button disabled={isSubmitting} style={{ width, padding, borderRadius }} onClick={action} className={classnames('button', {
      'button-back': type === 'back',
      'button-next': type === 'next',
    })}>
      {isSubmitting ?
        <div className='button-typing'>
          <span></span>
          <span></span>
          <span></span>
        </div>
        :
        <>
          {content}
          {type && (type === 'back' ? <ArrowLeftShort /> : <ArrowRightShort />)}
        </>
      }
    </button>
  )
}

Button.propTypes = {
  type: PropTypes.string,
  content: PropTypes.string,
  action: PropTypes.func,
  isSubmitting: PropTypes.bool,
}

export default Button