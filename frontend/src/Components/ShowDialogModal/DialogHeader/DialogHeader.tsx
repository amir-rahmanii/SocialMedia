import React from 'react'
import { closeIcon } from '../../SvgIcon/SvgIcon'



type DialogHeaderModal = {
    setIsOpenShowModal: (value: boolean) => void,
    title: string
}

function DialogHeader({ setIsOpenShowModal, title } : DialogHeaderModal) {
    return (
        <div className="bg-white dark:bg-black py-3 border-b dark:border-gray-300/20 border-gray-300  px-4 flex justify-between w-full">
            <span className="font-sans text-black dark:text-white">{title}</span>
            <button className='w-6 h-6 text-black dark:text-white' onClick={() => setIsOpenShowModal(false)}>
                {closeIcon}
            </button>
        </div>
    )
}

export default DialogHeader