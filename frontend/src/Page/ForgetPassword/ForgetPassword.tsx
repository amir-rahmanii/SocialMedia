import React, { useEffect } from 'react'
import Auth from '../../LayOut/Auth/Auth'
import { TextField } from '@mui/material'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import forgetPassSchema from '../../Validation/forgetPassword';
import IsLoaderBtn from '../../Components/IsLoaderBtn/IsLoaderBtn';
import { usePostUserForgetPassword } from '../../hooks/user/useUser';
import toast from 'react-hot-toast';

function ForgetPassword() {

    const { mutate: forgetPasswordUser, isLoading, isError, error, isSuccess } = usePostUserForgetPassword();


    useEffect(() => {
        if (isError) {
            if (error && (error as any).response) {
                toast.error((error as any).response.data.error.message,
                    {
                        icon: '❌',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                )
            }
        }

        if (isSuccess) {
            toast.success("Email sent successfuly",
                {
                    icon: '✅',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            )
        }
    }, [isError, isSuccess])

    // hook form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(forgetPassSchema)
    });
    return (
        <Auth>
            <div className="bg-white border flex flex-col gap-2 p-4 pt-10">
                <img draggable="false" className="mx-auto h-[120px] w-[220px] object-contain" src="/src/assets/images/Instagram.png" alt="instagram" />
                <form onSubmit={e => e.preventDefault()} className="flex flex-col justify-center items-center gap-3 m-3 md:m-8">
                    <div className='w-full'>
                        <TextField
                            {...register('email')}
                            fullWidth
                            label="Email"
                            type="email"
                            name="email"
                            required
                            size="small"
                        />
                        {errors.email && <p className='text-error-red text-sm mt-1.5'> {errors.email.message}</p>}
                    </div>
                    <button onClick={handleSubmit((data) => {
                        forgetPasswordUser(data)
                    })} disabled={isLoading} type="submit" className={`font-medium py-2 rounded text-white w-full  duration-300 transition-all ${isLoading ? "bg-primaryLoading-blue" : "bg-primary-blue hover:bg-primaryhover-blue"}`}>
                        {isLoading ? <IsLoaderBtn /> : "Submit"}
                    </button>
                </form>
            </div>

            <div className="bg-white border p-5 text-center">
                <span>Don't have an account? <Link to="/register" className="text-primary-blue hover:text-primaryhover-blue transition-all duration-300">Sign up</Link></span>
            </div>
        </Auth>
    )
}

export default ForgetPassword