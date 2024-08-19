import React, { useEffect, useState } from 'react'
import Auth from '../../LayOut/Auth/Auth'
import { Avatar, TextField } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import registerSchema from '../../Validation/register';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import IsLoaderBtn from '../../Components/IsLoaderBtn/IsLoaderBtn';
import { usePostUserRegister } from '../../hooks/user/useUser';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

function Register() {
    const navigate = useNavigate();
    // const [profileState, setProfileState] = useState({})
    const { mutate: registerUser, isLoading, isError, error, isSuccess } = usePostUserRegister();

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
            toast.success("User created successfuly",
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
        resolver: yupResolver(registerSchema)
    });

    // const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files) {
    //         setProfileState(e.target.files[0])
    //         console.log(e.target.files[0]);
    //     }
    // }

    return (
        <Auth>
            <div className="bg-white border flex flex-col gap-2 p-4 pt-10">
                <img draggable="false" className="mx-auto h-[120px] w-[220px] object-contain" src="/src/assets/images/Instagram.png" alt="instagram" />
                <form
                    onSubmit={e => e.preventDefault()}
                    encType="multipart/form-data"
                    className="flex flex-col justify-center items-center gap-3 m-3 md:m-8"
                >
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
                    <div className='w-full'>
                        <TextField
                            {...register('name')}
                            fullWidth
                            label="Full Name"
                            type='text'
                            name="name"
                            required
                            size="small"
                        />
                        {errors.name && <p className='text-error-red text-sm mt-1.5'> {errors.name.message}</p>}
                    </div>
                    <div className='w-full'>
                        <TextField
                            {...register('username')}
                            label="Username"
                            type="text"
                            name="username"
                            size="small"
                            required
                            fullWidth
                        />
                        {errors.username && <p className='text-error-red text-sm mt-1.5'> {errors.username.message}</p>}
                    </div>

                    <div className='w-full'>
                        <TextField
                            {...register('password')}
                            label="Password"
                            type="password"
                            name="password"
                            required
                            size="small"
                            fullWidth
                        />
                        {errors.password && <p className='text-error-red text-sm mt-1.5'> {errors.password.message}</p>}
                    </div>

                    <div className='w-full'>
                        <TextField
                            {...register('confirmPassword')}
                            label="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            required
                            size="small"
                            fullWidth
                        />
                        {errors.confirmPassword && <p className='text-error-red text-sm mt-1.5'> {errors.confirmPassword.message}</p>}
                    </div>


                    {/* <div className="flex w-full justify-between gap-3 items-center">
                        <Avatar
                            alt="Avatar Preview"
                            sx={{ width: 48, height: 48 }}
                        />
                        <label>
                            <input
                                {...register('confirmPassword')}
                                type="file"
                                accept="image/*"
                                name="avatar"
                                onChange={inputHandler}

                                className="block w-full text-sm text-gray-400
                                   file:mr-3 file:py-2 file:px-6
                                   file:rounded-full file:border-0
                                   file:text-sm file:cursor-pointer file:font-semibold
                                   file:bg-blue-100 file:text-blue-700
                                   hover:file:bg-blue-200
                        "/>
                        </label>
                    </div> */}

                    <button onClick={handleSubmit((data) => {
                        registerUser(data)
                    })} disabled={isLoading} type="submit" className={`font-medium py-2 rounded text-white w-full  duration-300 transition-all ${isLoading ? "bg-primaryLoading-blue" : "bg-primary-blue hover:bg-primaryhover-blue"}`}>
                        {isLoading ? <IsLoaderBtn /> : "Sign up"}
                    </button>
                    <span className="my-3 text-gray-500">OR</span>
                    <Link to="/forget-password" className="text-sm font-medium  text-blue-800">Forgot password?</Link>
                </form>
            </div>

            <div className="bg-white border p-5 text-center">
                <span>Already have an account? <Link to="/login" className="text-primary-blue hover:text-primaryhover-blue transition-all duration-300">Log in</Link></span>
            </div>


        </Auth>
    )
}

export default Register