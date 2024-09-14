
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import DateConverter from '../../../utils/DateConverter';
import { svgIconBrowser, svgIconOs } from '../../../utils/systemInfoConverterSvg';
import { createTheme, ThemeProvider } from '@mui/material';
import { useEffect, useState } from 'react';
import { useThemeContext } from '../../../Context/ThemeContext';
import { ticketUser } from '../../../hooks/ticket/tickets.types';

export type allTicketUserProps = {
    allTicketUser: ticketUser[]
}


export default function TableTicket({ allTicketUser }: allTicketUserProps) {
    console.log(allTicketUser);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);


    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const hasData = allTicketUser && allTicketUser.length > 0;



    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            {hasData ? (
                <>
                    <TableContainer sx={{ maxHeight: 500 }}>
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
                                                {data.title}
                                            </TableCell>
                                            <TableCell align="center">
                                                {data.department}
                                            </TableCell>
                                            <TableCell align="center">
                                                <div className={`${data.priority === "Low" ? "bg-green-400" :
                                                    data.priority === "Medium" ? "bg-yellow-400" :
                                                        "bg-red-400"
                                                    } rounded px-1 md:px-0`}>
                                                    {data.priority}
                                                </div>
                                            </TableCell>
                                            <TableCell align="center">
                                                <button className='bg-primary-blue rounded px-1'>
                                                    Show
                                                </button>
                                            </TableCell>
                                            <TableCell align="center">
                                                <div className={`${data.status === "Answered" ? "bg-indigo-400" :
                                                    data.status === "Open" ? "bg-emerald-400" :
                                                        "bg-orange-400"
                                                    } rounded px-1 md:px-0`}>
                                                    {data.status}
                                                </div>
                                            </TableCell>
                                            <TableCell align="center"><DateConverter date={data.createdAt} /></TableCell>
                                            <TableCell align="center">
                                                <button disabled={!(data.status === "Answered")} className={`${data.status === "Answered" ? "bg-purple-500" : "bg-purple-300"} rounded px-1`}>
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
                            rowsPerPageOptions={[10, 25, 100]}
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
                <p className='font-medium text-lg text-center py-4'>No data found with this filter 😩</p>
            )}
        </Paper>
    );
}
