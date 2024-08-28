import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Dialog } from '@mui/material';
import { closeIcon, deleteIcon, photoIcon } from '../../SvgIcon/SvgIcon';
import { usePostCreateStory } from '../../../hooks/story/useStory';
import IsLoaderBtn from '../../IsLoaderBtn/IsLoaderBtn';

type AddNewStoryProps = {
    showAddStory: boolean;
    setShowAddStory: (value: boolean) => void;
};

function AddNewStory({ showAddStory, setShowAddStory }: AddNewStoryProps) {
    const [postImage, setPostImage] = useState<File | null>(null);
    const [postPreview, setPostPreview] = useState<string | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const { mutate: addNewStory, isLoading, isError, error, isSuccess } = usePostCreateStory();

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


    useEffect(() => {
        if (isError) {
            if (error && (error as any).response) {
                toast.error((error as any).response.data.error.message,
                    {
                        icon: '❌',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                )
            }
        }

        if (isSuccess) {
            toast.success("Story Uploaded successfuly",
                {
                    icon: '✅',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            )
            setPostImage(null)
            setPostPreview(null)
            setShowAddStory(false)
        }
    }, [isError, isSuccess])


    return (
        <Dialog open={showAddStory} onClose={() => setShowAddStory(false)} maxWidth='xl'>
            <div className="flex flex-col max-w-4xl">
                <div className="bg-white py-3 border-b px-4 flex justify-between w-full">
                    <span className="font-medium">Create new Story</span>
                    <button onClick={() => setShowAddStory(false)} className="font-medium ml-5 w-5 h-5">{closeIcon}</button>
                </div>

                <div className="flex items-center flex-col w-full">


                    {isCameraActive && (
                        <div className="relative bg-white h-96 w-full flex flex-col gap-2 items-center justify-center mx-16">
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
                            {!isCameraActive  && (
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
                                }} className="text-white font-medium p-2 gap-1 rounded   flex items-center bg-red-500 mt-2">
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



                                })} disabled={isLoading} type="submit" className={`font-medium py-2 px-4 rounded text-white w-full  duration-300 transition-all ${isLoading ? "bg-primaryLoading-blue" : "bg-primary-blue hover:bg-primaryhover-blue"}`}>
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

export default AddNewStory;