import React, { useState } from 'react';
import useGetData from '../../hooks/useGetData';
import { userInformation } from '../../hooks/user/user.types';
import DateConverter from '../../utils/DateConverter';
import SkeletonTable from '../../Components/SkeletonTable/SkeletonTable';
import Table from '../../Components/Admin/Table/Table';
import { banUser, changeRoleIcon, deleteIcon, eyeIcon, searchIcon, unBanUser } from '../../Components/SvgIcon/SvgIcon';
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
    const [userId, setUserId] = useState("")
    const [searchValue, setSearchValue] = useState("")
    const [filteredData, setFilteredData] = useState<userInformation[] | null>(null)


    const { data: informationAllUser, isLoading } = useGetData<userInformation[]>(
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
        changeRole({ userId })
    }


    const deleteUserHandler = () => {
        deleteUser({ userId })
    }


    const banUserHandler = () => {
        banUserToggle({ userid: userId })
    }


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
            <div className="font-sans grid gap-8 w-full">
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
                                setUserId={setUserId}
                            />
                        </Table>
                    </div>
                )}
            </div>

            {/* change role */}
            <ShowDialogModal
                isOpenShowLDialogModal={isShowChangeRole}
                setisOpenShowLDialogModal={setIsShowChangeRole}
                title="Change Role"
                height="h-auto"
            >
                <Modal title='Are you sure you want to change the user role (Admin / User) ?' setisOpenModal={setIsShowChangeRole} submitHandler={changeRoleHandler} />
            </ShowDialogModal>

            {/* Delete User */}
            <ShowDialogModal
                isOpenShowLDialogModal={isShowDeleteUser}
                setisOpenShowLDialogModal={setIsShowDeleteUser}
                title="Delete User"
                height="h-auto"
            >
                <Modal title='Are you sure you want to Delete the user ?' setisOpenModal={setIsShowDeleteUser} submitHandler={deleteUserHandler} />
            </ShowDialogModal>

            {/* Ban and unBan User */}
            <ShowDialogModal
                isOpenShowLDialogModal={isShowBanUser}
                setisOpenShowLDialogModal={setIsShowBanUser}
                title="Ban/UnBan User"
                height="h-auto"
            >
                <Modal title='Are you sure you want to Ban/UnBan the user ?' setisOpenModal={setIsShowBanUser} submitHandler={banUserHandler} />
            </ShowDialogModal>

            {/* Info User */}
            <ShowDialogModal
                isOpenShowLDialogModal={isShowInfoUser}
                setisOpenShowLDialogModal={setIsShowInfoUser}
                title="info User"
                height="h-auto"
            >
                <div className='p-3 flex text-xl gap-6 justify-center my-3'>
                    <p>Followers : <span className='text-admin-High'>{infoUser?.followers ? infoUser?.followers.length.toLocaleString() : 0}</span></p>
                    <p>Following : <span className='text-admin-High'>{infoUser?.following ? infoUser?.following.length.toLocaleString() : 0}</span></p>
                </div>
            </ShowDialogModal>
        </>
    );
}
