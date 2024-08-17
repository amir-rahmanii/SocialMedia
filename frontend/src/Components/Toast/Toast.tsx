import React from 'react'
import { Toaster } from 'react-hot-toast'

function Toast() {
    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </>
    )
}

export default Toast