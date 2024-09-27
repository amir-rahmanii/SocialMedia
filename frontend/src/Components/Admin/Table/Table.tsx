import React, { PropsWithChildren } from 'react'

type TableProps = {
    columns: string[],
    children: React.ReactNode
}


const Table: React.FC<PropsWithChildren<TableProps>> = ({ columns, children }) => {
    return (
        <div className='bg-admin-navy  px-6 pb-[30px] pt-[15px] rounded'>
            <div className='max-h-[450px] overflow-auto'>
                <table className='w-full table-auto '>
                    <thead className='text-admin-High text-center '>
                        <tr className='border-y border-[#2e3a47]'>
                            {columns.map((col, index) => (
                                <th key={index} className='py-[18px] px-2 lg:px-0'>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    {children}
                </table>
            </div>
        </div>
    )
}

export default Table