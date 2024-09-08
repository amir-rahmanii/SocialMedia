// import * as React from 'react';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import DateConverter from '../../../utils/DateConverter';
// import { svgIconBrowser, svgIconOs } from '../../../utils/systemInfoConverterSvg';
// import TablePagination from '@mui/material/TablePagination';




// type TableLoginProps = {
//     loginInformation?: {
//         os: string,
//         browser: string,
//         country: string,
//         ip: string,
//         date: Date,
//         _id: string

//     }[]
// }



// export default function TableLogin({ loginInformation }: TableLoginProps) {
//     return (
//         <TableContainer component={Paper} className='max-h-96 overflow-y-auto rounded'>
//             <Table sx={{ minWidth: 350 }} aria-label="simple table">
//                 <TableHead>
//                     <TableRow>
//                         <TableCell>Login Info</TableCell>
//                         <TableCell align="right">IP</TableCell>
//                         <TableCell align="right">Operating System</TableCell>
//                         <TableCell align="right">Country</TableCell>
//                         <TableCell align="right">Browser</TableCell>
//                         <TableCell align="right">Date</TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {loginInformation?.map((data, index) => (
//                         <TableRow
//                             key={data._id}
//                             sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//                         >
//                             <TableCell component="th" scope="row">
//                                 {index + 1}
//                             </TableCell>
//                             <TableCell align="right">{data.ip}</TableCell>
//                             <TableCell align="center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                                 <div className='w-10 h-10'>
//                                     {svgIconOs(data.os)}
//                                 </div>
//                             </TableCell>
//                             <TableCell align="right">{data.country}</TableCell>
//                             <TableCell  align="right">
//                                 <div  className='flex justify-center items-center'>
//                                     {svgIconBrowser(data.browser) ? (
//                                         <img className='w-10 h-10 rounded-full' src={svgIconBrowser(data.browser)} alt="browser" />
//                                     ) : (
//                                         <p>Unknown</p>
//                                     )}
//                                 </div>
//                             </TableCell>
//                             <TableCell align="right"><DateConverter date={data.date} /></TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//         </TableContainer>
//     );
// }


import * as React from 'react';
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



type TableLoginProps = {
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
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    console.log(loginInformation);
    

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 500 }}>
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
                        {loginInformation?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((data, index) => (
                            <TableRow
                                key={data._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {index + 1}
                                </TableCell>
                                <TableCell align="center">{data.ip}</TableCell>
                                <TableCell width={80} align="center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <div className='w-10 h-10'>
                                        {svgIconOs(data.os)}
                                    </div>
                                </TableCell>
                                <TableCell align="center">{data.country}</TableCell>
                                <TableCell width={80} align="center">
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
            {loginInformation?.length && (
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
        </Paper>
    );
}