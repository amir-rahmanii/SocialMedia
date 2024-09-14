import React, { useContext, useEffect, useState } from 'react'
import MetaData from '../../Components/MetaData/MetaData'
import Header from '../../Parts/Header/Header'
import SideBarLeft from '../../Parts/SideBarLeft/SideBarLeft'
import SideBarBottom from '../../Parts/SideBarBottom/SideBarBottom'
import TableLogin from '../../Components/User/TableLogin/TableLogin'
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup } from '@mui/material'
import FilterDate from '../../Components/FilterDate/FilterDate'
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import toast from 'react-hot-toast'
import { androidIcon, iosIcon, linuxIcon, windowsIcon } from '../../Components/SvgIcon/SvgIcon'
import AddTicket from '../../Components/User/AddTicket/AddTicket'
import { AuthContext } from '../../Context/AuthContext'
import TableTicket from '../../Components/User/TableTicket/TableTicket'
import { useGetUserTicket } from '../../hooks/ticket/useTicket'

// Enable the 'isBetween' plugin for dayjs
dayjs.extend(isBetween);

type InfoSystem = {
    os: string;
    browser: string;
    country: string;
    ip: string;
    date: Date;
    _id: string;
}[]

function Tickets() {

    const [isShowOpenFilter, setIsShowOpenFilter] = useState(false);
    // State to hold the filtered data
    const [filteredData, setFilteredData] = useState<InfoSystem | null>(null);
    const [fromPicker, setFromPicker] = useState('')
    const [untilPicker, setUntilPicker] = useState('')
    const [orderSystemInfo, setOrderSystemInfo] = useState<"NTO" | "OTN">("NTO")
    const authContext = useContext(AuthContext);

    const {data : allTicket , isError , isSuccess , error} = useGetUserTicket()

    
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
    }, [isError])


    // const filterDateHandler = () => {
    //     if (!fromPicker || !untilPicker) {
    //         toast.error("Please fill in both start and end dates.");
    //         return;
    //     }

    //     if (allBrowser.length === 0) {
    //         toast.error("You must select at least one browser.");
    //         return;
    //     }

    //     if (allOs.length === 0) {
    //         toast.error("You must select at least one os.");
    //         return;
    //     }

    //     // تبدیل fromPicker و untilPicker به شیء Dayjs
    //     const fromDate = dayjs(fromPicker);
    //     const untilDate = dayjs(untilPicker).endOf('day');

    //     // فیلتر کردن systemInfos بر اساس بازه زمانی و مرورگر
    //     const filteredSystemInfos = authContext?.user?.systemInfos.filter(info => {
    //         const isMainOsIncluded = allOs.includes(info.os);
    //         const isOtherOs = allOs.includes("Other") && !mainOs.includes(info.os);
    //         const isMainBrowserIncluded = allBrowser.includes(info.browser); // چک کردن مرورگرهای اصلی
    //         const isOtherBrowser = allBrowser.includes("Other") && !mainBrowsers.includes(info.browser); // چک کردن مرورگرهای غیر اصلی
    //         const infoDate = dayjs(info.date);
    //         const isDateInRange = infoDate.isBetween(fromDate, untilDate, null, '[]'); // چک کردن تاریخ

    //         // فیلتر مرورگر و تاریخ
    //         return ((isMainOsIncluded || isOtherOs) && (isMainBrowserIncluded || isOtherBrowser)) && isDateInRange;
    //     });

    //     // ذخیره داده‌های فیلتر شده
    //     {
    //         orderSystemInfo === "OTN" ?
    //             setFilteredData(filteredSystemInfos?.reverse() || [])
    //             : setFilteredData(filteredSystemInfos || [])
    //     }

    //     // بستن دیالوگ فیلتر
    //     setIsShowOpenFilter(false);
    // };




    return (
        <>
            <MetaData title="login-info" />
            <Header />
            <div>

                <div className='w-full md:w-4/6 md:ml-44 mt-14 lg:ml-60 xl:ml-72'>
                    <h3 className='text-2xl text-center my-7 font-medium text-black dark:text-white'>Add New Ticket</h3>
                    <AddTicket />
                    <div className='mb-3 px-3'>
                        <Button onClick={() => setIsShowOpenFilter(true)} variant="outlined">Filter</Button>
                    </div>
                    <TableTicket allTicketUser={allTicket} />
                </div>

            </div>
            {/* <FilterDate
                filterDateHandler={filterDateHandler}
                fromPicker={fromPicker}
                setFromPicker={setFromPicker}
                untilPicker={untilPicker}
                setUntilPicker={setUntilPicker}
                isShowOpenFilter={isShowOpenFilter}
                setIsShowOpenFilter={setIsShowOpenFilter}>

            </FilterDate> */}


            <SideBarLeft />
            <SideBarBottom />
        </>
    )
}

export default Tickets