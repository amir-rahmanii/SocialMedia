import { Dialog } from '@mui/material'
import React from 'react'
import { closeIcon } from '../SvgIcon/SvgIcon'

type ShowDialogModalProps = {
    isShowDialogModal: boolean,
    setisShowDialogModal: (value: boolean) => void,
    title: string,
    children: React.ReactNode
}

function ShowDialogModal({ isShowDialogModal, setisShowDialogModal, title, children }: ShowDialogModalProps) {
    return (
        <Dialog open={isShowDialogModal} onClose={() => setisShowDialogModal(false)} maxWidth='xl'>
            <div className='flex flex-col h-56 overflow-y-auto xl:w-screen max-w-xl'>
                <div className="bg-white dark:bg-black py-3 border-b dark:border-gray-300/20 border-gray-300 px-4 flex justify-between w-full">
                    <span className="font-medium text-black dark:text-white">{title}</span>
                    <button onClick={() => setisShowDialogModal(false)} className="font-medium w-5 h-5 text-black dark:text-white">{closeIcon}</button>
                </div>

                {children}
            </div>

        </Dialog>
    )
}

export default ShowDialogModal