import React, { useEffect, useState } from 'react';
import useGetData from '../../hooks/useGetData';
import { userInformation } from '../../hooks/user/user.types';
import SkeletonTable from '../../Components/SkeletonTable/SkeletonTable';
import Table from '../../Components/Admin/Table/Table';
import { searchIcon } from '../../Components/SvgIcon/SvgIcon';
import ShowDialogModal from '../../Components/ShowDialogModal/ShowDialogModal';
import Modal from '../../Components/Admin/Modal/Modal';
import usePostData from '../../hooks/usePostData';
import { useQueryClient } from 'react-query';
import useDeleteData from '../../hooks/useDeleteData';
import UserTable from '../../Components/Admin/UserTable/UserTable';





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




    const changeRoleHandler = () => {
        changeRole({userId : infoUser?._id})
    }


    const deleteUserHandler = () => {
        deleteUser({userId : infoUser?._id})
    }


    const banUserHandler = () => {
        banUserToggle({userid : infoUser?._id})
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



    return (
        <>
            <div className="font-sans grid w-full">
                {isLoading ? (
                    <SkeletonTable />
                ) : (
                    <div className='bg-admin-navy rounded'>
                        <div className='px-6 pt-6 flex justify-between items-center'>
                            <h3 className='text-xl mb-6'>Users</h3>
                            <form className='flex items-center gap-4' onSubmit={e => e.preventDefault()}>
                                <button onClick={serchUsernameFilterHandler} className='text-admin-High w-5 h-5'>
                                    {searchIcon}
                                </button>
                                <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className='bg-transparent text-white outline-none' placeholder='search...' type="text" />
                            </form>
                        </div>
                        <Table columns={columns}>
                            <UserTable
                                information={filteredData || informationAllUser || []}
                                setIsShowChangeRole={setIsShowChangeRole}
                                setIsShowDeleteUser={setIsShowDeleteUser}
                                setIsShowBanUser={setIsShowBanUser}
                                setIsShowInfoUser={setIsShowInfoUser}
                                setIsInfoUser={setIsInfoUser}
                            />
                        </Table>
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
                    <p className='text-admin-low text-sm flex gap-1 items-center px-6'><span className='text-white font-bold text-base'>{infoUser?.postCount}</span>Posts</p>
                    <p className='text-admin-low text-sm flex gap-1 items-center px-6'><span className='text-white font-bold text-base'>{infoUser?.followers.length.toLocaleString()}</span>Followers</p>
                    <p className='text-admin-low text-sm flex gap-1 items-center px-6'><span className='text-white font-bold text-base'>{infoUser?.following.length.toLocaleString()}</span>Following</p>
                </div>
            </Modal>
        </>
    );
}
