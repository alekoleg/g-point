import React from 'react'
import { Link } from 'react-router-dom'
import Row from './ProductsRow'
import Thumb from './ProductsThumb'
import ThumbCell from './ProductsThumbCell'

export default ({ product }) => {
    return (
        <Row>
            <ThumbCell><Thumb src={product.get('image1') ? product.get('image1').url() : '/images/placeholder.jpg'} alt={product.get('name')} /></ThumbCell>
            <div>
                <div><Link to={`/product/${product.id}`}>{product.get('name')}</Link></div>
                <div className="text-gray">{product.get('identifier')}</div>
            </div>
            <div>{product.get('price')} ₽</div>
        </Row>
    )
}
