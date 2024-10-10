import  { useEffect, useState } from 'react'
import MetaData from '../../Components/MetaData/MetaData'
import { Button } from '@mui/material'
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import AddTicket from '../../Components/User/AddTicket/AddTicket'
import TableTicket from '../../Components/User/TableTicket/TableTicket'
import { ticketUser } from '../../hooks/ticket/tickets.types'
import SkeletonTable from '../../Components/SkeletonTable/SkeletonTable'
import ShowDialogModal from '../../Components/ShowDialogModal/ShowDialogModal'
import useGetData from '../../hooks/useGetData'
import SideBarLeft from '../../Parts/User/SideBarLeft/SideBarLeft'
import Header from '../../Parts/User/Header/Header'
import SideBarBottom from '../../Parts/User/SideBarBottom/SideBarBottom'
import FilterTicket, { ticketFilterLocalStorage } from '../../Components/FilterTicket/FilterTicket';

// Enable the 'isBetween' plugin for dayjs
dayjs.extend(isBetween);




function Tickets() {
    //get localStorage
    const [ticketFilterLocalStorage] = useState<ticketFilterLocalStorage | null>(
        localStorage.getItem("ticketFilter")
            ? JSON.parse(localStorage.getItem("ticketFilter") as string)
            : null
    )


    const [isShowOpenFilter, setIsShowOpenFilter] = useState(false);
    // State to hold the filtered data
    const [filteredData, setFilteredData] = useState<ticketUser[] | null>(null);;


    const { data: allTicket, isLoading, isSuccess } = useGetData<ticketUser[]>(
        ['getUserTicket'],
        "ticket/user-tickets"
    )

    // Function to filter tickets based on local storage
    const filterTicketsFromLocalStorage = () => {

        const fromPicker = dayjs(ticketFilterLocalStorage?.fromDate) || null
        const untilPicker = dayjs(ticketFilterLocalStorage?.untilDate) || null
        const orderTicket = ticketFilterLocalStorage?.order || "NTO"
        const allPriority = ticketFilterLocalStorage?.priority  || ["Low", "Medium", "High"] 
        const allStatus = ticketFilterLocalStorage?.status || ["Open", "Closed", "Answered"]

        // Filter tickets
        const filteredTickets = allTicket?.filter(info => {
            const includedPriority = allPriority.includes(info.priority);
            const includedStatus = allStatus.includes(info.status);
            const infoDate = dayjs(info.createdAt);
            const isDateInRange = infoDate.isBetween(fromPicker.startOf('day'), untilPicker.endOf('day'), null, '[]');
            return (includedPriority && includedStatus) && isDateInRange;
        });

        // Only set filtered data if filteredTickets is an array
        setFilteredData(orderTicket === "NTO" ? filteredTickets || [] : filteredTickets?.reverse() || []);
    };

    useEffect(() => {
        if (isSuccess) {
            filterTicketsFromLocalStorage(); // Pass allTicket to the function
        }
    }, [isSuccess, allTicket , ticketFilterLocalStorage]);



    return (
        <>
            <MetaData title="login-info" />
            <Header />
            <div>

                <div className='w-full mt-16 xl:mr-32 md:w-4/6 mx-auto mb-5'>
                    <h3 className='text-2xl text-center my-7 font-sans text-black dark:text-white'>Add New Ticket</h3>
                    <AddTicket />

                    {isSuccess && allTicket?.length > 0 && (
                        <div className='mb-3 px-3 flex items-center gap-3'>
                            <Button onClick={() => setIsShowOpenFilter(true)} variant="outlined">Filter</Button>
                        </div>
                    )}
                    {isLoading ? (
                        <SkeletonTable />
                    ) : (
                        isSuccess && (
                            <div className='px-3 mb-20 md:mb-0'>
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
                {isSuccess && (
                    <FilterTicket
                        setIsShowOpenFilter={setIsShowOpenFilter}
                        setFilteredData={setFilteredData}
                        allTicket={allTicket}
                    />
                )}
            </ShowDialogModal>


            <SideBarLeft />
            <SideBarBottom />
        </>
    )
}

export default Tickets