import React from 'react'
import pyqpdf from '../assets/pyq.pdf'


const PyqPage = () => {
  return (
    <div>
        <embed src={pyqpdf} type="aplication/pdf" />
    </div>
  )
}

export default PyqPage