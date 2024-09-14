
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

export type TableLoginProps = {
    loginInformation?: {
        os: string,
        browser: string,
        country: string,
        ip: string,
        date: Date,
        _id: string
    }[]
}


export default function TableLogin({ loginInformation }: TableLoginProps) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);


    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const hasData = loginInformation && loginInformation.length > 0;



    return (
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
                                    <TableCell align="center">IP</TableCell>
                                    <TableCell width={80} align="center">OS</TableCell>
                                    <TableCell align="center">Country</TableCell>
                                    <TableCell width={80} align="center">Browser</TableCell>
                                    <TableCell align="center">Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loginInformation
                                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    ?.map((data, index) => (
                                        <TableRow key={data._id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell align="center">{data.ip}</TableCell>
                                            <TableCell align="center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <div className='w-10 h-10'>{svgIconOs(data.os)}</div>
                                            </TableCell>
                                            <TableCell align="center">{data.country}</TableCell>
                                            <TableCell align="center">
                                                <div className='flex justify-center items-center'>
                                                    {svgIconBrowser(data.browser) ? (
                                                        <img className='w-10 h-10 rounded-full' src={svgIconBrowser(data.browser)} alt="browser" />
                                                    ) : (
                                                        <p>Unknown</p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell align="center"><DateConverter date={data.date} /></TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {loginInformation?.length > 0 && (
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={loginInformation.length}
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
