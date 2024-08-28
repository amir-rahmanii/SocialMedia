import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { allStories, story } from "../../../hooks/story/story.type";


type allStoriesProps = {
    allStories : allStories
}

function StoryContent({ allStories } : allStoriesProps) {
    const location = useLocation();
    const [story, setStory] = useState<null | story>(null);

    useEffect(() => {
        // Parse the query parameters from the URL
        const searchParams = new URLSearchParams(location.search);
        const storyId = searchParams.get('storyid');

        if (storyId) {
            // Find the story by its ID
            const foundStory = allStories.stories?.find(s => s._id === storyId);
            if(foundStory){
                setStory(foundStory);
            }
        }
    }, [location.search, allStories]);

    return (
        <div>
            {story ? (
                <div>
                    <h2>{story.user.username}'s Story</h2>
                    {story.media.map((data , i) => (
                        <img key={i} src={`http://localhost:4002/images/story/${data.filename}`} alt="story" />
                    ))}
                </div>
            ) : (
                <div>Story not found or loading...</div>
            )}
        </div>
    );
}

export default StoryContent;