import { ClickAwayListener, TextField } from '@mui/material'
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
            <form onSubmit={e => e.preventDefault()} className="flex flex-col md:flex-row items-center gap-5 px-3 w-full py-2 rounded-lg relative">

                <TextField
                    value={searchTerm}
                    onChange={changeInputHandler}
                    className=""
                    label="Search"
                    name='Search'
                    size="medium"
                    fullWidth
                    type="search"
                    placeholder="Search Title"
                />
                <button className='flex bg-primary-blue hover:bg-primaryhover-blue font-sans py-2 rounded text-white w-full md:w-fit px-2 duration-300 transition-all items-center gap-1 justify-center' onClick={() => {
                    if (searchTerm.trim()) {
                        navigate(`/search/${searchTerm}`)
                    }
                }}>
                    <div className='w-5 h-5'>
                    {!searching && searchIcon}
                    </div>
                    Search
                </button>
            </form>
        </ClickAwayListener>
    )
}

export default SearchBox