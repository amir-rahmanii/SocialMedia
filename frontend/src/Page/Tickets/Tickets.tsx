import React, {  useEffect, useState } from 'react'
import MetaData from '../../Components/MetaData/MetaData'
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup } from '@mui/material'
import FilterDate from '../../Components/FilterDate/FilterDate'
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import toast from 'react-hot-toast'
import AddTicket from '../../Components/User/AddTicket/AddTicket'
import TableTicket from '../../Components/User/TableTicket/TableTicket'
import { ticketUser } from '../../hooks/ticket/tickets.types'
import SkeletonTable from '../../Components/SkeletonTable/SkeletonTable'
import ShowDialogModal from '../../Components/ShowDialogModal/ShowDialogModal'
import useGetData from '../../hooks/useGetData'
import SideBarLeft from '../../Parts/User/SideBarLeft/SideBarLeft'
import Header from '../../Parts/User/Header/Header'
import SideBarBottom from '../../Parts/User/SideBarBottom/SideBarBottom'

// Enable the 'isBetween' plugin for dayjs
dayjs.extend(isBetween);

type ticketFilterLocalStorage = {
    status: string[],
    priority: string[],
    order: "OTN" | "NTO",
    fromDate: Dayjs,
    untilDate: Dayjs
}



function Tickets() {




    const [ticketFilterLocalStorage, setTicketFilterLocalStorage] = useState<ticketFilterLocalStorage | null>(
        localStorage.getItem("ticketFilter")
            ? JSON.parse(localStorage.getItem("ticketFilter") as string)
            : null
    )



    const [isShowOpenFilter, setIsShowOpenFilter] = useState(false);
    // State to hold the filtered data
    const [filteredData, setFilteredData] = useState<ticketUser[] | null>(null);;
    const [fromPicker, setFromPicker] = useState<Dayjs | null>(
        dayjs(ticketFilterLocalStorage?.fromDate) || null
    );
    const [untilPicker, setUntilPicker] = useState<Dayjs | null>(
        dayjs(ticketFilterLocalStorage?.untilDate) || null
    );
    const [orderTicket, setOrderTicket] = useState<"NTO" | "OTN">(
        ticketFilterLocalStorage?.order || "NTO"
    );
    const [allPriority, setAllPriority] = useState<string[]>(
        ticketFilterLocalStorage?.priority || ["Low", "Medium", "High"]
    );
    const [allStatus, setAllStatus] = useState<string[]>(
        ticketFilterLocalStorage?.status || ["Open", "Closed", "Answered"]
    );

    const { data: allTicket, isLoading, isSuccess } = useGetData<ticketUser[]>(
        ['getUserTicket'],
        "ticket/user-tickets"
    )


  

    useEffect(() => {
        if (ticketFilterLocalStorage) {
            filterDateHandler();
        }
    }, [allTicket, ticketFilterLocalStorage])


    const filterDateHandler = () => {

        if (allPriority.length === 0) {
            toast.error("You must select at least one Priority.");
            return;
        }


        // تبدیل fromPicker و untilPicker به شیء Dayjs
        const fromDate = dayjs(fromPicker).startOf('day');
        const untilDate = dayjs(untilPicker).endOf('day');

        //save in localStorage
        localStorage.setItem("ticketFilter", JSON.stringify({
            status: allStatus,
            priority: allPriority,
            order: orderTicket,
            fromDate,
            untilDate
        }))

        const filteredTickets = allTicket?.filter(info => {
            const includedPriority = allPriority.includes(info.priority)
            const includedStatus = allStatus.includes(info.status)
            const infoDate = dayjs(info.createdAt);
            const isDateInRange = infoDate.isBetween(fromDate, untilDate, null, '[]'); // چک کردن تاریخ
            return (includedPriority && includedStatus) && isDateInRange;
        });

        {
            orderTicket === "NTO" ?
                setFilteredData(filteredTickets || [])
                : setFilteredData(filteredTickets?.reverse()  || [])
        }

        // close filter
        setIsShowOpenFilter(false);
    };



    const changeHandlerPriority = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newAllPriority = [...allPriority]
        if (newAllPriority.includes(e.target.value)) {
            let newAllPriorityFilters = newAllPriority.filter(priority => priority.toLowerCase() !== e.target.value.toLowerCase())
            setAllPriority(newAllPriorityFilters)
        } else {
            setAllPriority(prev => [...prev, e.target.value])
        }
    }

    const changeHandlerStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newAllStatus = [...allStatus]
        if (newAllStatus.includes(e.target.value)) {
            let newAllStatusFilters = newAllStatus.filter(status => status.toLowerCase() !== e.target.value.toLowerCase())
            setAllStatus(newAllStatusFilters)
        } else {
            setAllStatus(prev => [...prev, e.target.value])
        }
    }



    return (
        <>
            <MetaData title="login-info" />
            <Header />
            <div>

                <div className='w-full mt-14 xl:mr-32 md:w-4/6 mx-auto mb-5'>
                    <h3 className='text-2xl text-center my-7 font-sans text-black dark:text-white'>Add New Ticket</h3>
                    <AddTicket />

                    {isSuccess && allTicket?.length > 0 && (
                        <div className='mb-3 px-3 flex items-center gap-3'>
                            <Button onClick={() => setIsShowOpenFilter(true)} variant="outlined">Filter</Button>
                            <Button
                                onClick={() => {
                                    setFromPicker(null)
                                    setUntilPicker(null)
                                    setOrderTicket("NTO")
                                    setAllPriority(["Low", "Medium", "High"])
                                    setAllStatus(["Open", "Closed", "Answered"])
                                    localStorage.removeItem("ticketFilter")
                                    setFilteredData(allTicket)
                                }
                                }
                                variant="outlined"
                                sx={{ borderColor: '#c6415ed8', color: '#c6415ed8', '&:hover': { borderColor: '#f8587bf5', color: '#f8587bf5' } }}
                            >
                                Reset Filter
                            </Button>
                        </div>
                    )}
                    {isLoading ? (
                        <SkeletonTable />
                    ) : (
                        isSuccess && (
                            <div className='px-3'>
                                <TableTicket allTicketUser={filteredData || allTicket} />
                            </div>
                        )
                    )}
                </div>

            </div>
            <ShowDialogModal
                isOpenShowLDialogModal={isShowOpenFilter}
                setisOpenShowLDialogModal={setIsShowOpenFilter}
                title="Filter Tickets"
                height='h-90'
            >
                <FilterDate
                    filterDateHandler={filterDateHandler}
                    fromPicker={fromPicker}
                    setFromPicker={setFromPicker}
                    untilPicker={untilPicker}
                    setUntilPicker={setUntilPicker}
                >
                    <div className='flex flex-col gap-1'>
                        <FormLabel className='font-sans text-base'>Priority</FormLabel>
                        <FormGroup>
                            <div className='flex flex-wrap gap-3'>
                                <FormControlLabel
                                    label="Low"
                                    control={<Checkbox
                                        value='Low'
                                        checked={allPriority.some(data => data === "Low")}
                                        onChange={changeHandlerPriority}
                                    />}
                                />
                                <FormControlLabel
                                    label="Medium"
                                    control={<Checkbox
                                        value='Medium'
                                        checked={allPriority.some(data => data === "Medium")}
                                        onChange={changeHandlerPriority}
                                    />}
                                />
                                <FormControlLabel
                                    label="High"
                                    control={<Checkbox
                                        value='High'
                                        checked={allPriority.some(data => data === "High")}
                                        onChange={changeHandlerPriority}
                                    />}
                                />

                            </div>
                        </FormGroup>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <FormLabel className='font-sans text-base'>Status</FormLabel>
                        <FormGroup>
                            <div className='flex flex-wrap gap-3'>
                                <FormControlLabel
                                    label="Open"
                                    control={<Checkbox
                                        value='Open'
                                        checked={allStatus.some(data => data === "Open")}
                                        onChange={changeHandlerStatus}
                                    />}
                                />
                                <FormControlLabel
                                    label="Answered"
                                    control={<Checkbox
                                        value='Answered'
                                        checked={allStatus.some(data => data === "Answered")}
                                        onChange={changeHandlerStatus}
                                    />}
                                />
                                <FormControlLabel
                                    label="Closed"
                                    control={<Checkbox
                                        value='Closed'
                                        checked={allStatus.some(data => data === "Closed")}
                                        onChange={changeHandlerStatus}
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
                                value={orderTicket}
                                onChange={(e) => setOrderTicket(e.target.value as "NTO" | "OTN")}
                                style={{ display: 'flex', flexDirection: 'row' }} // اعمال flex
                            >
                                <FormControlLabel value="NTO" control={<Radio />} label="New to Old" />
                                <FormControlLabel value="OTN" control={<Radio />} label="Old to New" />
                            </RadioGroup>
                        </FormControl>
                    </div>

                </FilterDate>
            </ShowDialogModal>


            <SideBarLeft />
            <SideBarBottom />
        </>
    )
}

export default Tickets