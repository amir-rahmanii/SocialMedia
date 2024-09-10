import { Checkbox, Dialog, FormControlLabel, FormGroup } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { closeIcon } from '../SvgIcon/SvgIcon';
import dayjs, { Dayjs } from 'dayjs';
import { PropsWithChildren, useContext, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';

type FilterDateProps = {
    isShowOpenFilter: boolean;
    setIsShowOpenFilter: (value: boolean) => void;
    fromPicker: string;
    setFromPicker: (value: string) => void;
    untilPicker: string;
    setUntilPicker: (value: string) => void;
    filterDateHandler: () => void;
}

const FilterDate: React.FC<PropsWithChildren<FilterDateProps>> = ({
    isShowOpenFilter,
    setIsShowOpenFilter,
    fromPicker,
    setFromPicker,
    untilPicker,
    setUntilPicker,
    filterDateHandler,
    children
}) => {

    const handleDateFromChange = (newValueDate: Dayjs | null) => {
        if (newValueDate) {
            setFromPicker(newValueDate.format('YYYY-MM-DD')); // Example format
            // If fromPicker changes, update untilPicker to ensure it is not before fromPicker
            if (dayjs(untilPicker).isBefore(newValueDate)) {
                setUntilPicker('');
            }
        } else {
            setFromPicker('');
            // If fromPicker is cleared, clear untilPicker as well
            setUntilPicker('');
        }
    };

    const handleDateUntilChange = (newValueDate: Dayjs | null) => {
        if (newValueDate) {
            setUntilPicker(newValueDate.format('YYYY-MM-DD')); // Example format
        } else {
            setUntilPicker('');
        }
    };

    const authContext = useContext(AuthContext);

   

    return (
        <Dialog open={isShowOpenFilter} onClose={() => setIsShowOpenFilter(false)} maxWidth='xl'>
            <div className="flex flex-col min-w-60 border rounded dark:border-gray-300/20 border-gray-300">
                <div className="bg-white dark:bg-black py-3 border-b dark:border-gray-300/20 border-gray-300 px-4 flex justify-between w-full">
                    <span className="font-medium text-black dark:text-white">Filter Login Info</span>
                    <button onClick={() => setIsShowOpenFilter(false)} className="font-medium w-5 h-5 text-black dark:text-white">
                        {closeIcon}
                    </button>
                </div>

                <form onSubmit={e => e.preventDefault()} className='bg-white flex flex-col my-6 px-3 gap-4'>
                    <div className='flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between'>
                        <DatePicker
                            label="From this date picker"
                            value={dayjs(fromPicker)}
                            onChange={handleDateFromChange}
                            maxDate={dayjs()}
                            minDate={dayjs(authContext?.user?.createdAt)}
                        />
                        <DatePicker
                            label="Until this date picker"
                            value={dayjs(untilPicker)}
                            onChange={handleDateUntilChange}
                            maxDate={dayjs()}
                            minDate={dayjs(fromPicker)} // Set the minDate to ensure it's not before fromDate
                        />
                    </div>
                  
                    {children}
                    <button
                        onClick={filterDateHandler}
                        type="submit"
                        className={`font-medium py-2 rounded text-white w-full duration-300 transition-all bg-primary-blue`}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </Dialog>
    );
};

export default FilterDate;
