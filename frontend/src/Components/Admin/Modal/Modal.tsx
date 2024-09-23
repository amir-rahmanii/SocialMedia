import React from 'react'


type ModalProps = {
    title: string,
    setisOpenModal: (value: boolean) => void,
    submitHandler: () => void
}

function Modal({ title, setisOpenModal, submitHandler }: ModalProps) {
    return (
        <div className='px-3 py-4 flex flex-col gap-6'>
            <h2 className='text-xl'>{title} </h2>
            <div className='flex justify-center items-center gap-3'>
                <button onClick={submitHandler} className='bg-primary-blue hover:bg-primaryhover-blue transition-all duration-300 py-2 px-10 rounded text-base text-white'>Yes</button>
                <button onClick={() => setisOpenModal(false)} className='bg-error-red hover:bg-red-400 transition-all duration-300 py-2 px-10 rounded text-base text-white'>No</button>
            </div>
        </div>

    )
}

export default Modal