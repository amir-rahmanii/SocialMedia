import React from 'react'
import { userInformation } from '../../../hooks/user/user.types'
import useGetData from '../../../hooks/useGetData';
import { banUser, changeRoleIcon, deleteIcon, eyeIcon, unBanUser } from '../../SvgIcon/SvgIcon';
import DateConverter from '../../../utils/DateConverter';

interface UserTableProps {
    information: userInformation[]; // آرایه‌ای از کاربران
    setIsShowChangeRole: (value: boolean) => void;
    setIsShowDeleteUser: (value: boolean) => void;
    setIsShowBanUser: (value: boolean) => void;
    setIsShowInfoUser: (value: boolean) => void;
    setIsInfoUser: (user: userInformation) => void;
    setUserId: (id: string) => void;
}



function UserTable({
    information,
    setIsShowChangeRole,
    setUserId,
    setIsShowDeleteUser,
    setIsShowBanUser,
    setIsShowInfoUser,
    setIsInfoUser
}: UserTableProps) {

    const { data: myInfo } = useGetData<userInformation>(
        ["getMyUserInfo"],
        "users/user-information"
    );


    return (
        <tbody className='h-[200px] overflow-auto' >
            {information?.map((data, index) => (
                <tr key={data._id} className={`border-y text-sm ${data.isban ? "bg-red-400/20" : "even:bg-[#313D4A] "} text-center border-[#2e3a47]`}>
                    <td className='py-[18px]  px-2 lg:px-1'>{index + 1}</td>
                    <td className='py-[18px]  px-2 lg:px-1'>
                        <div className='flex items-center gap-2 justify-center'>
                            <img loading='lazy' className='w-8 h-8 rounded-full object-cover' src={`http://localhost:4002/images/profiles/${data.profilePicture.filename}`} alt="profile" />
                            {data.username}
                        </div>
                    </td>
                    <td className='py-[18px]  px-2 lg:px-1'>{data.email}</td>
                    <td className='py-[18px]  px-2 lg:px-1'>{data.name}</td>
                    <td className='py-[18px]  px-2 lg:px-1'>
                        <div className='flex items-end justify-center gap-1.5'>
                            <span>{data.role}</span>

                        </div>
                    </td>
                    <td className='py-[18px]  px-2 lg:px-1'><DateConverter date={data.createdAt} /></td>
                    <td className='py-[18px]  px-2 lg:px-1'>
                        <div className='flex items-center justify-center gap-2'>
                            <button onClick={() => {
                                setIsInfoUser(data)
                                setIsShowInfoUser(true)
                            }} className={`w-4 h-4 text-admin-High hover:scale-110 hover:text-yellow-400 transition-all duration-300`}>{eyeIcon}</button>
                           
                            {(myInfo?._id !== data._id && data.username !== "Amirreza") && (
                                <button onClick={() => {
                                    setUserId(data._id)
                                    setIsShowChangeRole(true)
                                }} className='text-admin-High w-4 h-4  hover:scale-110 transition-all duration-300 hover:text-admin-low'>
                                    {changeRoleIcon}
                                </button>
                            )}
                            
                            {(myInfo?._id !== data._id && data.username !== "Amirreza") && (
                                <button onClick={() => {
                                    setUserId(data._id)
                                    setIsShowBanUser(true)
                                }} className={`w-4 h-4 text-admin-High hover:scale-110 ${data.isban ? "hover:text-green-400" : "hover:text-orange-400"} transition-all duration-300`}>{data.isban ? unBanUser : banUser}</button>
                            )}
                            
                            {(myInfo?._id !== data._id && data.username !== "Amirreza") && (
                                <button onClick={() => {
                                    setUserId(data._id)
                                    setIsShowDeleteUser(true)
                                }} className='w-4 h-4 text-admin-High hover:scale-110 hover:text-error-red transition-all duration-300'>{deleteIcon}</button>
                            )}
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    )
}

export default UserTable