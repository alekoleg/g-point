import styled from 'styled-components'

export default styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: var(--offset);
    padding: 2rem;
    color: var(--white);
    border-radius: var(--border-radius);
    background: var(--secondary);
    cursor: pointer;

    > div {
        flex: 1;
    }
    
    > svg {
        flex: 0 0 auto;
    }
`
