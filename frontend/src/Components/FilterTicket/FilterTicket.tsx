import React, { useEffect, useState } from 'react'
import FilterDate from '../FilterDate/FilterDate'
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs';
import toast from 'react-hot-toast';
import { ticketUser } from '../../hooks/ticket/tickets.types';


type FilterTicketProps = {
    setIsShowOpenFilter: (value: boolean) => void,
    setFilteredData: (value: ticketUser[] | null) => void,
    allTicket: ticketUser[],
}



export type ticketFilterLocalStorage = {
    priority: string[],
    status: string[],
    order: "OTN" | "NTO",
    fromDate: Dayjs,
    untilDate: Dayjs
}






function FilterTicket(
    {
        setIsShowOpenFilter,
        setFilteredData,
        allTicket,
    }: FilterTicketProps
) {  

    
    //get localStorage
    const [ticketFilterLocalStorage, setTicketFilterLocalStorage] = useState<ticketFilterLocalStorage | null>(
        localStorage.getItem("ticketFilter")
            ? JSON.parse(localStorage.getItem("ticketFilter") as string)
            : null
    )

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
    


    const filterDateHandler = () => {

        if (allPriority.length === 0) {
            toast.error("You must select at least one Priority.");
            return;
        }

        if (allStatus.length === 0) {
            toast.error("You must select at least one Status.");
            return;
        }

    


        // Convert fromPicker and untilPicker to Dayjs objects
        const fromDate = fromPicker ? dayjs(fromPicker).startOf('day') : null;
        const untilDate = untilPicker ? dayjs(untilPicker).endOf('day') : null;


    
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
                : setFilteredData(filteredTickets?.reverse() || [])
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
            <div>
                <Button
                    onClick={() => {
                        setFromPicker(null)
                        setUntilPicker(null)
                        setOrderTicket("NTO")
                        setAllPriority(["Low", "Medium", "High"])
                        setAllStatus(["Open", "Closed", "Answered"])
                    }
                    }
                    variant="outlined"
                    sx={{ borderColor: '#c6415ed8', color: '#c6415ed8', '&:hover': { borderColor: '#f8587bf5', color: '#f8587bf5' } }}
                >
                    Reset Filter
                </Button>
            </div>

        </FilterDate>
    )
}

export default FilterTicket