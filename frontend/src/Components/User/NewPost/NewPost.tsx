import { Dialog, TextField } from '@mui/material'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import EmojiPicker from '@emoji-mart/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import useGetData from '../../../hooks/useGetData';
import { userInformation } from '../../../hooks/user/user.types';
import usePostData from '../../../hooks/usePostData';
import newPostSchema from '../../../Validation/newPost';
import DialogHeader from '../../ShowDialogModal/DialogHeader/DialogHeader';
import { emojiIcon } from '../../SvgIcon/SvgIcon';
import IsLoaderBtn from '../../IsLoaderBtn/IsLoaderBtn';
import resizeImage from '../../../utils/resizeImage';


type NewPostProps = {
    newPost: boolean,
    setNewPost: (value: boolean) => void
}




function NewPost({ newPost, setNewPost }: NewPostProps) {

    const [postImage, setPostImage] = useState<File[]>([]);
    const [postPreview, setPostPreview] = useState<string[]>([]);
    const [description, setdescription] = useState("");
    const [showEmojis, setShowEmojis] = useState(false);
    const [dragged, setDragged] = useState(false);

    const { data: myInfo, isSuccess: isSuccessMyInfo } = useGetData<userInformation>(
        ["getMyUserInfo"],
        "users/user-information"
    );


    // const { userId } = useParams<string>();

    const queryClient = useQueryClient();
    const { mutate: addNewPost, isLoading } = usePostData(
        'posts/create-post',
        'Post Created successfuly',
        false,
        () => {
            reset();
            setPostImage([])
            setPostPreview([])
            setdescription('')
            setNewPost(false)
            queryClient.invalidateQueries(["getUserData"]);
            queryClient.invalidateQueries(["AllPostAllUsers"]);
        },
        true
    );



    const handleDragChange = () => {
        setDragged(!dragged);
    }

    const handleEmojiSelect = (emoji: any) => {
        setdescription(description + emoji.native)
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (postImage.length === 5) {
          toast.error("You can't upload more than 5 images");
        } else {
          if (e.target.files) {
            const files = Array.from(e.target.files);
      

            const resizedFiles = await Promise.all(
              files.map((file) => resizeImage(file, 300, 300))
            );
      

            setPostImage((prevFiles) => [...prevFiles, ...resizedFiles]);
      

            const previews = await Promise.all(
              resizedFiles.map((file) => {
                return new Promise<string>((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => {
                    resolve(reader.result as string);
                  };
                  reader.onerror = reject;
                  reader.readAsDataURL(file);
                });
              })
            );
      
            setPostPreview((prev) => [...prev, ...previews]);
          }
        }
      };

    const removeImageFromFiles = (index: number) => {
        const newPostImages = [...postImage]
        const newPostPreview = [...postPreview]
        newPostImages.splice(index, 1)
        newPostPreview.splice(index, 1)
        setPostImage(newPostImages)
        setPostPreview(newPostPreview)
    }




    // hook form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(newPostSchema)
    });


    return (
        <Dialog open={newPost} onClose={() => setNewPost(false)} maxWidth='xl'>
            <div className="flex flex-col xl:w-screen max-w-4xl border dark:border-gray-300/20 border-gray-300 ">
                <DialogHeader
                    title="New Post"
                    setIsOpenShowModal={setNewPost}
                />


                <div className=" bg-white dark:bg-black grid grid-cols-1 md:grid-cols-2 w-full">

                    {postImage.length > 0 ?
                        <div className='grid grid-cols-3 gap-4 p-3'>
                            {postPreview.map((post, index) => (
                                <div key={index} className="bg-white dark:bg-black relative h-52 w-full">
                                    <img draggable="false" className="object-contain h-full w-full" src={post as string} alt={`Preview ${index}`} />
                                    <button onClick={() => removeImageFromFiles(index)} className='absolute bottom-5 left-1 bg-black dark:bg-white p-1 rounded-full'>❌</button>
                                </div>
                            ))}
                        </div>
                        :
                        <div onDragEnter={handleDragChange} onDragLeave={handleDragChange} className={`${dragged && 'opacity-40'} relative bg-white dark:bg-black  h-36 md:h-[80vh] w-full flex flex-col gap-2 items-center justify-center px-16 text-black dark:text-white`}>
                            <svg aria-label="Icon to represent media such as images or videos" color="currentColor" fill="currentColor" height="77" role="img" viewBox="0 0 97.6 77.3" width="96"><path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" fill="currentColor"></path><path d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z" fill="currentColor"></path><path d="M78.2 41.6L61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6l-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z" fill="currentColor"></path></svg>
                            <p className="text-xl text-center">Drag photos and videos here</p>
                            <input
                                accept="image/*"
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="absolute h-full w-full opacity-0" />
                        </div>
                    }

                    <div className="flex flex-col border-l dark:border-gray-300/20 border-gray-300 md:h-[80vh] w-full bg-white dark:bg-black">

                        {isSuccessMyInfo && (
                            <div className="flex gap-3 px-3 py-2 items-center">
                                <img draggable="false" className="w-11 h-11 rounded-full object-cover" src={`http://localhost:4002/images/profiles/${myInfo?.profilePicture.filename}`} alt="avatar" />
                                <span className="text-black dark:text-white text-sm font-semibold">{myInfo?.username}</span>
                            </div>
                        )}




                        <form onSubmit={e => e.preventDefault} className="p-3 w-full border-b dark:border-gray-300/20 border-gray-300 relative">
                            <div className='flex items-center'>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-[150px] text-sm text-white
                                    dark:text-black
                            file:py-2 file:px-6
                            file:rounded-full file:border-0
                            file:text-sm file:cursor-pointer file:font-semibold
                            file:bg-purple-100 file:text-purple-700
                            hover:file:bg-purple-200
                            "/>
                                {/* <p className='text-sm text-slate-500'> {postImage ? postImage.name : "No file Choosen"}</p> */}
                            </div>
                            <div className='my-4'>
                                <TextField
                                    {...register('title')}
                                    label="title"
                                    type="title"
                                    name='title'
                                    required
                                    size="small"
                                    className=''
                                    fullWidth
                                />
                                {errors.title && <p className='text-error-red text-sm mt-1.5'> {errors.title.message}</p>}
                            </div>
                            <div className='my-4'>
                                <TextField
                                    {...register('hashtags')}
                                    label="hashtag"
                                    type="hashtags"
                                    name='hashtags'
                                    required
                                    size="small"
                                    className=''
                                    fullWidth
                                />
                                {errors.hashtags && <p className='text-error-red text-sm mt-1.5'> {errors.hashtags.message}</p>}
                            </div>

                            <TextField
                                className=" my-4"
                                placeholder="Write a discription..."
                                required
                                name="description"
                                value={description}
                                fullWidth
                                size="medium"
                                onChange={(e) => setdescription(e.target.value)}
                                onClick={() => setShowEmojis(false)}
                            >
                            </TextField>

                            <div className='my-2'>
                                <span onClick={() => setShowEmojis(!showEmojis)} className="cursor-pointer hidden sm:block w-6 h-6 text-black dark:text-white ">{emojiIcon}</span>

                                {showEmojis && (
                                    <div className="absolute top-0 -left-[360px] hidden sm:block">
                                        <EmojiPicker
                                            set="google"
                                            title="Emojis"
                                            onEmojiSelect={handleEmojiSelect}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <button onClick={handleSubmit((data) => {
                                    if (postImage.length == 0) {
                                        toast.error("please uploaded image")
                                        return
                                    }

                                    if (!description.trim()) {
                                        toast.error("please fill the descreption")
                                        return
                                    }

                                    const formData = new FormData();
                                    formData.append('title', data.title);
                                    formData.append('description', description);
                                    formData.append('hashtags', data.hashtags);
                                    // Append each selected file to the FormData object
                                    postImage.forEach(file => formData.append('media', file));

                                    addNewPost(formData)



                                })} disabled={isLoading} type="submit" className={`font-sans py-2 rounded text-white w-full  duration-300 transition-all ${isLoading ? "bg-primaryLoading-blue" : "bg-primary-blue hover:bg-primaryhover-blue"}`}>
                                    {isLoading ? <IsLoaderBtn /> : "Submit"}
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            </div>

        </Dialog>
    )
}

export default NewPost