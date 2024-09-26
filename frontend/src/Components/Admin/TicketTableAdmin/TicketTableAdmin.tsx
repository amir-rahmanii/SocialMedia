import React, { Dispatch, SetStateAction } from 'react'
import { closeIcon, deleteIcon, editPostIcon } from '../../SvgIcon/SvgIcon'
import { ticketUser } from '../../../hooks/ticket/tickets.types'
import { response } from '../../User/TableTicket/TableTicket';
import DateConverter from '../../../utils/DateConverter';

type TicketTableAdminProps = {
  allTicket: ticketUser[];
  setInfoTicket: Dispatch<SetStateAction<ticketUser | null>>;
  setIsShowResponseTicket: (value: boolean) => void;
  setAnswerInfo: (responses: response[]) => void; // Updated to accept an array of responses
  setIsShowDeleteTicket: (value: boolean) => void;
  setIsShowClosedTicket: (value: boolean) => void;
};

function TicketTableAdmin({
  allTicket,
  setInfoTicket,
  setIsShowResponseTicket,
  setAnswerInfo,
  setIsShowClosedTicket,
  setIsShowDeleteTicket,
} : TicketTableAdminProps) {
  return (
    <tbody className='h-[200px] overflow-auto' >
      {allTicket?.map((data, index) => (
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
  )
}

export default TicketTableAdmin