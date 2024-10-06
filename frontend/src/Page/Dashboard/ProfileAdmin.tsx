import React from 'react'
import useGetData from '../../hooks/useGetData';
import { userInformation } from '../../hooks/user/user.types';
import SpinLoader from '../../Components/SpinLoader/SpinLoader';
import { faceBookIcon, GitHubIcon, GlobeIcon, linkedin, photosIcon, twiterIcon } from '../../Components/SvgIcon/SvgIcon';
import { useQueryClient } from 'react-query';
import usePostData from '../../hooks/usePostData';
import resizeImage from '../../utils/resizeImage';

function ProfileAdmin() {

  const { data: myInfo, isLoading: isLoading } = useGetData<userInformation>(
    ["getMyUserInfo"],
    "users/user-information"
  );


  const queryClient = useQueryClient();

  const { mutate: updateProfilePicture } = usePostData('users/update-profile-picture'
    , 'Profile picture updated successfuly!'
    , true,
    () => {
      queryClient.invalidateQueries(["getMyUserInfo"]);
    }, true);

  const fileChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const imgFile = e.target.files[0];

      try {
        const resizedImage = await resizeImage(imgFile, 300, 300); // Resizing to 300x300
        const formData = new FormData();
        formData.append('profilePicture', resizedImage);
        updateProfilePicture(formData);
      } catch (error) {
        console.error('Error resizing image:', error);
      }
    }
  };


  return (
    <>
      {isLoading ? (
        <SpinLoader />
      ) : (
        <div className='font-sans grid w-full'>
          <h3 className='text-2xl font-bold mb-6'>Profile</h3>
          <div className='w-full rounded bg-admin-navy pb-8'>
            {/* bg  */}
            <div className='relative'>
              <img src="/images/cover.png" alt="profile cover" className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center" />
              {/* profile */}

              <div className="-translate-y-1/2 z-30 mx-auto w-full max-w-30 rounded-full bg-white/20  backdrop-blur h-44 max-w-44 p-3">
                <div className="relative drop-shadow-2">
                  <img className='rounded-full' loading='lazy' src={`${import.meta.env.VITE_API_BASE_URL}/${myInfo?.profilePicture.path}`} alt="profile" />
                  <label htmlFor="profile" className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2">
                    <div className='bg-[#4E60E2] hover:scale-110 transition-all duration-300 rounded-full w-[34px] h-[34px] flex items-center justify-center'>
                      {photosIcon}
                    </div>
                    <input onChange={fileChangeHandler} type="file" name="profile" id="profile" className="sr-only" />
                  </label>
                </div>
              </div>
            </div>
            {/* about me */}
            <div className='flex justify-center flex-col items-center -mt-16'>
              <p className='text-2xl font-bold'>{myInfo?.username}</p>
              <p className='text-base font-bold text-admin-High mt-1'>Frontend Developer</p>
              <div className='bg-[#37404F] mt-4 border border-[#2E3A47] flex rounded-md divide-x divide-[#2E3A47] p-2.5'>
                <p className='text-admin-low text-sm flex gap-1 items-center px-6'><span className='text-white font-bold text-base'>{myInfo?.postCount}</span>Posts</p>
                <p className='text-admin-low text-sm flex gap-1 items-center px-6'><span className='text-white font-bold text-base'>{myInfo?.followers.length.toLocaleString()}</span>Followers</p>
                <p className='text-admin-low text-sm flex gap-1 items-center px-6'><span className='text-white font-bold text-base'>{myInfo?.following.length.toLocaleString()}</span>Following</p>
              </div>
              <p className='text-base my-6 font-bold'>About me</p>
              <div className='flex justify-center items-center max-w-[720px] text-center'>
                <p className='text-admin-low'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris tempus ut. Donec fermentum blandit aliquet. Etiam dictum dapibus ultricies. Sed vel aliquet libero. Nunc a augue fermentum, pharetra ligula sed, aliquam lacus.</p>
              </div>
              <p className='text-base my-6 font-bold'>Follow Me On</p>
              <div className="flex items-center justify-center gap-3.5 ">
                {/* Repeat similar structure for other icons */}
                <div className='text-admin-High cursor-pointer hover:text-[#4E60E2] hover:scale-110 duration-300 transition-all'>
                  {faceBookIcon}
                </div>
                <div className='text-admin-High cursor-pointer hover:text-[#4E60E2] hover:scale-110 duration-300 transition-all'>
                  {twiterIcon}
                </div>
                <div className='text-admin-High cursor-pointer hover:text-[#4E60E2] hover:scale-110 duration-300 transition-all'>
                  {linkedin}
                </div>
                <div className='text-admin-High cursor-pointer hover:text-[#4E60E2] hover:scale-110 duration-300 transition-all'>
                  {GlobeIcon}
                </div>
                <div className='text-admin-High cursor-pointer hover:text-[#4E60E2] hover:scale-110 duration-300 transition-all'>
                  {GitHubIcon}
                </div>
              </div>
            </div>
          </div>
        </div>

      )}
    </>
  )
}

export default ProfileAdmin