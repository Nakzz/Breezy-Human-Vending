import React from 'react'

import './search-box.styles.css'

export const SearchBox= ({placeholder, handleChange}) => (
    <input 
    className='search' 
 
    onChange={handleChange} 
    placeholder={placeholder}
    // value={searchField}
    >
    </input>
)