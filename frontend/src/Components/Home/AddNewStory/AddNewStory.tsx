import React, {  useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Dialog } from '@mui/material';
import { closeIcon, deleteIcon, photoIcon } from '../../SvgIcon/SvgIcon';
import IsLoaderBtn from '../../IsLoaderBtn/IsLoaderBtn';
import usePostData from '../../../hooks/usePostData';
import { useQueryClient } from 'react-query';

type AddNewStoryProps = {
    showAddStory: boolean;
    setShowAddStory: (value: boolean) => void;
};

function AddNewStory({ showAddStory, setShowAddStory }: AddNewStoryProps) {
    const [postImage, setPostImage] = useState<File | null>(null);
    const [postPreview, setPostPreview] = useState<string | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const queryClient = useQueryClient();
    const { mutate: addNewStory, isLoading } = usePostData(
        'story/createStory',
        "Story Uploaded successfuly",
        false,
        () => {
            setPostImage(null);
            setPostPreview(null);
            setShowAddStory(false);
            queryClient.invalidateQueries(["getAllStories"]);
        },
        true
    );

    const handleStartCamera = async () => {
        try {
            setIsCameraActive(true);
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    if (videoRef.current) {
                        videoRef.current.play();
                    }
                };
            }
        } catch (err) {
            setShowAddStory(false)
            toast.error("Could not access the camera. Please check camera permissions.");
        }
    };

    const handleCapturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(blob => {
                    if (blob) {
                        const file = new File([blob], "captured-image.png", { type: 'image/png' });
                        setPostImage(file);
                        setPostPreview(URL.createObjectURL(file));
                        setIsCameraActive(false)
                    }
                }, 'image/png');
            }
        }
    };

    return (
        <Dialog open={showAddStory} onClose={() => setShowAddStory(false)} maxWidth='xl'>
            <div className="flex flex-col max-w-4xl border dark:border-gray-300/20 border-gray-300 ">
                <div className="bg-white dark:bg-black py-3 border-b dark:border-gray-300/20 border-gray-300  px-4 flex justify-between w-full">
                    <span className="font-sans text-black dark:text-white ">Create new Story</span>
                    <button onClick={() => setShowAddStory(false)} className="text-black dark:text-white  font-sans ml-5 w-5 h-5">{closeIcon}</button>
                </div>

                <div className="flex items-center bg-white dark:bg-black flex-col w-full">


                    {isCameraActive && (
                        <div className="relative bg-white dark:bg-black h-[500px]  md:max-h-[600px] w-full flex flex-col gap-2 items-center justify-center mx-16">
                            <video ref={videoRef} autoPlay className="w-full h-full object-cover"></video>
                            <button onClick={handleCapturePhoto} className="absolute bottom-2 bg-primary-blue hover:bg-primaryLoading-blue transition-all duration-300 text-white  py-2 px-4 rounded-full">
                                <div className='w-7 h-7'>
                                    {photoIcon}
                                </div>
                            </button>
                        </div>
                    )}


                    {!postPreview && (
                        <>
                            {!isCameraActive && (
                                <button onClick={handleStartCamera} className="my-6 bg-blue-500 text-white py-2 px-4 rounded">
                                    Open Camera
                                </button>
                            )}
                        </>
                    )}

                    {postPreview && (
                        <>
                            <div className="mt-4 flex flex-col justify-start items-center">
                                <img src={postPreview} alt="Captured Preview" className="w-full h-auto" />
                                <button onClick={() => {
                                    setPostImage(null);
                                    setPostPreview(null);
                                    handleStartCamera()
                                }} className="text-white font-sans p-2 gap-1 rounded   flex items-center bg-red-500 mt-2">
                                    Remove Photo
                                    <div className='w-5 h-5'>
                                        {deleteIcon}

                                    </div>
                                </button>
                            </div>
                            <div className="flex items-center justify-between my-6">
                                <button onClick={(() => {
                                    if (!postImage) {
                                        toast.error("please take photo", {
                                            icon: '❌',
                                            style: {
                                                borderRadius: '10px',
                                                background: '#333',
                                                color: '#fff',
                                            },
                                        })
                                        return
                                    }

                                    const formData = new FormData();


                                    formData.append('storyMedia', postImage);
                                    addNewStory(formData)



                                })} disabled={isLoading} type="submit" className={`font-sans py-2 px-4 rounded text-white w-full  duration-300 transition-all ${isLoading ? "bg-primaryLoading-blue" : "bg-primary-blue hover:bg-primaryhover-blue"}`}>
                                    {isLoading ? <IsLoaderBtn /> : "Upload"}
                                </button>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </Dialog>
    );
}

export default React.memo(AddNewStory);