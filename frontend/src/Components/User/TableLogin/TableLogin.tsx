import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
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
    return (
        <TableContainer component={Paper} className='max-h-64 overflow-y-auto rounded'>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Login Info</TableCell>
                        <TableCell align="right">IP</TableCell>
                        <TableCell align="right">Operating System</TableCell>
                        <TableCell align="right">Country</TableCell>
                        <TableCell align="right">Browser</TableCell>
                        <TableCell align="right">Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loginInformation?.map((data, index) => (
                        <TableRow
                            key={data._id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {index + 1}
                            </TableCell>
                            <TableCell align="right">{data.ip}</TableCell>
                            <TableCell align="center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div className='w-10 h-10'>
                                    {svgIconOs(data.os)}
                                </div>
                            </TableCell>
                            <TableCell align="right">{data.country}</TableCell>
                            <TableCell  align="right">
                                <div  className='flex justify-center items-center'>
                                    {svgIconBrowser(data.browser) ? (
                                        <img className='w-10 h-10 rounded-full' src={svgIconBrowser(data.browser)} alt="browser" />
                                    ) : (
                                        <p>Unknown</p>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell align="right"><DateConverter date={data.date} /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}