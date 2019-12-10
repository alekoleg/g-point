import styled from 'styled-components'

export default styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 2rem;
    padding: 2rem 0;
    align-items: center;

    &:not(:first-child) {
        border-top: .1rem solid var(--secondary);
        margin-top: -.1rem;
    }
`
