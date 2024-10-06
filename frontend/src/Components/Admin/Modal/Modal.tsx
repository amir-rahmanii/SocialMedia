import { Dialog } from '@mui/material'
import React from 'react'
import { closeIcon } from '../../SvgIcon/SvgIcon'


type ModalProps = {
    title?: string,
    setisOpenModal: (value: boolean) => void,
    isOpenModal: boolean,
    submitHandler?: () => void,
    btnNoTitle?: string,
    btnYesTitle?: string,
    isAttention?: boolean,
    isYesOrNo: boolean,
    children?: React.ReactNode
}

function Modal({ isAttention,
    children,
    isYesOrNo,
    title,
    btnNoTitle,
    btnYesTitle,
    isOpenModal,
    setisOpenModal,
    submitHandler
}: ModalProps) {
    return (
        <Dialog maxWidth='xl' onClose={() => setisOpenModal(false)} open={isOpenModal}>
            <div className={`flex flex-col text-white h-auto bg-admin-navy overflow-y-auto w-screen max-w-[300px] md:max-w-xl`}>
                <div className='px-3 py-4 flex flex-col gap-2'>
                    {/* close icon */}
                    <div className='flex justify-end'>
                        <button onClick={() => setisOpenModal(false)} className='flex flex-col items-center text-admin-High'>
                            <div className='w-7 h-7'>
                                {closeIcon}
                            </div>
                            <p className='text-sm font-bold'>ESC</p>
                        </button>
                    </div>
                    {isYesOrNo ? (
                        <>
                            {/* img err */}
                            <div className='flex justify-center'>
                                <img className='w-14 h-14' src="/images/error.png" alt="err" />
                            </div>
                            {/* title */}
                            <div>
                                <p className='font-bold text-xl text-center text-admin-low'>{title}</p>
                            </div>

                            {isAttention && (
                                <div className='px-4 my-2'>
                                    <div className='flex items-center gap-1'>
                                        <p className='font-bold text-admin-low'>Attention</p>
                                        <img className='w-5 h-5' src="/images/error.png" alt="err" />
                                    </div>
                                    <p className='text-gray-400'>This operation is irreversible. The consequences of doing it are at your own risk.</p>
                                </div>
                            )}

                            <div className='flex justify-center items-center gap-3 mt-4'>
                                <button onClick={submitHandler} className='bg-error-red hover:bg-red-400 transition-all duration-300 py-2 px-10 rounded text-base text-white text-nowrap flex'>Yes {btnYesTitle && <span className='hidden md:block'> , {btnYesTitle}</span>}</button>
                                <button onClick={() => setisOpenModal(false)} className='border border-gray-300 bg-white hover:bg-admin-low transition-all duration-300 py-2 px-10 rounded text-base text-gray-700 text-nowrap flex'>Cancel {btnNoTitle && <span className='hidden md:block'>,{btnNoTitle}</span>}</button>
                            </div>
                        </>
                    ) : (
                        children
                    )}

                </div>
            </div>
        </Dialog>

    )
}

export default Modal