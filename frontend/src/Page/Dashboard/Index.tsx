import React from 'react'
import BoxHome from '../../Components/Admin/BoxHome/BoxHome'
import useGetData from '../../hooks/useGetData'
import SpinLoader from '../../Components/SpinLoader/SpinLoader';
import { messageOutline, postsIconFill, profileIcon, ticketIcon } from '../../Components/SvgIcon/SvgIcon';
import OperatingSystemChart from '../../Components/Admin/OperatingSystemChart/OperatingSystemChart';
import MessagesByMonthChart from '../../Components/Admin/MessageByMonthChart/MessageByMonthChart';

interface CountGrowth {
  count: number;
  growth: number;
}

interface CountsResponse {
  users: CountGrowth;
  tickets: CountGrowth;
  messages: CountGrowth;
  posts: CountGrowth;
}

interface OsLoginCount {
  name: string;
  value: number;
}


export interface MessageCount {
  month: number;
  count: number;
}



function Index() {
  const { data: countModel, isLoading } = useGetData<CountsResponse>(
    ["useGetAllCountsModel"],
    "count/all-model"
  )

  const { data: totalOsCount, isSuccess: isSuccessTotalOsCount } = useGetData<OsLoginCount[]>(
    ["useGetTotalOsCount"],
    "count/total-os-count"
  )

  const { data: totalMessageCount, isSuccess: isSuccessTotalMessageCount } = useGetData<MessageCount[]>(
    ["useGetTotalMessageCount"],
    "count/total-message-count"
  )

  console.log(totalMessageCount);



  return (
    <>
      {isLoading ? (
        <SpinLoader />
      ) : (
        <div className='font-sans grid gap-8 w-full p-10'>
          <div className='grid grid-cols-4 gap-8'>
            <BoxHome svg={profileIcon} title="Users" count={countModel?.users.count || 0} growth={countModel?.users.growth || 0} />
            <BoxHome svg={ticketIcon} title="Tickets" count={countModel?.tickets.count || 0} growth={countModel?.tickets.growth || 0} />
            <BoxHome svg={messageOutline} title="Messages" count={countModel?.messages.count || 0} growth={countModel?.messages.growth || 0} />
            <BoxHome svg={postsIconFill} title="Posts" count={countModel?.posts.count || 0} growth={countModel?.posts.growth || 0} />
          </div>

          <div className='grid grid-cols-3 gap-8'>
            <div className='bg-admin-navy p-[30px]'>
              <p className='text-xl'>Operating System Chart</p>
              {isSuccessTotalOsCount && (
                <OperatingSystemChart totalOsCount={totalOsCount} />
              )}
            </div>
            <div className='bg-admin-navy p-[30px] col-span-2'>
              <p className='text-xl'>Messages By Month Chart</p>
              {isSuccessTotalMessageCount && (
                <MessagesByMonthChart totalMessageCount={totalMessageCount} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Index