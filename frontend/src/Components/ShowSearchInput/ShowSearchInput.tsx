import React from 'react'
import SearchBox from '../Header/SearchBox/SearchBox'
import { Dialog } from '@mui/material'
import { closeIcon } from '../SvgIcon/SvgIcon'
import DialogHeader from '../ShowDialogModal/DialogHeader/DialogHeader'



type ShowSearchInputProps = {
    isShowSearch: boolean,
    setIsShowSearch: (value: boolean) => void
}

function ShowSearchInput({ setIsShowSearch, isShowSearch }: ShowSearchInputProps) {
    return (
        <Dialog open={isShowSearch} onClose={() => setIsShowSearch(false)} maxWidth='xl'>
            <DialogHeader
                title="Search title posts"
                setIsOpenShowModal={setIsShowSearch}
            />
            <div className="flex justify-center items-center min-w-60 border rounded dark:border-gray-300/20 border-gray-300">
                <SearchBox />
            </div>
        </Dialog>
    )
}

export default ShowSearchInput