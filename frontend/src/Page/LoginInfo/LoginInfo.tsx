import React, { useState } from 'react'
import MetaData from '../../Components/MetaData/MetaData'
import Header from '../../Parts/Header/Header'
import SideBarLeft from '../../Parts/SideBarLeft/SideBarLeft'
import SideBarBottom from '../../Parts/SideBarBottom/SideBarBottom'
import TableLogin from '../../Components/User/TableLogin/TableLogin'
import { useGetUserInformation } from '../../hooks/user/useUser'
import SpinLoader from '../../Components/SpinLoader/SpinLoader'
import { Button } from '@mui/material'
import FilterDate from '../../Components/FilterDate/FilterDate'
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

// Enable the 'isBetween' plugin for dayjs
dayjs.extend(isBetween);

function LoginInfo() {

    const { data: myInformationData, isLoading: isLoadingMyInformationData } = useGetUserInformation();

    const [isShowOpenFilter, setIsShowOpenFilter] = useState(false);


    // State to hold the filtered data
    const [filteredData, setFilteredData] = useState<
    { os: string; browser: string; country: string; ip: string; date: Date; _id: string; }[] | null
  >(null);


    const [fromPicker, setFromPicker] = useState('')
    const [untilPicker, setUntilPicker] = useState('')


    const filterDateHandler = () => {
        if (fromPicker && untilPicker) {
            // Convert fromPicker and untilPicker to Dayjs objects
            const fromDate = dayjs(fromPicker);
            const untilDate = dayjs(untilPicker);

            // Filter systemInfos based on the date range
            const filteredSystemInfos = myInformationData?.response.user.systemInfos.filter(info => {
                const infoDate = dayjs(info.date);
                return infoDate.isBetween(fromDate, untilDate, null, '[]'); // Include the boundaries
            });

            // Set the filtered data to the state
            setFilteredData(filteredSystemInfos || []); 

            // Close the filter dialog
            setIsShowOpenFilter(false);
        }
    };

    return (
        <>
            <MetaData title="login-info" />
            <Header />
            <div>
                {isLoadingMyInformationData ? (
                    <SpinLoader />
                ) : (
                    <div className='w-full md:w-4/6 md:ml-44 mt-14 lg:ml-60 xl:ml-72'>
                        <h3 className='text-2xl text-center my-7 font-medium text-black dark:text-white'>User Login info</h3>
                        <div className='mb-3 px-3'>
                            <Button onClick={() => setIsShowOpenFilter(true)} variant="outlined">Filter</Button>
                        </div>
                        <TableLogin loginInformation={filteredData || myInformationData?.response.user.systemInfos} />
                    </div>
                )}
            </div>
            <FilterDate
                filterDateHandler={filterDateHandler}
                fromPicker={fromPicker}
                setFromPicker={setFromPicker}
                untilPicker={untilPicker}
                setUntilPicker={setUntilPicker}
                isShowOpenFilter={isShowOpenFilter}
                setIsShowOpenFilter={setIsShowOpenFilter} />
            <SideBarLeft />
            <SideBarBottom />
        </>
    )
}

export default LoginInfo