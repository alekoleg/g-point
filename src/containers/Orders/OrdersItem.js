import React from 'react'
import { Link } from 'react-router-dom'
import Row from './OrdersRow'
import { formatDistanceWithOptions } from 'date-fns/fp'
import { ru } from 'date-fns/locale'

export default ({ order }) => {
    const status = {
        color: order.get('status') === 'success' ? 'var(--success)' : (order.get('status') === 'failed,' ? 'var(--danger)' : 'var(--warning)')
    }

    return (
        <Row>
            <div>
                <div style={status}>{order.id}</div>
                <small>{formatDistanceWithOptions({ locale: ru }, order.createdAt, new Date())} назад</small>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 8rem 8rem'}}>{order.get('details').map(detail => (
                <React.Fragment key={detail.id}>
                    <div><Link to={`/product/${detail.get('product').id}`}>{detail.get('product').get('name')}</Link></div>
                    <div>{detail.get('count')}</div>
                    <div>{detail.get('confirmedPrice')} ₽</div>
                </React.Fragment>
            ))}</div>
            <div>{order.attributes.price} ₽</div>
        </Row>
    )
}
