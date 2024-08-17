import React from 'react'
import { Link } from 'react-router-dom'
import Auth from '../../LayOut/Auth/Auth'
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import loginSchema from '../../Validation/login';
import { usePostUserLogin } from '../../hooks/user/useUser';
import IsLoaderBtn from '../../Components/IsLoaderBtn/IsLoaderBtn';
import toast from 'react-hot-toast';


function Login() {


    const { mutate: loginUser, isLoading, isError : isErrorLogin, error, isSuccess : isSuccessLogin } = usePostUserLogin();

    if (isErrorLogin) {
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

    if (isSuccessLogin) {
        toast.success("User login successfuly",
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




    // hook form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema)
    });


    return (
        <Auth>
            <div className="bg-white border flex flex-col gap-2 p-4 pt-10">
                <img draggable="false" className="mx-auto h-[120px] w-[220px] object-contain" src="/src/assets/images/Instagram.png" alt="instagram" />
                <form className="flex flex-col justify-center items-center gap-3 m-3 md:m-8">
                    <div className='w-full'>
                        <TextField
                            {...register('identity')}
                            label="Email/Username"
                            type="text"
                            required
                            size="small"
                            fullWidth
                        />
                        {errors.identity && <p className='text-error-red text-sm mt-1.5'> {errors.identity.message}</p>}
                    </div>
                    <div className='w-full'>
                        <TextField
                            {...register('password')}
                            label="Password"
                            type="password"
                            required
                            size="small"
                            fullWidth
                        />
                        {errors.password && <p className='text-error-red text-sm mt-1.5'> {errors.password.message}</p>}
                    </div>
                    <button onClick={handleSubmit((data) => {
                        loginUser(data)
                    })} disabled={isLoading} type="submit" className={`font-medium py-2 rounded text-white w-full  duration-300 transition-all ${isLoading ? "bg-primaryLoading-blue" : "bg-primary-blue hover:bg-primaryhover-blue"}`}>
                        {isLoading ? <IsLoaderBtn /> : "Log in"}
                    </button>
                    <span className="my-3 text-gray-500">OR</span>
                    <Link to="/password/forgot" className="text-sm font-medium text-blue-800">Forgot password?</Link>
                </form>
            </div>

            <div className="bg-white border p-5 text-center">
                <span>Don't have an account? <Link to="/register" className="text-primary-blue hover:text-primaryhover-blue transition-all duration-300">Sign up</Link></span>
            </div>
        </Auth>
    )
}


export default Login