import React, { useEffect } from 'react'
import Auth from '../../LayOut/Auth/Auth'
import { TextField } from '@mui/material'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import resetPassSchema from '../../Validation/resetPassword';
import { usePostUserResetPassword } from '../../hooks/user/useUser';
import toast from 'react-hot-toast';
import IsLoaderBtn from '../../Components/IsLoaderBtn/IsLoaderBtn';

function ResetPassword() {

    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    let navigate = useNavigate()

    const { mutate: resetPassword, isLoading, isError, error, isSuccess } = usePostUserResetPassword();


    useEffect(() => {
        if (isError) {
            if (error && (error as any).response) {
                toast.error("token (otp) not valid or expierd",
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
            toast.success("password change successfuly",
                {
                    icon: '✅',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            )
            navigate("/login")
        }
    }, [isError, isSuccess])

    // hook form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(resetPassSchema)
    });


    return (
        <>
        {token ? (
        <Auth>
            <div className="bg-white border flex flex-col gap-2 p-4 pt-10">
                <img draggable="false" className="mx-auto h-[120px] w-[220px] object-contain" src="/src/assets/images/Instagram.png" alt="instagram" />
                <form onSubmit={e => e.preventDefault()} className="flex flex-col justify-center items-center gap-3 m-3 md:m-8">
                    <div className='w-full'>
                        <TextField
                            {...register('password')}
                            fullWidth
                            size="small"
                            label="New Password"
                            type="password"
                            name="password"
                            required
                        />
                        {errors.password && <p className='text-error-red text-sm mt-1.5'> {errors.password.message}</p>}
                    </div>
                    <button onClick={handleSubmit((data) => {
                            resetPassword({token : token , new_password : data.password})
                    })} disabled={isLoading} type="submit" className={`font-medium py-2 rounded text-white w-full  duration-300 transition-all ${isLoading ? "bg-primaryLoading-blue" : "bg-primary-blue hover:bg-primaryhover-blue"}`}>
                        {isLoading ? <IsLoaderBtn /> : "Submit"}
                    </button>
                    <span className="my-3 text-gray-700">OR</span>
                    <Link to="/forget-password" className="text-sm font-medium text-blue-800">Forgot password?</Link>
                </form>
            </div>

            <div className="bg-white border p-5 text-center">
                <span>Already have an account? <Link to="/login" className="text-primary-blue hover:text-primaryhover-blue transition-all duration-300">Log in</Link></span>
            </div>
        </Auth>
        ) : (
            <Navigate to='/forget-password' />
        )}
        </>
    )
}

export default ResetPassword