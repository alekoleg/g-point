import React from 'react'
import { Switch, Route } from "react-router-dom"

import Categories from '../containers/Categories'
import Category from '../containers/Category'
import Products from '../containers/Products'
import Product from '../containers/Product'
import Orders from '../containers/Orders'

export default props => {
    return (
        <Switch>
            <Route path="/products/:page?" exact>
                <Products {...props} />
            </Route>
            <Route path="/product/:id" exact>
                <Product {...props} />
            </Route>

            <Route path="/categories" exact
                render={routeProps => <Categories {...props} {...routeProps} />} />
            <Route path="/category/:id" exact>
                <Category {...props} />
            </Route>

            <Route path="/orders/:page?" exact>
                <Orders {...props} />
            </Route>

            <Route path="/:page?" exact>
                <Products {...props} />
            </Route>
        </Switch>
    )
}
