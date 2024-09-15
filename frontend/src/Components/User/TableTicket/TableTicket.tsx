
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import DateConverter from '../../../utils/DateConverter';
import { Fragment, useEffect, useState } from 'react';
import { ticketUser } from '../../../hooks/ticket/tickets.types';
import ShowDialogModal from '../../ShowDialogModal/ShowDialogModal';
import { useGetMyUsersInfo } from '../../../hooks/user/useUser';
import toast from 'react-hot-toast';
import { usePutNewMessageTicket } from '../../../hooks/ticket/useTicket';

export type allTicketUserProps = {
    allTicketUser: ticketUser[]
}


type response = {
    senderId: string,
    senderUsername: string,
    message: string,
    responseDate: Date,
    senderProfilePicture: { path: string, filename: string },
}

type infoMessage = {
    description: string,
    department: "Support" | "Technical" | "HR" | "Management" | "Design" | "Other",
    createdAt: Date,
    status: "Open" | "Closed" | "Answered",
    _id: string
}


export default function TableTicket({ allTicketUser }: allTicketUserProps) {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [infoMessageUser, setInfoMessageUser] = useState<infoMessage | null>(null)
    const [isShowAnswer, setisShowAnswer] = useState(false);
    const [answerInfo, setAnswerInfo] = useState<response[] | null>(null);
    const { data: myInfo } = useGetMyUsersInfo();
    const [message, setMessage] = useState('')

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const { mutate: addNewMessage, isError: isErrorAddNewMessage, error: errorNewMessage, isSuccess: isSuccessAddNewMessage } = usePutNewMessageTicket();

    // send ticket message
    const sendMessageHandler = () => {
        if (message.trim().length >= 5 && message.trim().length <= 60) {
            console.log(message);
            if (infoMessageUser?._id) {
                let newObjectSendMessage = {
                    ticketId: infoMessageUser?._id,
                    message: message
                }
                addNewMessage(newObjectSendMessage)

                if (myInfo) {
                    setAnswerInfo((prev) => [
                        ...(prev || []),
                        {
                            senderId: myInfo._id,  // اینجا مطمئن هستید که myInfo همیشه وجود دارد
                            senderUsername: myInfo.username,
                            message: message,
                            responseDate: new Date(),
                            senderProfilePicture: {
                                path: myInfo.profilePicture.path,
                                filename: myInfo.profilePicture.filename
                            }
                        }
                    ]);
                }
            }
        } else {
            toast.error("The description must be at least 20 characters and most 60 characters.")
        }
    }

    // is success and is error send message
    useEffect(() => {
        if (isErrorAddNewMessage) {
            if (errorNewMessage && (errorNewMessage as any).response) {
                toast.error((errorNewMessage as any).response.data.error.message,
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

        if (isSuccessAddNewMessage) {
            toast.success("Message send successfuly",
                {
                    icon: '✅',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            )
            setMessage("")
        }
    }, [isErrorAddNewMessage, isSuccessAddNewMessage])



    const hasData = allTicketUser && allTicketUser.length > 0;
    return (
        <>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                {hasData ? (
                    <>
                        <TableContainer sx={{
                            maxHeight: { xs: 500, md: 550, lg: 600 },
                            overflowX: 'auto',
                        }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell align="center">Title</TableCell>
                                        <TableCell align="center">Department</TableCell>
                                        <TableCell align="center">Priority</TableCell>
                                        <TableCell align="center">Status</TableCell>
                                        <TableCell align="center">CreatedAt</TableCell>
                                        <TableCell align="center">Messages</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allTicketUser
                                        ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        ?.map((data, index) => (
                                            <TableRow key={data._id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell align="center">
                                                    <div className='text-sm bg-cyan-400/30 rounded'>
                                                        {data.title}

                                                    </div>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {data.department}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <div className={`${data.priority === "Low" ? "bg-green-400/30" :
                                                        data.priority === "Medium" ? "bg-yellow-400/30" :
                                                            "bg-red-400/30"
                                                        } rounded px-1 md:px-0`}>
                                                        {data.priority}
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <div className={`${data.status === "Answered" ? "bg-green-400/30" :
                                                        data.status === "Open" ? "bg-yellow-400/30" :
                                                            "bg-red-400/30"
                                                        } rounded px-1 md:px-0`}>
                                                        {data.status}
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center"><DateConverter date={data.createdAt} /></TableCell>
                                                <TableCell align="center">

                                                    <button onClick={() => {
                                                        setisShowAnswer(true)
                                                        setInfoMessageUser({
                                                            _id: data._id,
                                                            description: data.description,
                                                            department: data.department,
                                                            createdAt: data.createdAt,
                                                            status: data.status
                                                        })
                                                        setAnswerInfo(data.responses)
                                                    }} className={`bg-purple-500/30 rounded px-1`}>
                                                        Show
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {allTicketUser?.length > 0 && (
                            <TablePagination
                                rowsPerPageOptions={[5, 15, 50]}
                                component="div"
                                count={allTicketUser.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        )}
                    </>
                ) : (
                    <p className='font-medium text-lg text-center py-4'>
                        You have not registered a ticket yet or no ticket was found with this filter 😩</p>
                )}
            </Paper>


            <ShowDialogModal
                isOpenShowLDialogModal={isShowAnswer}
                setisOpenShowLDialogModal={setisShowAnswer}
                title="Messages"
                height="h-72"
            >
                <div className="self-end flex flex-col p-2">
                    <div className="flex justify-between items-start text-white bg-violet-600 rounded-3xl max-w-xs px-4  py-3 overflow-hidden">
                        <div className=" flex  flex-col gap-1.5 text-sm ">
                            <span className='text-sm font-medium text-wrap'>{infoMessageUser?.description}</span>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-xs"><DateConverter date={infoMessageUser?.createdAt} /></span>
                            </div>
                        </div>
                    </div>
                </div>
                {answerInfo?.map(((data, index) => (
                    <Fragment key={index}>
                        {myInfo?._id === data.senderId ? (
                            <div className="self-end flex flex-col p-2">
                                <div className="flex justify-between items-start text-white bg-violet-600 rounded-3xl max-w-xs px-4 py-3 overflow-hidden">
                                    <div className=" flex flex-col gap-1.5 text-sm">
                                        <p className='text-sm font-medium text-wrap'>{data.message}</p>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs"><DateConverter date={data.responseDate} /></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-end gap-2 max-w-xs p-2">
                                <img draggable="false" className="w-7 h-7 rounded-full object-cover" src={`http://localhost:4002/images/profiles/${data.senderProfilePicture.filename}`} alt="prof" />
                                <div className="flex flex-col ">
                                    <span className="text-xs text-gray-500 px-3 py-1">{data.senderUsername} ( {infoMessageUser?.department} )</span>
                                    <div className="flex flex-col">
                                        <div className="px-4  flex flex-col gap-1.5 py-3 text-sm bg-gray-200 rounded-3xl max-w-xs overflow-hidden">
                                            <span className="text-black text-sm font-medium text-wrap">{data.message}</span>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs text-gray-500"><DateConverter date={data.responseDate} /></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Fragment>
                )))}

                {infoMessageUser?.status !== "Closed" ? (
                    <form onSubmit={e => e.preventDefault()} className="flex items-center gap-3 justify-between border rounded-full py-2.5 px-4 m-5 relative">

                        <input
                            className="flex-1 outline-none text-sm bg-white dark:bg-black text-black dark:text-white"
                            type="text"
                            placeholder="Message..."
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            required
                        />
                        {message.trim().length > 0 &&
                            <button onClick={sendMessageHandler} className="text-primary-blue font-medium text-sm">Send</button>
                        }
                    </form>
                ) : (
                    <div className="flex items-end gap-2 max-w-xs p-2">
                        <div className='w-7 h-7'>

                        </div>
                    <div className="flex flex-col ">
                        <div className="flex flex-col">
                            <div className="px-4  flex flex-col gap-1.5 py-3 text-sm bg-red-400/30 rounded-3xl max-w-xs overflow-hidden">
                                <span className="dark:text-gray-200 text-slate-600 text-sm font-medium text-wrap"> This ticket is closed 😩</span>
                            </div>
                        </div>
                    </div>
                </div>
                )}

            </ShowDialogModal>
        </>
    );
}
