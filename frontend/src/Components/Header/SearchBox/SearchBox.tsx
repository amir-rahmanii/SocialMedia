import { ClickAwayListener } from '@mui/material'
import React, { useState } from 'react'
import { searchIcon } from '../../SvgIcon/SvgIcon'
import { useNavigate } from 'react-router-dom';

function SearchBox() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searching, setSearching] = useState(false);

    const handleClickAway = () => {
        setSearchTerm("");
        setSearching(false)
    }

    const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const navigate = useNavigate();

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <form onSubmit={e => e.preventDefault()} className="flex items-center justify-center gap-3 pl-4 w-80 py-2 bg-[#efefef] rounded-lg relative">
                <button className='w-5 h-5  text-black' onClick={() => {
                    if (searchTerm.trim()) {
                        navigate(`/search/${searchTerm}`)
                    }
                }}>
                    {!searching && searchIcon}
                </button>
                <input
                    value={searchTerm}
                    onChange={changeInputHandler}
                    className="bg-transparent border-none outline-none flex-1 py-3 pr-3"
                    type="search"
                    placeholder="Search Title"
                />
            </form>
        </ClickAwayListener>
    )
}

export default SearchBox