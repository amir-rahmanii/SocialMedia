import React, { Fragment, useEffect, useState } from 'react'
import SkeletonTable from '../../Components/SkeletonTable/SkeletonTable'
import useGetData from '../../hooks/useGetData'
import { searchIcon } from '../../Components/SvgIcon/SvgIcon';
import Table from '../../Components/Admin/Table/Table';
import { ticketUser } from '../../hooks/ticket/tickets.types';
import useDeleteData from '../../hooks/useDeleteData';
import Modal from '../../Components/Admin/Modal/Modal';
import { useQueryClient } from 'react-query';
import { response } from '../../Components/User/TableTicket/TableTicket';
import ResponseTicket from '../../Components/ResponseTicket/ResponseTicket';
import usePostData from '../../hooks/usePostData';
import TicketTableAdmin from '../../Components/Admin/TicketTableAdmin/TicketTableAdmin';
import { Button } from '@mui/material';
import FilterTicket from '../../Components/FilterTicket/FilterTicket';
import dayjs from 'dayjs';

function TicketsAdmin() {
    const columns: string[] = [
        "#",
        "Username",
        "Title",
        "Department",
        "Priority",
        "Status",
        "CreatedAt",
        "Action"
    ]
    const [infoTicket, setInfoTicket] = useState<ticketUser | null>(null)

    const [searchValue, setSearchValue] = useState("")
    const [isShowDeleteTicket, setIsShowDeleteTicket] = useState(false);
    const [isShowResponseTicket, setIsShowResponseTicket] = useState(false);
    const [isShowClosedTicket, setIsShowClosedTicket] = useState(false);
    const queryClient = useQueryClient();
    const [answerInfo, setAnswerInfo] = useState<response[] | null>(null);
    const [filteredData, setFilteredData] = useState<ticketUser[] | null>(null)
    const [isShowOpenFilter, setIsShowOpenFilter] = useState(false);

    const { data: allTicket, isLoading, isSuccess } = useGetData<ticketUser[]>(
        ["useGetAllTicket"],
        "ticket/all-tickets"
    )


    const { mutate: deleteTicket } = useDeleteData(
        "ticket/remove-ticket",
        "ticket deleted successfuly",
        () => {
            setIsShowDeleteTicket(false)
            queryClient.invalidateQueries(["useGetAllTicket"])
        }
    )
    const { mutate: closedTicket } = usePostData(
        "ticket/closed-ticket",
        "ticket closed successfuly",
        true,
        () => {
            setIsShowClosedTicket(false)
            queryClient.invalidateQueries(["useGetAllTicket"])
        }
    )





    const deleteTicketHandler = () => {
        deleteTicket({ ticketId: infoTicket?._id })
    }



    const closeTicketHandler = () => {
        closedTicket({ ticketId: infoTicket?._id })
    }

    const serchUsernameFilterHandler = () => {
        if (searchValue.trim()) {
            const regex = new RegExp(searchValue, 'i');
            const newInformationAllTicket = allTicket?.filter(data =>
                regex.test(data.title) || regex.test(data.user.username)
            );
            setFilteredData(newInformationAllTicket || null);
        } else {
            setFilteredData(allTicket || []);
        }
    };


    useEffect(() => {
        isSuccess && serchUsernameFilterHandler();
    }, [searchValue])






    const filterTicketsFromQuery = (allTicket: ticketUser[]) => {
        const query = new URLSearchParams(location.search); // Use location here
        
        const fromPicker = dayjs(query.get('fromDate'));
        const untilPicker = dayjs(query.get('untilDate'));
        const orderTicket = (query.get('order') as "NTO" | "OTN") || "NTO";
        const allPriority = query.get('priority')?.split(',') || ["Low", "Medium", "High"];
        const allStatus = query.get('status')?.split(',') || ["Open", "Closed", "Answered"];

        // Filter tickets
        const filteredTickets = allTicket.filter(info => {
            const includedPriority = allPriority.includes(info.priority);
            const includedStatus = allStatus.includes(info.status);
            const infoDate = dayjs(info.createdAt);
            const isDateInRange = infoDate.isBetween(fromPicker.startOf('day'), untilPicker.endOf('day'), null, '[]');
            return (includedPriority && includedStatus) && isDateInRange;
        });

        // Only set filtered data if filteredTickets is an array
        setFilteredData(orderTicket === "NTO" ? filteredTickets : filteredTickets.reverse());
    };

    useEffect(() => {
        if (isSuccess && allTicket) {
            filterTicketsFromQuery(allTicket); // Pass allTicket to the function
        }
    }, [isSuccess, allTicket, location.search]); 






    return (
        <>
            <div className="font-sans grid w-full">
                {isLoading ? (
                    <SkeletonTable />
                ) : (
                    <div className='bg-admin-navy rounded'>
                        <div className='px-6 pt-6 flex justify-between items-center'>
                            <h3 className='text-xl mb-6'>Tickets</h3>
                            <div className='gap-4 glex flex items-center'>
                                <form className='flex items-center gap-1' onSubmit={e => e.preventDefault()}>
                                    <button className='text-admin-High w-5 h-5'>
                                        {searchIcon}
                                    </button>
                                    <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className='bg-transparent text-white outline-none' placeholder='search...' type="text" />
                                </form>
                                {/* show filter */}
                                <Button onClick={() => setIsShowOpenFilter(true)} variant="outlined">Filter</Button>
                            </div>
                        </div>
                        <Table columns={columns}>
                            <TicketTableAdmin
                                allTicket={filteredData || allTicket || []}
                                setInfoTicket={setInfoTicket}
                                setIsShowResponseTicket={setIsShowResponseTicket}
                                setAnswerInfo={setAnswerInfo}
                                setIsShowClosedTicket={setIsShowClosedTicket}
                                setIsShowDeleteTicket={setIsShowDeleteTicket}
                            />
                        </Table>
                    </div>
                )}
            </div>

            {/* Delete Ticket */}
            <Modal
                isYesOrNo={true}
                title={`Are you sure you want to Delete ${infoTicket?.user.username} ticket ?`}
                setisOpenModal={setIsShowDeleteTicket}
                isOpenModal={isShowDeleteTicket}
                btnNoTitle={`keep the ticket`}
                btnYesTitle={`Delete ticket`}
                isAttention={true}
                submitHandler={deleteTicketHandler} />

            {/* Response Ticket */}
            <Modal
                isYesOrNo={false}
                setisOpenModal={setIsShowResponseTicket}
                isOpenModal={isShowResponseTicket}
            >
                {infoTicket && (
                    <ResponseTicket
                        readOnlyStars={true}
                        bgInputAdmin={true}
                        infoMessageUser={infoTicket}
                        answerInfo={answerInfo}
                        setAnswerInfo={setAnswerInfo} />
                )}


            </Modal>


            {/* Closed Ticket */}
            <Modal
                isYesOrNo={true}
                title={`Are you sure you want to Closed ${infoTicket?.user.username} ticket ?`}
                setisOpenModal={setIsShowClosedTicket}
                isOpenModal={isShowClosedTicket}
                btnNoTitle={`Don't close the ticket`}
                btnYesTitle={`Close the ticket`}
                isAttention={true}
                submitHandler={closeTicketHandler} />


            {/* Ticket Filter */}
            <Modal
                isYesOrNo={false}
                setisOpenModal={setIsShowOpenFilter}
                isOpenModal={isShowOpenFilter}
            >
                {isSuccess && (
                    <FilterTicket
                        setIsShowOpenFilter={setIsShowOpenFilter}
                        setFilteredData={setFilteredData}
                        allTicket={allTicket}
                    />
                )}

            </Modal>
        </>
    )
}

export default TicketsAdmin