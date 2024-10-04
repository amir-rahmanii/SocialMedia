
import { Toaster } from 'react-hot-toast'

function Toast() {
    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }}
            />
        </>
    )
}

export default Toast