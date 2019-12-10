import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import Category from './CategoriesItem'
import appContext from '../../store/Context'
import styled from 'styled-components'

const Header = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 2rem;
`

const Categories = () => {
    const store = useContext(appContext)
    const [categories, setCategories] = useState([])

    useEffect(() => {
        (async () => {
            try {
                const Category = store.api.Object.extend('Category')
                const q = new store.api.Query(Category)
                const categories = await q.limit(100).descending('createdAt').find()

                setCategories(categories)
            } catch (e) {
                console.log(e)
            }
        })()
    }, [store.api])

    return (
        <div>
            <Header>
                <h1 style={{margin: 0}}>Автоматы</h1>
                <Link className="button" to="/category/create">Создать</Link>
            </Header>
            <div>
                {categories.map(category => <Category key={category.id} category={category} />)}
            </div>
        </div>
    )
}

export default Categories
