import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { allStories } from "../../../hooks/story/story.types";
import Stories from 'react-insta-stories';
import DateConverterStory from '../../../utils/DateConverterStory';

type StoryContentProps = {
    allStories: allStories;
    setIsShowStoryContent: (value: boolean) => void;
    isShowStoryContent: boolean;
}

type StoryData = {
    url: string;
    duration: number;
    header: {
        heading: string;
        subheading: string;
        profileImage: string;
    };
};

function StoryContent({ allStories, setIsShowStoryContent, isShowStoryContent }: StoryContentProps) {
    const location = useLocation();
    const [storyData, setStoryData] = useState<StoryData[]>([]);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const navigate = useNavigate();

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
            url: `${import.meta.env.VITE_API_BASE_URL}/${mediaItem.path}`,
            duration: 10000,
            header: {
                heading: selectedStory.user.username,
                subheading: DateConverterStory(selectedStory.createdAt) + "h",
                profileImage: `${import.meta.env.VITE_API_BASE_URL}/${selectedStory.user.userPicture.path}`
            }
        }));
        setStoryData(formattedStories);
    };

    const handleBackgroundClick = () => {
        setIsShowStoryContent(false);
    };

    const onStoryEndHandler = () => {
        if (currentMediaIndex < storyData.length - 1) {
            // Move to the next media within the current story
            setCurrentMediaIndex(currentMediaIndex + 1);
        } else if (currentStoryIndex < allStories.stories.length - 1) {
            // Move to the next user's stories
            updateStoryData(currentStoryIndex + 1);
        } else {
            // Close the story content if this is the last user's story
            setIsShowStoryContent(false);
        }
    };

    const onStoryPrevHandler = () => {
        if (currentMediaIndex > 0) {
            // Move to the previous media within the current story
            setCurrentMediaIndex(currentMediaIndex - 1);
        } else if (currentStoryIndex > 0) {
            // Move to the previous user's stories
            updateStoryData(currentStoryIndex - 1);
        } else {
            // If it's the first story of the first user, do nothing or handle it as needed
            // setIsShowStoryContent(false)
        }
    };

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[1000]`}
            onClick={handleBackgroundClick}
        >
            <div className="relative w-[432px] h-[628px]" onClick={e => e.stopPropagation()}>
                {isShowStoryContent && storyData.length > 0 && (
                    <Stories
                        stories={storyData}
                        currentIndex={currentMediaIndex}
                        defaultInterval={10000}
                        width={432}
                        height={628}
                        keyboardNavigation={true}
                        onAllStoriesEnd={onStoryEndHandler}
                        onStoryEnd={onStoryEndHandler}
                        onPrevious={onStoryPrevHandler}
                    />
                )}
            </div>
        </div>
    );
}

export default StoryContent;
