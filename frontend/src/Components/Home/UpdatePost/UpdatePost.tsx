import { Dialog, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../Context/AuthContext'
import { PostItemProps } from '../PostsContainer/PostsContainer'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import newPostSchema from '../../../Validation/newPost'
import EmojiPicker from '@emoji-mart/react'
import toast from 'react-hot-toast'
import { closeIcon, emojiIcon } from '../../SvgIcon/SvgIcon'
import { usePutUpdatePost } from '../../../hooks/post/usePost'
import IsLoaderBtn from '../../IsLoaderBtn/IsLoaderBtn'



type UpdatePostProps = {
    postInfo: PostItemProps,
    updatePost: boolean,
    setUpdatePost: (value: boolean) => void,
}



function UpdatePost({ postInfo, updatePost, setUpdatePost }: UpdatePostProps) {

    const authContext = useContext(AuthContext);
    const [postImage, setPostImage] = useState<File[]>([]);
    const [postPreview, setPostPreview] = useState<string[]>([]);
    const [description, setdescription] = useState(postInfo.description);
    const [showEmojis, setShowEmojis] = useState(false);
    // const [dragged, setDragged] = useState(false);

    const { mutate: updatedPost, isLoading, isError, error, isSuccess } = usePutUpdatePost();

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
            toast.success("Post Updated successfuly",
                {
                    icon: '✅',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            )
            setPostImage([])
            setPostPreview([])
            setdescription('')
            setUpdatePost(false)
        }
    }, [isError , isSuccess])

    const handleEmojiSelect = (emoji: any) => {
        setdescription(description + emoji.native)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (postImage.length === 5) {
            toast.error("You can't uplouded image more than 5")
        } else {
            if (e.target.files) {
                const files = Array.from(e.target.files);

                // Create previews for the files
                const previews: string[] = [];
                files.forEach(file => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        if (reader.result) {
                            previews.push(reader.result as string);
                            if (previews.length === files.length) {
                                // All previews have been processed
                                setPostPreview(prev => [...prev, ...previews]);
                            }
                        }
                    };
                    reader.readAsDataURL(file);
                });

                // Update state with new files
                setPostImage(prevFiles => [...prevFiles, ...files]);
            }
        }
    };

    // hook form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: postInfo.title,
            hashtags: postInfo.hashtags,
        },
        resolver: yupResolver(newPostSchema)
    });


    const removeImageFromFiles = (index: number) => {
        const newPostImages = [...postImage]
        const newPostPreview = [...postPreview]
        newPostImages.splice(index, 1)
        newPostPreview.splice(index, 1)
        setPostImage(newPostImages)
        setPostPreview(newPostPreview)
    }


    return (
        <Dialog open={updatePost} onClose={() => { setUpdatePost(false) }} maxWidth='xl'>
            <div className="flex flex-col xl:w-screen max-w-4xl">
                <div className="bg-white py-3 border-b px-4 flex justify-between w-full">
                    <span className="font-medium">Update post</span>
                    <button onClick={() => setUpdatePost(false)} className="font-medium w-5 h-5">{closeIcon}</button>
                </div>
                {/* <LinearProgress /> */}

                <div className="flex md:flex-row md:items-start items-center flex-col w-full">

                    {postImage.length > 0 ? (
                        <div className='grid grid-cols-3 gap-4 p-3'>
                            {postPreview.map((post, index) => (
                                <div key={index} className="bg-black relative h-52 w-full">
                                    <img draggable="false" className="object-contain h-full w-full" src={post as string} alt={`Preview ${index}`} />
                                    <button onClick={() => removeImageFromFiles(index)} className='absolute bottom-0 bg-black rounded-full'>❌</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='grid grid-cols-3 gap-4 p-3'>
                            {postInfo.media.map(data => (
                                <div key={data._id} className="bg-black relative h-52 w-full">
                                    <img draggable="false" className="object-contain h-full w-full" src={`http://localhost:4002/images/posts/${data.filename}`} alt="post" />
                                </div>
                            ))}
                        </div>

                    )}


                    <div className="flex flex-col border-l sm:h-[80vh] w-full bg-white">

                        <div className="flex gap-3 px-3 py-2 items-center">
                            <img draggable="false" className="w-11 h-11 rounded-full object-cover" src={`http://localhost:4002/images/profiles/${authContext?.user?.profilePicture.filename}`} alt="avatar" />
                            <span className="text-black text-sm font-semibold">{authContext?.user?.username}</span>
                        </div>


                        <div className="p-3 w-full border-b relative">
                            <div className='flex items-center'>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-[150px] text-sm text-white
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
                                    fullWidth
                                />
                                {errors.hashtags && <p className='text-error-red text-sm mt-1.5'> {errors.hashtags.message}</p>}
                            </div>

                            <textarea
                                className="outline-none w-full my-4 resize-none h-32 sm:h-auto"
                                placeholder="Write a discription..."
                                required
                                name="description"
                                value={description}
                                onChange={(e) => setdescription(e.target.value)}
                                onClick={() => setShowEmojis(false)}
                            >
                            </textarea>

                            <div className='my-2'>
                                <span onClick={() => setShowEmojis(!showEmojis)} className="cursor-pointer hidden sm:block">{emojiIcon}</span>

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

                                    if (!description.trim()) {
                                        toast.error("please fill the descreption")
                                        return
                                    }

                                    const formData = new FormData();
                                    formData.append('postid', postInfo._id);
                                    formData.append('title', data.title);
                                    formData.append('description', description);
                                    formData.append('hashtags', data.hashtags);
                                    // Append each selected file to the FormData object
                                    if(postImage.length > 0){
                                        postImage.forEach(file => formData.append('media', file));
                                    }

                                    updatedPost(formData)


                                })} disabled={isLoading} type="submit" className={`font-medium py-2 rounded text-white w-full  duration-300 transition-all ${isLoading ? "bg-primaryLoading-blue" : "bg-primary-blue hover:bg-primaryhover-blue"}`}>
                                    {isLoading ? <IsLoaderBtn /> : "Submit"}
                                </button>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

        </Dialog>
    )
}

export default UpdatePost