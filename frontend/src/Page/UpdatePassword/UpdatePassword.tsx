import React, { useContext, useEffect } from 'react'
import Auth from '../../LayOut/Auth/Auth'
import { TextField } from '@mui/material'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import updatePassSchema from '../../Validation/updatePassword';
import toast from 'react-hot-toast';
import { usePostUserInformation, usePostUserUpdatePassword } from '../../hooks/user/useUser';
import IsLoaderBtn from '../../Components/IsLoaderBtn/IsLoaderBtn';
import { AuthContext } from '../../../Context/AuthContext';

function UpdatePassword() {
    const { mutate: updatePass, isLoading, isError, error, isSuccess } = usePostUserUpdatePassword();
    const { mutate: informationUser, data, isSuccess: isSuccessUserInformation } = usePostUserInformation();

    const authContext = useContext(AuthContext);


    useEffect(() => {
        const userid = localStorage.getItem("userId")
        if (userid) {
            informationUser({ userid })
        }
    }, [])

    useEffect(() => {
        if (isSuccess && data) {
            authContext?.setUser(data?.data.response.user)
        }
    }, [isSuccessUserInformation, data])


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
            // navigate("/login")
        }
    }, [isError, isSuccess])

    // hook form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(updatePassSchema)
    });


    return (
        <Auth>
            <div className="bg-white border flex flex-col gap-2 p-4 pt-10 mt-16">
                <img draggable="false" className="mx-auto h-[120px] w-[220px] object-contain" src="/src/assets/images/Instagram.png" alt="instagram" />
                <form onSubmit={e => e.preventDefault()} className="flex flex-col justify-center items-center gap-3 m-3 md:m-8">
                    <div className='w-full'>
                        <TextField
                            {...register('pervPassword')}
                            fullWidth
                            size="small"
                            label="Perv Password"
                            type="password"
                            name="pervPassword"
                            required
                        />
                        {errors.pervPassword && <p className='text-error-red text-sm mt-1.5'> {errors.pervPassword.message}</p>}
                    </div>
                    <div className='w-full'>
                        <TextField
                            {...register('newPassword')}
                            fullWidth
                            size="small"
                            label="New Password"
                            type="password"
                            name="newPassword"
                            required
                        />
                        {errors.newPassword && <p className='text-error-red text-sm mt-1.5'> {errors.newPassword.message}</p>}
                    </div>
                    <div className='w-full'>
                        <TextField
                            {...register('newConfrimPassword')}
                            fullWidth
                            size="small"
                            label="New ConfrimPassword"
                            type="password"
                            name="newConfrimPassword"
                            required
                        />
                        {errors.newConfrimPassword && <p className='text-error-red text-sm mt-1.5'> {errors.newConfrimPassword.message}</p>}
                    </div>
                    <button onClick={handleSubmit((data) => {
                        if (data.newPassword === data.newConfrimPassword) {
                            updatePass({
                                pervPassword :  data.pervPassword,
                                newPassword :  data.newPassword,
                                newConfrimPassword :  data.newConfrimPassword,
                            })
                        } else {
                            toast.error("NewPassword and NewpasswordConfirm are not the same.",
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
                    })} disabled={isLoading} type="submit" className={`font-medium py-2 rounded text-white w-full  duration-300 transition-all ${isLoading ? "bg-primaryLoading-blue" : "bg-primary-blue hover:bg-primaryhover-blue"}`}>
                        {isLoading ? <IsLoaderBtn /> : "Submit"}
                    </button>
                    <span className="my-3 text-gray-700">OR</span>
                    <Link to="/profile" className="text-sm font-medium text-blue-800">Back to Profile Page</Link>
                </form>
            </div>
        </Auth >
    )
}

export default UpdatePassword