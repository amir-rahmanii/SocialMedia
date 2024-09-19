
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { PropsWithChildren } from 'react';
import { userInformation } from '../../hooks/user/user.types';
import useGetData from '../../hooks/useGetData';



type FilterDateProps = {
    fromPicker: Dayjs | null;
    setFromPicker: (value: Dayjs | null) => void;
    untilPicker: Dayjs | null;
    setUntilPicker: (value: Dayjs | null) => void;
    filterDateHandler: () => void;
}

const FilterDate: React.FC<PropsWithChildren<FilterDateProps>> = ({
    fromPicker,
    setFromPicker,
    untilPicker,
    setUntilPicker,
    filterDateHandler,
    children
}) => {

    const handleDateFromChange = (newValueDate: Dayjs | null) => {
        setFromPicker(newValueDate);
        if (newValueDate && untilPicker && dayjs(untilPicker).isBefore(newValueDate)) {
            setUntilPicker(dayjs());
        }
    };

    const handleDateUntilChange = (newValueDate: Dayjs | null) => {
        setUntilPicker(newValueDate);
    };

    const { data: myInfo } = useGetData<userInformation>(
        ["getMyUserInfo"],
        "users/user-information"
    );




    return (
        <div>
            <div className="flex flex-col min-w-60 border rounded bg-white dark:bg-black  dark:border-gray-300/20 border-gray-300">
                <form onSubmit={e => e.preventDefault()} className='bg-white dark:bg-black flex flex-col my-6 px-3 gap-4'>
                    <div className='flex flex-col gap-4  md:flex-row md:justify-between'>
                        <DatePicker
                            label="From this date picker"
                            value={fromPicker}
                            onChange={handleDateFromChange}
                            maxDate={dayjs()}
                            minDate={dayjs(myInfo?.createdAt)}
                        />
                        <DatePicker
                            label="Until this date picker"
                            value={untilPicker}
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
        </div>
    );
};

export default FilterDate;
