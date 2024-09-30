import React, { useEffect, useState } from 'react'
import SkeletonTable from '../../Components/SkeletonTable/SkeletonTable'
import useGetData from '../../hooks/useGetData'
import { closeIcon, deleteIcon, editPostIcon, searchIcon } from '../../Components/SvgIcon/SvgIcon';
import Table from '../../Components/Admin/Table/Table';
import { ticketUser } from '../../hooks/ticket/tickets.types';
import useDeleteData from '../../hooks/useDeleteData';
import Modal from '../../Components/Admin/Modal/Modal';
import { useQueryClient } from 'react-query';
import { response } from '../../Components/User/TableTicket/TableTicket';
import ResponseTicket from '../../Components/ResponseTicket/ResponseTicket';
import usePostData from '../../hooks/usePostData';
import { Button } from '@mui/material';
import FilterTicket, { ticketFilterLocalStorage } from '../../Components/FilterTicket/FilterTicket';
import dayjs from 'dayjs';
import DateConverter from '../../utils/DateConverter';

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
      //get localStorage
      const [ticketFilterLocalStorage, setTicketFilterLocalStorage] = useState<ticketFilterLocalStorage | null>(
        localStorage.getItem("ticketFilter")
            ? JSON.parse(localStorage.getItem("ticketFilter") as string)
            : null
    )

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
            queryClient.invalidateQueries(["useGetAllTicket"]);
        }
    )
    const { mutate: closedTicket } = usePostData(
        "ticket/closed-ticket",
        "ticket closed successfuly",
        true,
        () => {
            setIsShowClosedTicket(false)
            queryClient.invalidateQueries(["useGetAllTicket"]);
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
            <div className="font-sans grid max-w-[710px] overflow-auto md:max-w-full md:w-full">
                {isLoading ? (
                    <SkeletonTable />
                ) : (
                    <div className='bg-admin-navy rounded'>
                        <div className='px-6 pt-6 flex justify-between items-center'>
                            <h3 className='text-xl mb-6'>Tickets</h3>
                            <div className='gap-4 glex flex items-center'>
                                <form  className='flex items-center gap-1' onSubmit={e => e.preventDefault()}>
                                    <button onClick={serchUsernameFilterHandler} className='text-admin-High w-5 h-5'>
                                        {searchIcon}
                                    </button>
                                    <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className='bg-transparent text-white outline-none' placeholder='search...' type="text" />
                                </form>
                                {/* show filter */}
                                <Button onClick={() => setIsShowOpenFilter(true)} variant="outlined">Filter</Button>
                            </div>
                        </div>
                        <Table columns={columns}>
                            <tbody className='h-[200px] overflow-auto' >
                                {filteredData?.map((data, index) => (
                                    <tr key={data._id} className={`border-y text-sm text-center border-[#2e3a47]`}>
                                        <td className='py-[18px]  px-2 lg:px-1'>{index + 1}</td>
                                        <td className='py-[18px]  px-2 lg:px-1'>
                                            <div className='flex items-center gap-2 justify-center'>
                                                <img loading='lazy' className='w-8 h-8 rounded-full object-cover' src={`http://localhost:4002/images/profiles/${data.user.profilePicture.filename}`} alt="profile" />
                                                {data.user.username}
                                            </div>
                                        </td>
                                        <td className='py-[18px]  px-2 lg:px-1'>
                                            <div className='text-sm bg-cyan-400/30 rounded'>
                                                {data.title}
                                            </div>
                                        </td>
                                        <td className='py-[18px]  px-2 lg:px-1'>{data.department}</td>
                                        <td className='py-[18px]  px-2 lg:px-1'>
                                            <div className={` flex justify-center items-center ${data.priority === "Low" ? "bg-green-400/30" :
                                                data.priority === "Medium" ? "bg-yellow-400/30" :
                                                    "bg-red-400/30"
                                                } rounded px-1 md:px-0`}>
                                                {data.priority}
                                            </div>
                                        </td>
                                        <td className='py-[18px]  px-2 lg:px-1'>
                                            <div className={`flex justify-center items-center ${data.status === "Answered" ? "bg-green-400/30" :
                                                data.status === "Open" ? "bg-yellow-400/30" :
                                                    "bg-red-400/30"
                                                } rounded px-1 md:px-0`}>
                                                {data.status}
                                            </div>
                                        </td>

                                        <td className='py-[18px]  px-2 lg:px-1'><DateConverter date={data.createdAt} /></td>
                                        <td className='py-[18px]  px-2 lg:px-1'>
                                            <div className='flex items-center justify-center gap-2'>
                                                <button onClick={() => {
                                                    setInfoTicket(data)
                                                    setIsShowResponseTicket(true)
                                                    setAnswerInfo(data.responses)

                                                }} className={`w-4 h-4 text-admin-High hover:scale-110 hover:text-yellow-400 transition-all duration-300`}>{editPostIcon}</button>

                                                {data.status !== "Closed" && (
                                                    <button onClick={() => {
                                                        setInfoTicket(data)
                                                        setIsShowClosedTicket(true)
                                                    }} className='w-4 h-4 text-admin-High hover:scale-110 hover:text-orange-400 transition-all duration-300'>{closeIcon}</button>
                                                )}

                                                <button onClick={() => {
                                                    setInfoTicket(data)
                                                    setIsShowDeleteTicket(true)
                                                }} className='w-4 h-4 text-admin-High hover:scale-110 hover:text-error-red transition-all duration-300'>{deleteIcon}</button>

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
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
                <div className='flex flex-col max-h-72 overflow-auto'>
                    {infoTicket && (
                        <ResponseTicket
                            readOnlyStars={true}
                            bgInputAdmin={true}
                            infoMessageUser={infoTicket}
                            answerInfo={answerInfo}
                            setAnswerInfo={setAnswerInfo} />
                    )}
                </div>
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