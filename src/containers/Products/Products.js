import React, { useState, useEffect, useContext } from 'react'
import { Link, withRouter } from 'react-router-dom'
import Product from './ProductsItem'
import Pagination from '../../components/Pagination'
// import Filters from '../../components/Filters'
import { Search } from '../../components/Search'
import styled from 'styled-components'
import appContext from '../../store/Context'

const Header = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 2rem;
`

const Products = ({ history, match }) => {
    const store = useContext(appContext)
    const taxonomy = 'products'

    const [products, setProducts] = useState({
        results: []
    })

    useEffect(() => {
        (async () => {
            try {
                const qs = new URLSearchParams(history.location.search)

                const _limit = +qs.get('limit') || 20
                const limit = _limit > 0 && _limit <= 100 ? _limit : 20
                const page = match.params.page || 1
                const search = qs.get('search')

                const Product = store.api.Object.extend('Product')
                const Category = store.api.Object.extend('Category')

                const queries = [
                    new store.api.Query(Product)
                ]
                if (search) {
                    queries[0].equalTo('identifier', search)
                    queries[1] = new store.api.Query(Product)
                    queries[1].contains('identifier', search)
                    queries[2] = new store.api.Query(Product)
                    queries[2].contains('objectId', search)
                    queries[3] = new store.api.Query(Product)
                    queries[3].contains('objectId', search)
                    queries[4] = new store.api.Query(Product)
                    queries[4].matches('name', search, 'i')
                }

                const query = store.api.Query.or(...queries)
                query.limit(limit).skip((page-1)*limit).include(['name', 'category'])
                if (qs.get('category')) {
                    query.equalTo('category', new Category({id: qs.get('category')}))
                }
                query.descending('createdAt').withCount()

                const products = await query.find()
                setProducts({
                    ...products,
                    pagesCount: Math.ceil(products.count/limit)
                })
            } catch (e) {
                console.log(e)
            }
        })()
    }, [history.location.search, match.params.page, store.api])

    return (
        <div>
            <Header>
                <h1 style={{margin: 0}}>Продукты</h1>
                <Link className="button" to="/product/create">Создать</Link>
            </Header>
            <div style={{marginBottom: '4rem'}}>
                <Search taxonomy={taxonomy} />
            </div>
            <Pagination style={{marginBottom: '2rem'}}
                routeName='products' pagesCount={products.pagesCount} />
            <div>
                {products.results.map(product => <Product key={product.id} product={product} />)}
            </div>
            <Pagination style={{marginTop: '2rem'}}
                routeName='products' pagesCount={products.pagesCount} />
        </div>
    )
}

export default withRouter(Products)
