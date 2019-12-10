import React from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import PagesLimit from './PagesLimit'

const Pagination = styled.div`
    display: grid;
    grid-template-columns: 1fr 7rem;
    grid-gap: 2rem;
`

const Pages = styled.div`
    display: flex;
    margin-left: -1.5rem;
`

const Page = styled(Link)`
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 3.8rem;
    height: 3.8rem;
    margin: 0 0 0 1.5rem;
    border: .1rem solid var(--secondary);
    border-radius: .4rem;
    text-decoration: none;

    &.active {
        color: inherit;
        border: none;
    }
`

export default withRouter(({ routeName, history, match, pagesCount, style }) => {
    return (
        <Pagination style={style}>
            <Pages>
                {pagesCount > 1 ? (
                    [...Array(pagesCount).keys()].map(i => {
                        const pageCurrent = +match.params.page || 1
                        const pageNumber = i+1
                        if ((pageNumber === 1 || pageNumber === pagesCount || ((pageCurrent > 4 || pageCurrent <= pagesCount-4 ) && (pageNumber >= pageCurrent-3 && pageNumber <= pageCurrent+3)))
                            || (pageCurrent <= 4 &&  pageNumber <= 8) || pageNumber === pagesCount || (pageCurrent >= pagesCount-4 &&  pageNumber > pagesCount-8) || pageNumber === 1) {
                            const pathName = `/${routeName}${pageNumber > 1 ? `/${pageNumber}` : ''}`
                            const urn = pathName + history.location.search
                            return <Page key={i} to={urn} className={pageCurrent === pageNumber ? 'active' : ''}>{pageNumber}</Page>
                        }
                    })
                ) : null}
            </Pages>
            <PagesLimit routeName={routeName} history={history} />
        </Pagination>
    )
})
