import { ClickAwayListener } from '@mui/material'
import React, { useContext } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { profileIcon, savedIcon, settingsIcon, switchAccountIcon } from '../../SvgIcon/SvgIcon';
import { AuthContext } from '../../../Context/AuthContext';

type ProfileDetailsProps = {
    setProfileToggle: (value: boolean) => void;
}

const ProfileDetails = ({setProfileToggle} : ProfileDetailsProps) => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext)
    

    const tabs = [
        {
            title: "Profile",
            icon: profileIcon,
            redirect: `/profile/${authContext?.user?._id}`
        },
        {
            title: "Change Password",
            icon: switchAccountIcon,
            redirect: `/update-password`
        },
        {
            title: "Settings",
            icon: settingsIcon,
            redirect: "/accounts/edit"
        },
    ]

    const handleLogout = () => {
        navigate("/login");
        toast.success("Logout Successfully");
    }

  return (
    <ClickAwayListener onClickAway={() => setProfileToggle(false)}>
    <div className="absolute w-56 bg-white rounded  drop-shadow top-14 right-3 sm:right-8  md:right-10 lg:right-10 xl:right-72  md:top-14 border">
        <div className="flex flex-col w-full overflow-hidden">
            {tabs.map((el, i) => (
                <Link to={el.redirect} className="flex items-center gap-3 p-2.5 text-sm pl-4 cursor-pointer hover:bg-gray-50 duration-300 transition-all" key={i}>
                    {el.icon}
                    {el.title}
                </Link>
            ))}
            <button onClick={handleLogout} className="flex rounded-b border-t-2 items-center gap-3 p-2.5 text-sm pl-4 cursor-pointer hover:bg-gray-50 duration-300 transition-all">
                Logout
            </button>
        </div>
    </div>
</ClickAwayListener>
  )
}

export default ProfileDetails