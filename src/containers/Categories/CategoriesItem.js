import React from 'react'
import { Link } from 'react-router-dom'
import Row from './CategoriesRow'
import Thumb from './CategoriesThumb'
import ThumbCell from './CategoriesThumbCell'

export default ({ category }) => {
    return (
        <Row>
            <ThumbCell>
                <Thumb src={category.attributes.image ? category.attributes.image._url : '/images/placeholder.jpg'}
                    alt={category.attributes.name} />
                </ThumbCell>
            <div>
                <div><Link to={`/category/${category.id}`}>{category.get('name')}</Link></div>
                <div className="text-secondary">{category.get('identifier')}</div>
            </div>
            <div><Link to={`/products?category=${category.id}`}>Товары</Link></div>
        </Row>
    )
}
