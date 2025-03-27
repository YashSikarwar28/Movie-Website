import React from 'react'

const Search = ({searchterm,setsearchterm}) => {
  return (
    <div className='search'>
      <div>
        <img src="Search-Input.svg" alt="" />
        <input type="text" placeholder='Search you movie....' value={searchterm} onChange={(e)=>setsearchterm(e.target.value)} />
      </div>
    </div>
  )
}

export default Search
