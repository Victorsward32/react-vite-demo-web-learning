import React from 'react'
import '../../scss/components/_header.scss'

const Header = () => {
    return (
        <header data-component="header">
            <nav>
                <a href="/">Home</a>
                <a href="/about">About</a>
            </nav>
        </header>
    )
}

export default Header