import { useEffect, useState } from 'react'
import SkeletonTable from '../../Components/SkeletonTable/SkeletonTable'
import {  FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { Post } from '../../hooks/post/post.types';
import useGetData from '../../hooks/useGetData';
import Table from '../../Components/Admin/Table/Table';
import { deleteIcon, eyeIcon, searchIcon } from '../../Components/SvgIcon/SvgIcon';
import DateConverter from '../../utils/DateConverter';
import Modal from '../../Components/Admin/Modal/Modal';
import Slider from 'react-slick';
import useDeleteData from '../../hooks/useDeleteData';
import { useLocation, useNavigate } from 'react-router-dom';


type Comments = {
    createdAt: Date,
    updatedAt: string,
    content: string,
    postid: string,
    title: string,
    userPicture: { path: string, filename: string },
    userid: string,
    username: string,
    _id: string
}

// use query for filtering
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};


function PostsAdmin() {

    const query = useQuery();

    const columns: string[] = [
        "#",
        "Username",
        "ShowPost",
        "Comment",
        "Like",
        "CreatedAt",
        "Action"
    ]

    const [searchValue, setSearchValue] = useState("")
    const [infoPost, setIsInfoPost] = useState<Post | null>(null)
    const [isShowPost, setIsShowPost] = useState(false)
    const [isShowDeletePost, setIsShowDeletePost] = useState(false)
    const [isShowLikedPost, setIsShowLikedPost] = useState(false)
    const [isShowCommentPost, setIsShowCommentPost] = useState(false)
    const [isShowCommentMsg, setIsShowCommentMsg] = useState(false)
    const [commentInfo, setCommentInfo] = useState<Comments | null>(null)
    const [allComment, setAllComment] = useState<Comments[] | null>(null)
    const [isShowDeleteComment, setIsShowDeleteComment] = useState(false)
    const [filteredData, setFilteredData] = useState<Post[] | null>(null)
    const [sortedBy, setSortedBy] = useState(query.get('sortedBy') || "New");
    const navigate = useNavigate();

    const { data: allPosts, isLoading, isSuccess, refetch: refetchAllPosts } = useGetData<Post[]>(
        ['AllPostAllUsers'],
        'posts/get-all-posts'
    );

    const { mutate: deletePost } = useDeleteData(
        `posts/delete-post`,
        "Post Deleted successfully",
        () => {
            setIsShowDeletePost(false);

            // حذف پست از داده‌های موجود
            const updatedPosts = allPosts?.filter(post => post._id !== infoPost?._id) || [];
            setFilteredData(updatedPosts.length > 0 ? updatedPosts : null);

            refetchAllPosts();
        }
    );

    const { mutate: deleteComment } = useDeleteData(
        `posts/delete-comment`,
        "Comment Deleted successfully",
        () => {
            setIsShowDeleteComment(false)
            refetchAllPosts();
        }
    );


    const serchUsernameFilterHandler = () => {
        if (searchValue.trim()) {
            const regex = new RegExp(searchValue, 'i');
            const newAllMessagess = allPosts?.filter(data =>
                regex.test(data.user.username)
            );
            setFilteredData(newAllMessagess || null);
        } else {
            setFilteredData(allPosts || []);
        }
    };



    useEffect(() => {
        isSuccess && serchUsernameFilterHandler();
    }, [searchValue])


    useEffect(() => {
        if (allPosts && isSuccess) {
            filterDataHandler(allPosts);
        }
    }, [allPosts, isSuccess, location.search, sortedBy]);




    // setting react slick
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };


    const deletePostHandler = () => {
        deletePost({ postid: infoPost?._id })
    }

    const deleteCommentHandler = () => {
        deleteComment({ commentid: commentInfo?._id });
        if (allComment) {
            let newAllComment = [...allComment]
            let allCommentFilter = newAllComment?.filter(comment => comment._id !== commentInfo?._id);
            setAllComment(allCommentFilter)
        }
    }


    const handleChangeSortBy = (e: SelectChangeEvent<string>) => {
        const selectedValue = e.target.value as string;
        setSortedBy(selectedValue);  // Update state first

        const params = new URLSearchParams();
        params.set('sortedBy', selectedValue);
        navigate(`?${params.toString()}`);  // Update URL

        // همگام سازی با استیت پس از تغییرات URL
        const querySortedBy = query.get('sortedBy') || "New";
        setSortedBy(querySortedBy);
    };



    const filterDataHandler = (allPosts: Post[]) => {
        if (allPosts) {

            const querySortedBy = query.get('sortedBy') || "New";
            setSortedBy(querySortedBy);


            let sortedArray = [...allPosts];

            // Sort based on the selected filter
            switch (sortedBy) {
                case "Comment":
                    sortedArray = sortedArray.sort((postA, postB) => postB.comments.length - postA.comments.length);
                    break;
                case "Liked":
                    sortedArray = sortedArray.sort((postA, postB) => postB.likes.length - postA.likes.length);
                    break;
                case "Old":
                    sortedArray = sortedArray.reverse();
                    break;
                case "New":
                    sortedArray = sortedArray;
                    break;
                default:
                    sortedArray = sortedArray;
                    break;
            }

            setFilteredData(sortedArray);
        }
    };




    return (
        <>
            <div className="font-sans grid max-w-[710px] overflow-auto md:max-w-full md:w-full">
                {isLoading ? (
                    <SkeletonTable />
                ) : (
                    <div className='bg-admin-navy rounded-sm'>
                            <h3 className='text-xl px-6 pt-6'>Posts</h3>
                        <div className='px-6 pt-6 flex justify-end items-center'>
                            <div className='gap-4 glex flex items-center'>
                                <form className='flex items-center gap-1' onSubmit={e => e.preventDefault()}>
                                    <button onClick={serchUsernameFilterHandler} className='text-admin-High w-5 h-5'>
                                        {searchIcon}
                                    </button>
                                    <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className='bg-transparent text-white outline-hidden' placeholder='search...' type="text" />
                                </form>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Sorted By</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={sortedBy}
                                        label="Column"
                                        onChange={handleChangeSortBy}
                                    >
                                        <MenuItem value={"New"}>Newest</MenuItem>
                                        <MenuItem value={"Liked"}>Most Liked</MenuItem>
                                        <MenuItem value={"Comment"}> Most Comment</MenuItem>
                                        <MenuItem value={"Old"}>Oldest</MenuItem>
                                    </Select>
                                </FormControl>

                            </div>
                        </div>
                        {filteredData && filteredData?.length > 0 ? (
                            <Table columns={columns}>
                                <tbody className='h-[200px] overflow-auto' >
                                    {filteredData?.map((data, index) => (
                                        <tr key={data._id} className={`border-y text-sm  text-center border-[#2e3a47]`}>
                                            <td className='py-[18px]  px-2 lg:px-1'>{index + 1}</td>
                                            <td className='py-[18px]  px-2 lg:px-1'>
                                                <div className='flex items-center gap-2 justify-center'>
                                                    <img loading='lazy' className='w-8 h-8 rounded-full object-cover' src={`${import.meta.env.VITE_API_BASE_URL}/${data.user.userPicture.path}`} alt="profile" />
                                                    {data.user.username}
                                                </div>
                                            </td>
                                            <td className='py-[18px]  px-2 lg:px-1'>
                                                <button
                                                    onClick={() => {
                                                        setIsShowPost(true)
                                                        setIsInfoPost(data)
                                                    }}
                                                    className='text-admin-High hover:text-lime-500 hover:scale-110 transition-all duration-300 w-4 h-4'>
                                                    {eyeIcon}
                                                </button>
                                            </td>
                                            <td className='py-[18px]  px-2 lg:px-1'>
                                                <button
                                                    onClick={() => {
                                                        setIsShowCommentPost(true)
                                                        setAllComment(data.comments)
                                                    }}
                                                    className='text-admin-High hover:text-emerald-500 hover:scale-110 transition-all duration-300 w-4 h-4'>
                                                    {eyeIcon}
                                                </button>
                                            </td>
                                            <td className='py-[18px]  px-2 lg:px-1'>
                                                <button
                                                    onClick={() => {
                                                        setIsShowLikedPost(true)
                                                        setIsInfoPost(data)
                                                    }}
                                                    className='text-admin-High hover:text-cyan-500 hover:scale-110 transition-all duration-300 w-4 h-4'>
                                                    {eyeIcon}
                                                </button>
                                            </td>
                                            <td className='py-[18px]  px-2 lg:px-1'><DateConverter date={data.createdAt} /></td>
                                            <td className='py-[18px]  px-2 lg:px-1'>
                                                <div className='flex items-center justify-center gap-2'>

                                                    <button onClick={() => {
                                                        setIsShowDeletePost(true)
                                                        setIsInfoPost(data)
                                                    }} className='w-4 h-4 text-admin-High hover:scale-110 hover:text-error-red transition-all duration-300'>{deleteIcon}</button>

                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <div>
                                <p className='text-center text-xl py-3'>
                                    No Post found 😩
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* show post */}
            <Modal
                isYesOrNo={false}
                setisOpenModal={setIsShowPost}
                isOpenModal={isShowPost}
            >
                <div className='py-2 flex flex-col gap-5'>
                    <Slider {...settings} className='w-full h-full'>
                        {infoPost?.media.map((data) => (
                            <div key={data._id} className='relative w-full h-full'>
                                <div className='flex  justify-center items-center w-full h-full'>
                                    <img
                                        draggable="false"
                                        loading="lazy"
                                        className="w-full h-[400px] object-center"
                                        src={`${import.meta.env.VITE_API_BASE_URL}/${data.path}`}
                                        alt="post image"
                                    />
                                </div>
                            </div>
                        ))}
                    </Slider>
                    <div className='flex flex-col'>
                        <p className='text-admin-low'>{infoPost?.title}</p>
                        <p className='text-admin-low truncate'>{infoPost?.description}</p>
                        <p className='text-sm text-primary-blue truncate'>{infoPost?.hashtags}</p>
                    </div>
                </div>
            </Modal>

            {/* show comment */}
            <Modal
                isYesOrNo={false}
                setisOpenModal={setIsShowCommentPost}
                isOpenModal={isShowCommentPost}
            >
                <div className='px-3 mb-1'>
                    <p>Count Comments : {allComment?.length}</p>
                </div>
                <div className='max-h-72 overflow-auto grid grid-cols-1 gap-3 px-3'>
                    {allComment && allComment?.length > 0 ? (
                        allComment.map(data => (
                            <div key={data._id} className='flex justify-between items-center'>
                                <div className='flex overflow-hidden items-center gap-2'>
                                    <p className='shrink-0'>
                                        <img draggable="false" className="h-12 w-12 rounded-full shrink-0 object-cover mr-0.5" src={`${import.meta.env.VITE_API_BASE_URL}/${data.userPicture.path}`} alt="avatar" />
                                    </p>
                                    <div className='flex flex-col'>
                                        <p className="text-sm text-black dark:text-white font-semibold hover:underline">{data.username}</p>
                                        <p className='text-xs text-gray-500 text-wrap'><DateConverter date={data.createdAt} /></p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <div>
                                        <button onClick={() => {
                                            setCommentInfo(data)
                                            setIsShowCommentMsg(true)
                                        }} className='w-4 h-4 text-admin-High hover:scale-110 hover:text-amber-500 transition-all duration-300'>{eyeIcon}</button>
                                    </div>
                                    <div>
                                        <button onClick={() => {
                                            setCommentInfo(data)
                                            setIsShowDeleteComment(true)
                                        }} className='w-4 h-4 text-admin-High hover:scale-110 hover:text-error-red transition-all duration-300'>{deleteIcon}</button>
                                    </div>

                                </div>

                            </div>
                        ))
                    ) : (
                        <p className='text-admin-High text-lg'> No one has Registered Comment this post 😩</p>
                    )}
                </div>

            </Modal>

            {/* show comment Msg */}
            <Modal
                isYesOrNo={false}
                setisOpenModal={setIsShowCommentMsg}
                isOpenModal={isShowCommentMsg}
            >

                <div className='max-h-72 overflow-auto'>
                    <div className='flex items-center gap-2'>
                        <p className='shrink-0'>
                            <img draggable="false" className="h-12 w-12 rounded-full shrink-0 object-cover mr-0.5" src={`${import.meta.env.VITE_API_BASE_URL}/${commentInfo?.userPicture.path}`} alt="avatar" />
                        </p>
                        <div className='flex flex-col'>
                            <p className="text-sm text-black dark:text-white font-semibold hover:underline">{commentInfo?.username}</p>
                            <p className='text-xs text-gray-500'><DateConverter date={commentInfo?.createdAt} /></p>
                        </div>
                    </div>
                    <p className='text-xl font-bold text-admin-High py-3'>{commentInfo?.content} </p>
                </div>

            </Modal>

            {/* show liked */}
            <Modal
                isYesOrNo={false}
                setisOpenModal={setIsShowLikedPost}
                isOpenModal={isShowLikedPost}
            >
                <div className='px-3 mb-1'>
                    <p>Count Liked : {infoPost?.likes.length}</p>
                </div>
                <div className='max-h-72 overflow-auto grid grid-cols-1 gap-3 px-3'>
                    {infoPost && infoPost?.likes.length > 0 ? (
                        infoPost?.likes.map(data => (
                            <div key={data._id} className='flex justify-between items-center'>
                                <div className='flex items-center gap-2'>
                                    <p className='shrink-0'>
                                        <img draggable="false" className="h-12 w-12 rounded-full shrink-0 object-cover mr-0.5" src={`${import.meta.env.VITE_API_BASE_URL}/${data.userPicture.path}`} alt="avatar" />
                                    </p>
                                    <div className='flex flex-col'>
                                        <p className="text-sm text-black dark:text-white font-semibold hover:underline">{data.username}</p>
                                        <p className='text-xs text-gray-500'><DateConverter date={data.createdAt} /></p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='text-admin-High text-lg'> No one has Liked this post 😩</p>
                    )}
                </div>

            </Modal>


            {/* delete Comment  */}
            <Modal
                isYesOrNo={true}
                title={`Are you sure you want to Delete ${infoPost?.user.username} Comment ?`}
                setisOpenModal={setIsShowDeleteComment}
                isOpenModal={isShowDeleteComment}
                btnNoTitle={`keep the Comment`}
                btnYesTitle={`Delete Comment`}
                isAttention={true}
                submitHandler={deleteCommentHandler} />


            {/* Delete Post */}
            <Modal
                isYesOrNo={true}
                title={`Are you sure you want to Delete ${infoPost?.user.username} Post ?`}
                setisOpenModal={setIsShowDeletePost}
                isOpenModal={isShowDeletePost}
                btnNoTitle={`keep the Post`}
                btnYesTitle={`Delete Post`}
                isAttention={true}
                submitHandler={deletePostHandler} />
        </>
    )
}

export default PostsAdmin