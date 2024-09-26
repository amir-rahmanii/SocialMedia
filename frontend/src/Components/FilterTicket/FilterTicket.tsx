import React, { useEffect, useState } from 'react'
import FilterDate from '../FilterDate/FilterDate'
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs';
import toast from 'react-hot-toast';
import { ticketUser } from '../../hooks/ticket/tickets.types';
import { useLocation, useNavigate } from 'react-router-dom';



type FilterTicketProps = {
    setIsShowOpenFilter: (value: boolean) => void,
    setFilteredData: (value: ticketUser[] | null) => void,
    allTicket: ticketUser[],
}

export type ticketFilterLocalStorage = {
    status: string[],
    priority: string[],
    order: "OTN" | "NTO",
    fromDate: Dayjs,
    untilDate: Dayjs,

}

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};




function FilterTicket(
    {
        setIsShowOpenFilter,
        setFilteredData,
        allTicket,
    }: FilterTicketProps
) {

    const query = useQuery();

    const [fromPicker, setFromPicker] = useState<Dayjs | null>(
        dayjs(query.get('fromDate')) || null
    );
    const [untilPicker, setUntilPicker] = useState<Dayjs | null>(
        dayjs(query.get('untilDate')) || null
    );
    const [orderTicket, setOrderTicket] = useState<"NTO" | "OTN">(
        query.get('order') as "NTO" | "OTN" || "NTO"
    );
    const [allPriority, setAllPriority] = useState<string[]>(
        query.get('priority')?.split(',') || ["Low", "Medium", "High"]
    );
    const [allStatus, setAllStatus] = useState<string[]>(
        query.get('status')?.split(',') || ["Open", "Closed", "Answered"]
    );
    const navigate = useNavigate();



    const filterDateHandler = () => {

        if (allPriority.length === 0) {
            toast.error("You must select at least one Priority.");
            return;
        }

        if (allStatus.length === 0) {
            toast.error("You must select at least one Status.");
            return;
        }

        console.log(fromPicker);


        // Convert fromPicker and untilPicker to Dayjs objects
        const fromDate = fromPicker ? dayjs(fromPicker) : null;
        const untilDate = untilPicker ? dayjs(untilPicker) : null;

        const isFromDateValid = fromDate && fromDate.isValid();
        const isUntilDateValid = untilDate && untilDate.isValid();

        // ساخت URL جدید با پارامترها
        const params = new URLSearchParams();
        params.set('status', allStatus.join(',')); // تبدیل آرایه به رشته
        params.set('priority', allPriority.join(',')); // تبدیل آرایه به رشته
        params.set('order', orderTicket);
        isFromDateValid && params.set('fromDate', fromDate.toISOString()); // تبدیل به فرمت مناسب
        isUntilDateValid && params.set('untilDate', untilDate.toISOString()); // تبدیل به فرمت مناسب

        // به‌روزرسانی URL با پارامترها
        navigate(`?${params.toString()}`);

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