import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import newTicketSchema from '../../../Validation/newTicket';
import IsLoaderBtn from '../../IsLoaderBtn/IsLoaderBtn';
import { usePostNewTicket } from '../../../hooks/ticket/useTicket';
import { AuthContext } from '../../../Context/AuthContext';
import toast from 'react-hot-toast';

function AddTicket() {

    const [departement, setDepartement] = useState("Management");
    const [priority, setPriority] = useState("Medium");

    const handleDepartementChange = (e: SelectChangeEvent) => {
        setDepartement(e.target.value)
    }

    const handlePriorityChange = (e: SelectChangeEvent) => {
        setPriority(e.target.value)
    }


    const { mutate: addNewTicket, isLoading  , isSuccess , isError , error} = usePostNewTicket();
    const authContext = useContext(AuthContext);

    useEffect(() => {
        if (isError) {
            if (error && (error as any).response) {
                toast.error((error as any).response.data.error.message
                )
            }
        }

        if (isSuccess) {
            toast.success("ticket sent successfuly",
                
            )
            reset();
        }
    }, [isError, isSuccess])


    // hook form
    const {
        register,
        handleSubmit,
        reset, 
        formState: { errors },
    } = useForm({
        resolver: yupResolver(newTicketSchema)
    });



    return (
        <form onSubmit={e => e.preventDefault()} className='py-7 px-3 rounded flex flex-col gap-4'>
            <div className='w-full flex flex-col md:flex-row justify-between gap-4'>
                <div className='flex flex-col w-full'>
                    <TextField
                        {...register('title')}
                        label="title"
                        type="text"
                        name='title'
                        required
                        size="medium"
                        className=''
                        fullWidth
                    />
                    {errors.title && <p className='text-error-red text-sm mt-1.5'> {errors.title.message}</p>}
                </div>
                <FormControl fullWidth className=''>
                    <InputLabel id="demo-simple-select-label">department</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={departement}
                        label="department"
                        size="medium"
                        onChange={handleDepartementChange}
                    >
                        <MenuItem value={"Management"}>Management</MenuItem>
                        <MenuItem value={"Design"}>Design</MenuItem>
                        <MenuItem value={"HR"}>HR</MenuItem>
                        <MenuItem value={"Technical"}>Technical</MenuItem>
                        <MenuItem value={"Support"}>Support</MenuItem>
                        <MenuItem value={"Other"}>Other</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth className=''>
                    <InputLabel id="demo-simple-select-label">priority</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={priority}
                        label="priority"
                        size="medium"
                        onChange={handlePriorityChange}
                    >
                        <MenuItem value={"Low"}>Low</MenuItem>
                        <MenuItem value={"Medium"}>Medium</MenuItem>
                        <MenuItem value={"High"}>High</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className='flex flex-col w-full'>
                <TextField
                    {...register('description')}
                    label="description"
                    type="text"
                    name='description'
                    required
                    size="medium"
                    fullWidth
                />
                {errors.description && <p className='text-error-red text-sm mt-1.5'> {errors.description.message}</p>}
            </div>
            <div className="flex items-center justify-between">
                <button onClick={handleSubmit((data) => {
                
                if(authContext?.user?._id){
                    const newObj = {
                        department: departement,
                        description: data.description,
                        title: data.title,
                        userId: authContext?.user?._id,
                        priority: priority,
                    }
                    
                    addNewTicket(newObj)
                }else{
                    toast.error("you can't send ticket please try again 😩")
                }


                })} disabled={isLoading} type="submit" className={`font-medium py-2 rounded text-white w-full  duration-300 transition-all ${isLoading ? "bg-primaryLoading-blue" : "bg-primary-blue hover:bg-primaryhover-blue"}`}>
                    {isLoading ? <IsLoaderBtn /> : "Submit"}
                </button>
            </div>
        </form>
    )
}

export default AddTicket