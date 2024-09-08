import React from 'react'
import SearchBox from '../Header/SearchBox/SearchBox'
import { Dialog } from '@mui/material'
import { closeIcon } from '../SvgIcon/SvgIcon'


type ShowSearchInputProps = {
    isShowSearch: boolean,
    setIsShowSearch: (value: boolean) => void
}

function ShowSearchInput({ setIsShowSearch, isShowSearch }: ShowSearchInputProps) {
    return (
        <Dialog open={isShowSearch} onClose={() => setIsShowSearch(false)} maxWidth='xl'>
            <div className="bg-white dark:bg-black py-3 border-b dark:border-gray-300/20 border-gray-300 px-4 flex justify-between w-full">
                <span className="font-medium text-black dark:text-white">Search title posts</span>
                <button onClick={() => setIsShowSearch(false)} className="font-medium w-5 h-5 text-black dark:text-white">{closeIcon}</button>
            </div>
            <div className="flex justify-center items-center min-w-60 border rounded dark:border-gray-300/20 border-gray-300">
                <SearchBox />
            </div>
        </Dialog>
    )
}

export default ShowSearchInput