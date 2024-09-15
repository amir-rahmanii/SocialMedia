import React, { useContext, useEffect, useState } from 'react'
import MetaData from '../../Components/MetaData/MetaData'
import Header from '../../Parts/Header/Header'
import SideBarLeft from '../../Parts/SideBarLeft/SideBarLeft'
import SideBarBottom from '../../Parts/SideBarBottom/SideBarBottom'
import TableLogin from '../../Components/User/TableLogin/TableLogin'
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup } from '@mui/material'
import FilterDate from '../../Components/FilterDate/FilterDate'
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import toast from 'react-hot-toast'
import { androidIcon, windowsIcon } from '../../Components/SvgIcon/SvgIcon'
import { useGetMyUsersInfo } from '../../hooks/user/useUser'
import SkeletonTable from '../../Components/SkeletonTable/SkeletonTable'

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

function LoginInfo() {

    const { data: myInfo, isLoading  } = useGetMyUsersInfo();



    const [isShowOpenFilter, setIsShowOpenFilter] = useState(false);
    // State to hold the filtered data
    const [filteredData, setFilteredData] = useState<InfoSystem | null>(null);
    const [allBrowser, setAllBrowser] = useState<string[]>(["Chrome", "Firefox", "Safari", "Opera", "Edge", "Other"])
    const [allOs, setAllOs] = useState<string[]>(["Windows", "Android", "Other"])
    const [fromPicker, setFromPicker] = useState<Dayjs | null>(null);
    const [untilPicker, setUntilPicker] = useState<Dayjs | null>(null);
    const [orderSystemInfo, setOrderSystemInfo] = useState<"NTO" | "OTN">("NTO")
    const mainBrowsers = ["Chrome", "Firefox", "Safari", "Opera", "Edge"];
    const mainOs = ["Windows", "Android"];





    const filterDateHandler = () => {
        // if (!fromPicker || !untilPicker) {
        //     toast.error("Please fill in both start and end dates.");
        //     return;
        // }

        if (allBrowser.length === 0) {
            toast.error("You must select at least one browser.");
            return;
        }

        if (allOs.length === 0) {
            toast.error("You must select at least one os.");
            return;
        }

        // تبدیل fromPicker و untilPicker به شیء Dayjs
        const fromDate = dayjs(fromPicker).startOf('day');
        const untilDate = dayjs(untilPicker).endOf('day');

        // فیلتر کردن systemInfos بر اساس بازه زمانی و مرورگر
        const filteredSystemInfos = myInfo?.systemInfos.filter(info => {
            const isMainOsIncluded = allOs.includes(info.os);
            const isOtherOs = allOs.includes("Other") && !mainOs.includes(info.os);
            const isMainBrowserIncluded = allBrowser.includes(info.browser); // چک کردن مرورگرهای اصلی
            const isOtherBrowser = allBrowser.includes("Other") && !mainBrowsers.includes(info.browser); // چک کردن مرورگرهای غیر اصلی
            const infoDate = dayjs(info.date);
            const isDateInRange = infoDate.isBetween(fromDate, untilDate, null, '[]'); // چک کردن تاریخ

            // فیلتر مرورگر و تاریخ
            return ((isMainOsIncluded || isOtherOs) && (isMainBrowserIncluded || isOtherBrowser)) && isDateInRange;
        });

        // ذخیره داده‌های فیلتر شده
        {
            orderSystemInfo === "OTN" ?
                setFilteredData(filteredSystemInfos?.reverse() || [])
                : setFilteredData(filteredSystemInfos || [])
        }

        // بستن دیالوگ فیلتر
        setIsShowOpenFilter(false);
    };


    const changeHandlerBrowser = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newAllBrowser = [...allBrowser]
        if (newAllBrowser.includes(e.target.value)) {
            let newAllBrowserFilters = newAllBrowser.filter(browser => browser.toLowerCase() !== e.target.value.toLowerCase())
            setAllBrowser(newAllBrowserFilters)
        } else {
            setAllBrowser(prev => [...prev, e.target.value])
        }
    }


    const changeHandlerOs = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newAllOs = [...allOs]
        if (newAllOs.includes(e.target.value)) {
            let newAllOsFilters = newAllOs.filter(os => os.toLowerCase() !== e.target.value.toLowerCase())
            setAllOs(newAllOsFilters)
        } else {
            setAllOs(prev => [...prev, e.target.value])
        }
    }



    return (
        <>
            <MetaData title="login-info" />
            <Header />
            <div>
                <div className='w-full md:w-4/6 md:ml-44 mt-16 lg:ml-60 xl:ml-72 mb-5'>
                    <h3 className='text-2xl text-center my-7 font-medium text-black dark:text-white'>User Login info</h3>
                    <div className='mb-3 px-3'>
                        <Button onClick={() => setIsShowOpenFilter(true)} variant="outlined">Filter</Button>
                    </div>
                    {isLoading ? (
                        <SkeletonTable />
                    ) : (
                        <div className='px-3'>
                            <TableLogin loginInformation={filteredData || myInfo?.systemInfos} />
                        </div>
                    )}
                </div>
            </div>
            <FilterDate
                title="Filter Login Info"
                filterDateHandler={filterDateHandler}
                fromPicker={fromPicker}
                setFromPicker={setFromPicker}
                untilPicker={untilPicker}
                setUntilPicker={setUntilPicker}
                isShowOpenFilter={isShowOpenFilter}
                setIsShowOpenFilter={setIsShowOpenFilter}>

                <div className='flex flex-col gap-1'>
                    <FormLabel className='font-medium text-base'>Browser</FormLabel>
                    <FormGroup>
                        <div className='flex flex-wrap gap-3'>
                            <FormControlLabel
                                label={<img loading='lazy' src="/src/assets/images/browser/chrome.png" alt="Chrome" width={24} height={24} />}
                                control={<Checkbox
                                    value='Chrome'
                                    checked={allBrowser.some(data => data === "Chrome")}
                                    onChange={changeHandlerBrowser}
                                />}
                            />
                            <FormControlLabel
                                label={<img loading='lazy' src="/src/assets/images/browser/firefox.png" alt="FireFox" width={24} height={24} />}
                                control={<Checkbox
                                    value='Firefox'
                                    checked={allBrowser.some(data => data === "Firefox")}
                                    onChange={changeHandlerBrowser}
                                />}
                            />
                            <FormControlLabel
                                label={<img loading='lazy' src="/src/assets/images/browser/opera.jpg" alt="Opera" width={24} height={24} />}
                                control={<Checkbox
                                    value='Opera'
                                    checked={allBrowser.some(data => data === "Opera")}
                                    onChange={changeHandlerBrowser}
                                />}
                            />
                            <FormControlLabel
                                label={<img loading='lazy' src="/src/assets/images/browser/safari.png" alt="Safari" width={24} height={24} />}
                                control={<Checkbox
                                    value='Safari'
                                    checked={allBrowser.some(data => data === "Safari")}
                                    onChange={changeHandlerBrowser}
                                />}
                            />
                            <FormControlLabel
                                label={<img loading='lazy' src="/src/assets/images/browser/edge.png" alt="Edge" width={24} height={24} />}
                                control={<Checkbox
                                    value='Edge'
                                    checked={allBrowser.some(data => data === "Edge")}
                                    onChange={changeHandlerBrowser}
                                />}
                            />
                            <FormControlLabel
                                label='Other'
                                control={<Checkbox
                                    onChange={changeHandlerBrowser}
                                    checked={allBrowser.some(data => data === "Other")}
                                    value='Other'
                                />}
                            />
                        </div>
                    </FormGroup>
                </div>


                <div className='flex flex-col gap-1'>
                    <FormLabel className='font-medium text-base'>OS</FormLabel>
                    <FormGroup>
                        <div className='flex flex-wrap gap-3'>
                            <FormControlLabel
                                label={<div className='w-6 h-6'>{windowsIcon}</div>}
                                control={<Checkbox
                                    value='Windows'
                                    checked={allOs.some(data => data === "Windows")}
                                    onChange={changeHandlerOs}
                                />}
                            />
                            <FormControlLabel
                                label={<div className='w-6 h-6'>{androidIcon}</div>}
                                control={<Checkbox
                                    value='Android'
                                    checked={allOs.some(data => data === "Android")}
                                    onChange={changeHandlerOs}
                                />}
                            />
                            <FormControlLabel
                                label={<div className='w-6 h-6'>Other</div>}
                                control={<Checkbox
                                    value='Other'
                                    checked={allOs.some(data => data === "Other")}
                                    onChange={changeHandlerOs}
                                />}
                            />

                        </div>
                    </FormGroup>
                </div>

                <div>
                    <FormControl>
                        <FormLabel id="demo-controlled-radio-buttons-group">Order By</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={orderSystemInfo}
                            onChange={(e) => setOrderSystemInfo(e.target.value as "NTO" | "OTN")}
                            style={{ display: 'flex', flexDirection: 'row' }} // اعمال flex
                        >
                            <FormControlLabel value="NTO" control={<Radio />} label="New to Old" />
                            <FormControlLabel value="OTN" control={<Radio />} label="Old to New" />
                        </RadioGroup>
                    </FormControl>
                </div>
            </FilterDate>


            <SideBarLeft />
            <SideBarBottom />
        </>
    )
}

export default LoginInfo