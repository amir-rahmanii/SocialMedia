import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useGetAllStories } from "../../../hooks/story/useStory";
import { useState } from "react";
import AddNewStory from "../AddNewStory/AddNewStory";
import { plusIcon } from "../../SvgIcon/SvgIcon";
import StoryContent from "./StoryContent";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { userInformation } from "../../../hooks/user/user.types";
import useGetData from "../../../hooks/useGetData";

const StoriesContainer = () => {

    const { data: allStories, isSuccess } = useGetAllStories();
    const [showAddStory, setShowAddStory] = useState(false);
    const [isShowStoryContent, setIsShowStoryContent] = useState(false);

    const { data: myInfo, isSuccess: isSuccessMyInfo } = useGetData<userInformation>(
        ["getMyUserInfo"],
        "users/user-information"
    );

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToScroll: 3,
        variableWidth: true,
    };



    const navigate = useNavigate(); // Initialize useHistory

    // Function to handle story click and update URL with storyid as a query parameter
    const handleStoryClick = (storyId: string) => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('storyid', storyId);
        navigate({ search: searchParams.toString() });
    };







    return (
        <>
            <Slider {...settings} className="w-full overflow-x-auto  pt-2.5 pb-1 px-2.5 rounded">
                <div onClick={() => {
                    setShowAddStory(true)
                }} className="flex flex-col text-center justify-center items-center p-2 cursor-pointer">
                    <div className="w-[60px] h-[60px] md:w-[90px] md:h-[90px] rounded-full border-2 border-red-500 relative">
                        {isSuccessMyInfo && (
                            <img
                                loading="lazy"
                                className="rounded-full h-full w-full object-cover"
                                src={`http://localhost:4002/images/profiles/${myInfo.profilePicture.filename}`}
                                draggable="false"
                                alt="story"
                            />
                        )}
                        <button className='absolute bottom-0 right-0 w-6 h-6 bg-black rounded-full flex items-center justify-center'>
                            {plusIcon}
                        </button>
                    </div>
                    {isSuccessMyInfo && (
                        <span className="text-xs mt-2 text-black dark:text-white">{myInfo?.username}</span>
                    )}
                </div>
                {allStories?.stories?.map((s) => (
                    <div key={s._id}> {/* Ensure each story is in a separate div */}
                        <div onClick={() => {
                            setIsShowStoryContent(true)
                            handleStoryClick(s._id)
                        }} className="flex flex-col text-center justify-center items-center p-2 cursor-pointer">
                            <div className="w-[60px] h-[60px] md:w-[90px] md:h-[90px] rounded-full border-2 border-red-500">
                                <img
                                    loading="lazy"
                                    className="rounded-full h-full w-full object-cover"
                                    src={`http://localhost:4002/images/profiles/${s.user.userPicture.filename}`}
                                    draggable="false"
                                    alt="story"
                                />
                            </div>
                            <span className="text-xs mt-2 text-black dark:text-white">{s.user.username}</span>
                        </div>
                    </div>
                ))}

            </Slider>


            {(isShowStoryContent && isSuccess) && (
                <StoryContent setIsShowStoryContent={setIsShowStoryContent} isShowStoryContent={isShowStoryContent} allStories={allStories} />
            )}



            {showAddStory && (
                <AddNewStory showAddStory={showAddStory} setShowAddStory={setShowAddStory} />
            )}
        </>
    );
}

export default StoriesContainer
