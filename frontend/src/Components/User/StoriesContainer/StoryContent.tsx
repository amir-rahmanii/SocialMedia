import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { allStories } from "../../../hooks/story/story.types";
import Stories from 'react-insta-stories';
import DateConverterStory from '../../../utils/DateConverterStory';
import useDeleteData from '../../../hooks/useDeleteData';
import { userInformation } from '../../../hooks/user/user.types';
import useGetData from '../../../hooks/useGetData';

type StoryContentProps = {
    allStories: allStories;
    setIsShowStoryContent: (value: boolean) => void;
    isShowStoryContent: boolean;
    refetchGetAllStories?: any;
}

type StoryData = {
    _id: string;
    url: string;
    duration: number;
    header: {
        heading: string;
        subheading: string;
        profileImage: string;
    };
};

interface StoryDeleteData {
    storyId: string;
    mediaId: string;
}

function StoryContent({ refetchGetAllStories, allStories, setIsShowStoryContent, isShowStoryContent }: StoryContentProps) {
    const location = useLocation();
    const [storyData, setStoryData] = useState<StoryData[]>([]);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const navigate = useNavigate();

    const { mutate: deletePost } = useDeleteData<StoryDeleteData>(
        `story/deleteStory`,
        "Story Deleted successfully",
        () => {
            refetchGetAllStories();
            setIsShowStoryContent(false)
        }
    );

    const { data: myInfo, isSuccess } = useGetData<userInformation>(
        ["getMyUserInfo"],
        "users/user-information"
    );


    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const storyId = searchParams.get('storyid');
        const storyIndex = allStories.stories.findIndex(story => story._id === storyId);

        if (storyIndex !== -1) {
            updateStoryData(storyIndex);
        }
    }, [location.search, allStories]);

    const updateStoryData = (storyIndex: number) => {
        setCurrentStoryIndex(storyIndex);
        setCurrentMediaIndex(0); // Reset media index when switching users
        const selectedStory = allStories.stories[storyIndex];

        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('storyid', selectedStory._id);
        navigate({ search: searchParams.toString() });

        const formattedStories = selectedStory.media.map(mediaItem => ({
            _id: mediaItem._id,
            url: `${import.meta.env.VITE_API_BASE_URL}/${mediaItem.path}`,
            duration: 10000,
            header: {
                heading: selectedStory.user.username,
                subheading: DateConverterStory(selectedStory.createdAt) + "h",
                profileImage: `${import.meta.env.VITE_API_BASE_URL}/${selectedStory.user.userPicture.path}`
            },
        }));
        setStoryData(formattedStories);
    };

    const handleDeleteStory = (storyId: string, mediaId: string) => {
        deletePost({
            storyId,
            mediaId
        })
    };


    const handleBackgroundClick = () => {
        setIsShowStoryContent(false);
    };

    const onStoryEndHandler = () => {
        if (currentMediaIndex < storyData.length - 1) {
            setCurrentMediaIndex(currentMediaIndex + 1);
        } else if (currentStoryIndex < allStories.stories.length - 1) {
            updateStoryData(currentStoryIndex + 1);
        } else {
            setIsShowStoryContent(false);
        }
    };

    const onStoryPrevHandler = () => {
        if (currentMediaIndex > 0) {
            setCurrentMediaIndex(currentMediaIndex - 1);
        } else if (currentStoryIndex > 0) {
            updateStoryData(currentStoryIndex - 1);
        }
    };


    console.log(allStories.stories[currentStoryIndex].user);
    


    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-1000`}
            onClick={handleBackgroundClick}
        >
            <div className="relative w-[360px] h-[628px]" onClick={e => e.stopPropagation()}>
                {isShowStoryContent && storyData.length > 0 && (
                    <Stories
                        stories={storyData}
                        currentIndex={currentMediaIndex}
                        defaultInterval={10000}
                        width={360}
                        height={628}
                        keyboardNavigation={true}
                        onAllStoriesEnd={onStoryEndHandler}
                        onStoryEnd={onStoryEndHandler}
                        onPrevious={onStoryPrevHandler}
                    />
                )}

                {isSuccess && (
                    (myInfo?._id === allStories.stories[currentStoryIndex].user.id || myInfo?.role === "ADMIN") && (
                        <button
                            className="absolute top-4 right-4 bg-error-red text-white p-2 rounded-full z-1001"
                            onClick={e => {
                                e.stopPropagation();
                                const storyId = allStories.stories[currentStoryIndex]._id;
                                const mediaId = storyData[currentMediaIndex]._id; // اینجا از currentMediaIndex استفاده کنید
                                handleDeleteStory(storyId, mediaId);
                            }}>
                            Delete
                        </button>
                    )
                )}



            </div>
        </div>
    );
}

export default StoryContent;
