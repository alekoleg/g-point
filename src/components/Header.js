import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import Logo from '../components/Logo'
import { FoodIcon, PageLayoutSidebarRightIcon, CheckDecagramIcon } from '@icons/material'

const Nav = styled.nav`
    display: flex;
    margin-bottom: 5rem;
`

const Item = styled(NavLink)`
    display: flex;
    align-items: center;
    margin-left: 3rem;
    text-decoration: none;

    &:first-child {
        margin-left: 0;
    }

    &.active {
        color: var(--black);
    }

    > svg {
        margin-right: .7rem;
    }
`

export default () => (
    <Nav>
        <Item activeClassName="active" to="/" exact><Logo /></Item>
        <Item activeClassName="active" to="/products">
            <FoodIcon style={{marginTop: '-.4rem'}} />
            Продукты
        </Item>
        <Item activeClassName="active" to="/categories">
            <PageLayoutSidebarRightIcon />
            Автоматы
        </Item>
        <Item activeClassName="active" to="/orders">
            <CheckDecagramIcon />
            Заказы
        </Item>
    </Nav>
)
