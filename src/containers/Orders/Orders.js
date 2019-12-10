import React, { useContext, useState, useEffect } from 'react'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import Order from './OrdersItem'
import Row from './OrdersRow'
import appContext from '../../store/Context'
import Pagination from '../../components/Pagination'
import { Search } from '../../components/Search'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css'

const MONTHS = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
];

const WEEKDAYS_LONG = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота'
];

const WEEKDAYS_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

const Orders = () => {
    const taxonomy = 'orders'
    const params = useParams()
    const history = useHistory()
    const location = useLocation()
    const qs = new URLSearchParams(location.search)
    const store = useContext(appContext)
    const [orders, setOrders] = useState({
        results: [],
        count: 0,
        pagesCount: 0
    })
    const [categories, setCategories] = useState({})

    useEffect(() => {
        const Order = store.api.Object.extend('Order')

        const _limit = +qs.get('limit') || 20
        const limit = _limit > 0 && _limit <= 100 ? _limit : 20
        const page = params.page || 1
        const status = qs.get('status')
        const category = qs.get('category')
        const search = qs.get('search')
        const day = qs.get('day')

        const query = new store.api.Query(Order).descending('createdAt').limit(limit).skip((page-1)*limit)
        if (status) query.equalTo('status', status)
        if (category) query.equalTo('source', category)
        if (day) {
            const Day = new Date(day)
            query.greaterThanOrEqualTo('createdAt', Day)
            query.lessThan('createdAt', new Date(new Date(Day).setDate(Day.getDate() + 1)))
        }
        if (search) query.matches('objectId', search, 'i')
        query.include('details').include('details.product').withCount().find().then(orders => {
            if (orders.length === 0 && page > 1) {
                history.replace(`/orders?${qs.toString()}`)
            } else {
                setOrders({
                    ...orders,
                    pagesCount: Math.ceil(orders.count/limit)
                })
            }
        }, error => {
            console.log(error)
        })

        const Category = store.api.Object.extend('Category')
        new store.api.Query(Category).find().then(categories => {
            setCategories(categories)
        })
    }, [store.api, location])

    const handleDayChange = day => {
        const _day = day.getDate()
        qs.set('day', `${day.getFullYear()}-${day.getMonth()+1}-${_day < 10 ? `0${_day}` : _day}`)
        for (const [param, value] of qs) if (value === '') qs.delete(param)
        const queryString = `?${qs.toString()}`
        history.push(`/${taxonomy}${(queryString !== '?' ? queryString : '')}`)
    }

    const handleCategoryChange = e => {
        qs.set('category', e.target.value)
        for (const [param, value] of qs) if (value === '') qs.delete(param)
        const queryString = `?${qs.toString()}`
        history.push(`/${taxonomy}${(queryString !== '?' ? queryString : '')}`)
    }
    
    return (
        <div>
            <h1>Заказы</h1>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4rem'}}>
                <Search taxonomy={taxonomy} placeholder="Поиск по ID..." />
                <div>
                    {categories.length > 0 ? <select style={{ marginRight: '2rem' }} onChange={handleCategoryChange}>
                        <option value='' style={{ display: 'none' }}>Выбрать автомат</option>
                        {categories.map(category => <option key={category.id} value={category.get('identifier')}>{category.get('name')}</option>)}
                    </select> : '' }
                    <DayPickerInput onDayChange={handleDayChange}
                        placeholder="Выбрать день" dayPickerProps={{
                            months: MONTHS,
                            weekdaysLong: WEEKDAYS_LONG,
                            weekdaysShort: WEEKDAYS_SHORT,
                            disabledDays: { after: new Date() }
                    }} />
                </div>
            </div>
            {orders.results.length > 0 ?
                <React.Fragment>
                    <Pagination style={{marginBottom: '2rem'}}
                        routeName='orders' pagesCount={orders.pagesCount} />
                    <div>
                        <Row><div>Номер и дата</div><div style={{display: 'grid', gridTemplateColumns: '1fr 8rem 8rem'}}><div>Заказ</div><div>Кол-во</div><div>Стоимость</div></div><div>Итого</div></Row>
                        {orders.results.map(order => <Order key={order.id} order={order} />)}
                    </div>
                    <Pagination style={{marginTop: '2rem'}}
                        routeName={taxonomy} pagesCount={orders.pagesCount} />
                </React.Fragment>
            : 'Заказов нет' }
        </div>
    )
}

export default Orders
