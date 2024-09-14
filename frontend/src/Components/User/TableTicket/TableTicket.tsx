
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import DateConverter from '../../../utils/DateConverter';
import { useState } from 'react';
import { ticketUser } from '../../../hooks/ticket/tickets.types';
import ShowDialogModal from '../../ShowDialogModal/ShowDialogModal';

export type allTicketUserProps = {
    allTicketUser: ticketUser[]
}


type response = {
    adminUsername: string;
    messageBack: string;
    responseDate: Date;
    adminProfilePicture: {
        path: string;
        filename: string;
    };
    department: string
}


export default function TableTicket({ allTicketUser }: allTicketUserProps) {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isShowDescription, setIsShowDescription] = useState(false);
    const [description, setDescription] = useState('');
    const [isShowAnswer, setisShowAnswer] = useState(false);
    const [answerInfo, setAnswerInfo] = useState<response | null>(null);


    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


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
                                        <TableCell align="center">Description</TableCell>
                                        <TableCell align="center">Status</TableCell>
                                        <TableCell align="center">CreatedAt</TableCell>
                                        <TableCell align="center">Answer</TableCell>
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
                                                    <button onClick={() => {
                                                        setDescription(data.description)
                                                        setIsShowDescription(true)
                                                    }} className='bg-primary-blue/30 rounded px-1'>
                                                        Show
                                                    </button>
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
                                                    {(data.status === "Closed" || data.status === "Answered") ? (
                                                        <button onClick={() => {
                                                            setisShowAnswer(true)
                                                            setAnswerInfo({ ...data.response, department: data.department })
                                                        }} className={`bg-purple-500/30 rounded px-1`}>
                                                            Show
                                                        </button>
                                                    ) : (
                                                        <p className='bg-red-400/30 px-1 md:px-0 rounded'>
                                                            Not Answered
                                                        </p>
                                                    )}

                                                    {/* show Admin Answered */}
                                                    <ShowDialogModal
                                                        isOpenShowLDialogModal={isShowAnswer}
                                                        setisOpenShowLDialogModal={setisShowAnswer}
                                                        title="Admin Answer"
                                                        height="h-72"
                                                    >
                                                        <div className='flex justify-between items-center p-3 border-b dark:border-gray-300/20 border-gray-300'>
                                                            <div className=' flex gap-3 items-center '>
                                                                <img className='w-12 h-12 rounded-full object-cover' src={`http://localhost:4002/images/profiles/${answerInfo?.adminProfilePicture.filename}`} alt="prof" />
                                                                <div>
                                                                    <p className='font-medium'>{answerInfo?.adminUsername}</p>
                                                                    <p className='font-medium text-sm text-gray-400/70'>Department {answerInfo?.department}</p>
                                                                </div>
                                                            </div>
                                                            {/* createdAt message back */}
                                                            <div>
                                                                <p className='font-medium text-xs ml-5 md:text-sm text-wrap'>Answerd {<DateConverter date={answerInfo?.responseDate} />}</p>
                                                            </div>
                                                        </div>
                                                        <div className='p-3'>
                                                            <p className='font-medium'>Message : </p>
                                                            <p className='text-sm font-medium pt-1'>{answerInfo?.messageBack}</p>
                                                        </div>

                                                    </ShowDialogModal>

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

            {/* show description */}
            <ShowDialogModal
                isOpenShowLDialogModal={isShowDescription}
                setisOpenShowLDialogModal={setIsShowDescription}
                title="Description"
                height="h-56"
            >
                <div className='p-3'>
                    {description}

                </div>

            </ShowDialogModal>

            <ShowDialogModal
                isOpenShowLDialogModal={isShowAnswer}
                setisOpenShowLDialogModal={setisShowAnswer}
                title="Admin Answer"
                height="h-72"
            >
                <div className='flex justify-between items-center p-3 border-b dark:border-gray-300/20 border-gray-300'>
                    <div className=' flex gap-3 items-center '>
                        <img className='w-12 h-12 rounded-full object-cover' src={`http://localhost:4002/images/profiles/${answerInfo?.adminProfilePicture.filename}`} alt="prof" />
                        <div>
                            <p className='font-medium'>{answerInfo?.adminUsername}</p>
                            <p className='font-medium text-sm text-gray-400/70'>Department {answerInfo?.department}</p>
                        </div>
                    </div>
                    {/* createdAt message back */}
                    <div>
                        <p className='font-medium text-xs ml-5 md:text-sm text-wrap'>Answerd {<DateConverter date={answerInfo?.responseDate} />}</p>
                    </div>
                </div>
                <div className='p-3'>
                    <p className='font-medium'>Message : </p>
                    <p className='text-sm font-medium pt-1'>{answerInfo?.messageBack}</p>
                </div>

            </ShowDialogModal>
        </>
    );
}
