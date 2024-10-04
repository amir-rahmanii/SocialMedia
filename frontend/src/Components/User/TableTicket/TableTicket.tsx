
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
import ResponseTicket from '../../ResponseTicket/ResponseTicket';
import { eyeIcon } from '../../SvgIcon/SvgIcon';

export type allTicketUserProps = {
    allTicketUser: ticketUser[]
}


export type response = {
    senderId: string,
    senderUsername: string,
    message: string,
    responseDate: Date,
    senderProfilePicture: { path: string, filename: string },
}



export default function TableTicket({ allTicketUser }: allTicketUserProps) {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [infoMessageUser, setInfoMessageUser] = useState<ticketUser | null>(null)
    const [isShowAnswer, setisShowAnswer] = useState(false);
    const [answerInfo, setAnswerInfo] = useState<response[] | null>(null);

    const handleChangePage = (_: unknown, newPage: number) => {
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
                                                        setInfoMessageUser(data)
                                                        setAnswerInfo(data.responses)
                                                    }} className={` hover:text-purple-500 transition-all duration-300 hover:scale-110 w-4 h-4`}>
                                                        {eyeIcon}
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
                    <p className='font-sans  text-lg text-center py-4'>
                        You have not registered a ticket yet or no ticket was found with this filter 😩</p>
                )}
            </Paper>


            <ShowDialogModal
                isOpenShowLDialogModal={isShowAnswer}
                setisOpenShowLDialogModal={setisShowAnswer}
                title="Messages"
                height="h-80"
            >
                {infoMessageUser && (
                    <ResponseTicket
                        readOnlyStars={false}
                        bgInputAdmin={false}
                        infoMessageUser={infoMessageUser}
                        answerInfo={answerInfo}
                        setAnswerInfo={setAnswerInfo} />
                )}

            </ShowDialogModal>
        </>
    );
}
