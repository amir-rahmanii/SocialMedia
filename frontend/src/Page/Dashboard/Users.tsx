import { useEffect, useState } from 'react';
import useGetData from '../../hooks/useGetData';
import { userInformation } from '../../hooks/user/user.types';
import SkeletonTable from '../../Components/SkeletonTable/SkeletonTable';
import Table from '../../Components/Admin/Table/Table';
import { banUser, changeRoleIcon, deleteIcon, eyeIcon, searchIcon, unBanUser } from '../../Components/SvgIcon/SvgIcon';
import Modal from '../../Components/Admin/Modal/Modal';
import usePostData from '../../hooks/usePostData';
import { useQueryClient } from 'react-query';
import useDeleteData from '../../hooks/useDeleteData';
import DateConverter from '../../utils/DateConverter';





export default function Users() {
    const columns: string[] = [
        "#",
        "Username",
        "Email",
        "Name",
        "Role",
        "JoinedAt",
        "Action"
    ]
    const [isShowChangeRole, setIsShowChangeRole] = useState(false)
    const [isShowDeleteUser, setIsShowDeleteUser] = useState(false)
    const [isShowBanUser, setIsShowBanUser] = useState(false)
    const [isShowInfoUser, setIsShowInfoUser] = useState(false)
    const [infoUser, setIsInfoUser] = useState<userInformation | null>(null)
    const [searchValue, setSearchValue] = useState("")
    const [filteredData, setFilteredData] = useState<userInformation[] | null>(null)


    const { data: informationAllUser, isLoading, isSuccess } = useGetData<userInformation[]>(
        ["getAllUserInfo"],
        "users/all-users"
    );





    const queryClient = useQueryClient();
    const { mutate: changeRole } = usePostData(
        'users/change-role',
        "User role changed successfuly",
        true,
        () => {
            queryClient.invalidateQueries(["getAllUserInfo"])
            setIsShowChangeRole(false)
        }
    )

    const { mutate: banUserToggle } = usePostData(
        'users/user-ban-toggle',
        "User baned/UnBaned successfuly",
        false,
        () => {
            queryClient.invalidateQueries(["getAllUserInfo"])
            setIsShowBanUser(false)
        }
    )

    const { mutate: deleteUser } = useDeleteData(
        'users/delete-user',
        "User Deleted successfuly",
        () => {
            queryClient.invalidateQueries(["getAllUserInfo"])
            setIsShowDeleteUser(false)
        }
    )


    const { data: myInfo } = useGetData<userInformation>(
        ["getMyUserInfo"],
        "users/user-information"
    );




    const changeRoleHandler = () => {
        changeRole({ userId: infoUser?._id })
    }


    const deleteUserHandler = () => {
        deleteUser({ userId: infoUser?._id })
    }


    const banUserHandler = () => {
        banUserToggle({ userid: infoUser?._id })
    }

    useEffect(() => {
        isSuccess && serchUsernameFilterHandler();
    }, [searchValue])


    const serchUsernameFilterHandler = () => {
        if (searchValue.trim()) {
            const regex = new RegExp(searchValue, 'i');
            const newInformationAllUser = informationAllUser?.filter(data =>
                regex.test(data.username) || regex.test(data.email) || regex.test(data.name)
            );
            setFilteredData(newInformationAllUser || null);
        } else {
            setFilteredData(informationAllUser || []);
        }
    };

    useEffect(() => {
        isSuccess && setFilteredData(informationAllUser)

    }, [informationAllUser])



    return (
        <>
            <div className="font-sans grid overflow-auto max-w-[710px] md:max-w-full md:w-full">
                {isLoading ? (
                    <SkeletonTable />
                ) : (
                    <div className='bg-admin-navy rounded'>
                        <h3 className='text-xl px-6 pt-6'>Users</h3>
                        <div className='px-6 pt-6 flex justify-end items-center'>
                            <form className='flex items-center gap-4' onSubmit={e => e.preventDefault()}>
                                <button onClick={serchUsernameFilterHandler} className='text-admin-High w-5 h-5'>
                                    {searchIcon}
                                </button>
                                <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className='bg-transparent text-white outline-none' placeholder='search...' type="text" />
                            </form>
                        </div>
                        {filteredData && filteredData?.length > 0 ? (
                            <Table columns={columns}>
                                <tbody className='h-[200px] overflow-auto' >
                                    {filteredData?.map((data, index) => (
                                        <tr key={data._id} className={`border-y text-sm ${data.isban ? "bg-red-400/20" : "even:bg-[#313D4A] "} text-center border-[#2e3a47]`}>
                                            <td className='py-[18px]  px-2 lg:px-1'>{index + 1}</td>
                                            <td className='py-[18px]  px-2 lg:px-1'>
                                                <div className='flex items-center gap-2 justify-center'>
                                                    <img loading='lazy' className='w-8 h-8 rounded-full object-cover' src={`${import.meta.env.VITE_API_BASE_URL}/${data.profilePicture.path}`} alt="profile" />
                                                    {data.username}
                                                </div>
                                            </td>
                                            <td className='py-[18px]  px-2 lg:px-1'>{data.email}</td>
                                            <td className='py-[18px]  px-2 lg:px-1'>{data.name}</td>
                                            <td className='py-[18px]  px-2 lg:px-1'>{data.role}</td>
                                            <td className='py-[18px]  px-2 lg:px-1'><DateConverter date={data.createdAt} /></td>
                                            <td className='py-[18px]  px-2 lg:px-1'>
                                                <div className='flex items-center justify-center gap-2'>
                                                    <button onClick={() => {
                                                        setIsInfoUser(data)
                                                        setIsShowInfoUser(true)
                                                    }} className={`w-4 h-4 text-admin-High hover:scale-110 hover:text-yellow-400 transition-all duration-300`}>{eyeIcon}</button>

                                                    {(myInfo?._id !== data._id && data.username !== "Amirreza") && (
                                                        <button onClick={() => {
                                                            setIsInfoUser(data)
                                                            setIsShowChangeRole(true)
                                                        }} className='text-admin-High w-4 h-4  hover:scale-110 transition-all duration-300 hover:text-admin-low'>
                                                            {changeRoleIcon}
                                                        </button>
                                                    )}

                                                    {(myInfo?._id !== data._id && data.username !== "Amirreza") && (
                                                        <button onClick={() => {
                                                            setIsInfoUser(data)
                                                            setIsShowBanUser(true)
                                                        }} className={`w-4 h-4 text-admin-High hover:scale-110 ${data.isban ? "hover:text-green-400" : "hover:text-orange-400"} transition-all duration-300`}>{data.isban ? unBanUser : banUser}</button>
                                                    )}

                                                    {(myInfo?._id !== data._id && data.username !== "Amirreza") && (
                                                        <button onClick={() => {
                                                            setIsInfoUser(data)
                                                            setIsShowDeleteUser(true)
                                                        }} className='w-4 h-4 text-admin-High hover:scale-110 hover:text-error-red transition-all duration-300'>{deleteIcon}</button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <div>
                                <p className='text-center text-xl py-3'>
                                    No user found with this username or name or email 😩
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* change role */}
            <Modal
                isYesOrNo={true}
                title={`Are you sure you want to change ${infoUser?.username} role to ${infoUser?.role === "ADMIN" ? "USER" : "ADMIN"} ?`}
                setisOpenModal={setIsShowChangeRole}
                isOpenModal={isShowChangeRole}
                btnNoTitle="keep the roll"
                btnYesTitle={`Change ${infoUser?.username} role`}
                isAttention={false}
                submitHandler={changeRoleHandler} />


            {/* Delete User */}
            <Modal
                isYesOrNo={true}
                title={`Are you sure you want to Delete ${infoUser?.username} ?`}
                setisOpenModal={setIsShowDeleteUser}
                isOpenModal={isShowDeleteUser}
                btnNoTitle={`keep the ${infoUser?.username}`}
                btnYesTitle={`Delete ${infoUser?.username}`}
                isAttention={true}
                submitHandler={deleteUserHandler} />

            {/* Ban and unBan User */}

            <Modal
                isYesOrNo={true}
                title={`Are you sure you want to ${infoUser?.isban ? "unBan" : "Ban"} ${infoUser?.username} ?`}
                setisOpenModal={setIsShowBanUser}
                isOpenModal={isShowBanUser}
                btnYesTitle={`${infoUser?.isban ? "unBan" : "Ban"} ${infoUser?.username}`}
                isAttention={false}
                submitHandler={banUserHandler} />


            {/* Info User */}
            <Modal
                isYesOrNo={false}
                isOpenModal={isShowInfoUser}
                setisOpenModal={setIsShowInfoUser}
            >
                <div>
                    <p className='text-xl font-bold text-admin-High'>{infoUser?.username} Information :</p>
                </div>
                <div className='bg-[#37404F] my-4 border border-[#2E3A47] flex justify-center rounded-md divide-x divide-[#2E3A47] p-2.5'>
                    <p className='text-admin-low text-sm flex gap-1 items-center px-3'><span className='text-white font-bold text-base'>{infoUser?.postCount}</span>Posts</p>
                    <p className='text-admin-low text-sm flex gap-1 items-center px-3'><span className='text-white font-bold text-base'>{infoUser?.followers.length.toLocaleString()}</span>Followers</p>
                    <p className='text-admin-low text-sm flex gap-1 items-center px-3'><span className='text-white font-bold text-base'>{infoUser?.following.length.toLocaleString()}</span>Following</p>
                </div>
            </Modal>
        </>
    );
}
