import React, { useEffect, useState } from 'react'
import useGetData from '../../hooks/useGetData';
import { IMessage } from '../Inbox/Inbox';
import SkeletonTable from '../../Components/SkeletonTable/SkeletonTable';
import { deleteIcon, eyeIcon, searchIcon } from '../../Components/SvgIcon/SvgIcon';
import DateConverter from '../../utils/DateConverter';
import Table from '../../Components/Admin/Table/Table';
import Modal from '../../Components/Admin/Modal/Modal';
import useDeleteData from '../../hooks/useDeleteData';
import { useQueryClient } from 'react-query';
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import FilterDate from '../../Components/FilterDate/FilterDate';
import dayjs, { Dayjs } from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';


// use query for filtering
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};



function MessagesAdmin() {
    const columns: string[] = [
        "#",
        "Sender",
        "Msg",
        "CountLiked",
        "CreatedAt",
        "Action"
    ]

    const query = useQuery();

    const [fromPicker, setFromPicker] = useState<Dayjs | null>(
        dayjs(query.get('fromDate')) || null
    );
    const [untilPicker, setUntilPicker] = useState<Dayjs | null>(
        dayjs(query.get('untilDate')) || null
    );

    const [orderMessage, setOrderMessage] = useState<"NTO" | "OTN">(
        query.get('order') as "NTO" | "OTN" || "NTO"
    );

    const [searchValue, setSearchValue] = useState("")
    const [infoMessage, setInfoMessage] = useState<IMessage | null>(null);
    const [isShowMessage, setIsShowMessage] = useState(false);
    const [isShowDeleteMessage, setIsShowDeleteMessage] = useState(false);
    const [isShowOpenFilter, setIsShowOpenFilter] = useState(false);
    const queryClient = useQueryClient();
    const [filteredData, setFilteredData] = useState<IMessage[] | null>(null)
    const navigate = useNavigate();


    const { data: allMessages, isLoading, isSuccess } = useGetData<IMessage[]>(
        ["getAllMessages"],
        "message/all-messages"
    );

    const { mutate: deleteMsg } = useDeleteData(
        "message/delete-messages",
        "Delete Msg successfuly!",
        () => {
            queryClient.invalidateQueries(["getAllMessages"])
            setIsShowDeleteMessage(false);
        }
    )




    useEffect(() => {
        isSuccess && serchUsernameFilterHandler();
    }, [searchValue])


    useEffect(() => {
        if (allMessages && isSuccess) {
            filterDateHandler(allMessages)
        }
    }, [allMessages, isSuccess, location.search])



    const deleteMessageHandler = () => {
        deleteMsg({ messageId: infoMessage?._id })
    }



    const serchUsernameFilterHandler = () => {
        if (searchValue.trim()) {
            const regex = new RegExp(searchValue, 'i');
            const newAllMessagess = allMessages?.filter(data =>
                regex.test(data.sender.username)
            );
            setFilteredData(newAllMessagess || null);
        } else {
            setFilteredData(allMessages || []);
        }
    };


    const filterDateHandler = (allMessage: IMessage[]) => {

        // تبدیل fromPicker و untilPicker به شیء Dayjs
        const fromDate = fromPicker ? dayjs(fromPicker).startOf('day') : null;
        const untilDate = untilPicker ? dayjs(untilPicker).endOf('day') : null;

        const isFromDateValid = fromDate && fromDate.isValid();
        const isUntilDateValid = untilDate && untilDate.isValid();

        // ساخت URL جدید با پارامترها
        const params = new URLSearchParams();
        params.set('order', orderMessage);
        isFromDateValid && params.set('fromDate', fromDate.toISOString()); // تبدیل به فرمت مناسب
        isUntilDateValid && params.set('untilDate', untilDate.toISOString()); // تبدیل به فرمت مناسب

        // به‌روزرسانی URL با پارامترها
        navigate(`?${params.toString()}`);


        const filteredSystemInfos = allMessage?.filter(info => {
            const infoDate = dayjs(info.timestamp);
            const isDateInRange = infoDate.isBetween(fromDate, untilDate, null, '[]'); // چک کردن تاریخ

            return isDateInRange;
        });

        // ذخیره داده‌های فیلتر شده
        {
            orderMessage === "OTN" ?
                setFilteredData(filteredSystemInfos?.reverse() || [])
                : setFilteredData(filteredSystemInfos || [])
        }

        // بستن دیالوگ فیلتر
        setIsShowOpenFilter(false);
    };


    return (
        <>
            <div className="font-sans grid w-full">
                {isLoading ? (
                    <SkeletonTable />
                ) : (
                    <div className='bg-admin-navy rounded'>
                        <div className='px-6 pt-6 flex justify-between items-center'>
                            <h3 className='text-xl mb-6'>Messages</h3>
                            <div className='gap-4 glex flex items-center'>
                                <form className='flex items-center gap-1' onSubmit={e => e.preventDefault()}>
                                    <button onClick={serchUsernameFilterHandler} className='text-admin-High w-5 h-5'>
                                        {searchIcon}
                                    </button>
                                    <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className='bg-transparent text-white outline-none' placeholder='search...' type="text" />
                                </form>
                                {/* show filter */}
                                <Button onClick={() => setIsShowOpenFilter(true)} variant="outlined">Filter</Button>
                            </div>
                        </div>
                        <Table columns={columns}>
                            <tbody className='h-[200px] overflow-auto' >
                                {filteredData?.map((data, index) => (
                                    <tr key={data._id} className={`border-y text-sm  text-center border-[#2e3a47]`}>
                                        <td className='py-[18px]  px-2 lg:px-1'>{index + 1}</td>
                                        <td className='py-[18px]  px-2 lg:px-1'>
                                            <div className='flex items-center gap-2 justify-center'>
                                                <img loading='lazy' className='w-8 h-8 rounded-full object-cover' src={`http://localhost:4002/images/profiles/${data.sender.profilePicture.filename}`} alt="profile" />
                                                {data.sender.username}
                                            </div>
                                        </td>
                                        <td className='py-[18px]  px-2 lg:px-1'>{data.content !== '❤️' ? (
                                            <button
                                                onClick={() => {
                                                    setIsShowMessage(true)
                                                    setInfoMessage(data)
                                                }}
                                                className='text-admin-High hover:text-lime-500 hover:scale-110 transition-all duration-300 w-4 h-4'>
                                                {eyeIcon}
                                            </button>
                                        ) :
                                            data.content
                                        }</td>
                                        <td className='py-[18px]  px-2 lg:px-1'>{data.likedBy.length}</td>
                                        <td className='py-[18px]  px-2 lg:px-1'><DateConverter date={data.timestamp} /></td>
                                        <td className='py-[18px]  px-2 lg:px-1'>
                                            <div className='flex items-center justify-center gap-2'>

                                                <button onClick={() => {
                                                    setIsShowDeleteMessage(true)
                                                    setInfoMessage(data)
                                                }} className='w-4 h-4 text-admin-High hover:scale-110 hover:text-error-red transition-all duration-300'>{deleteIcon}</button>

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </div>

            {/* Info Messgae */}
            <Modal
                isYesOrNo={false}
                isOpenModal={isShowMessage}
                setisOpenModal={setIsShowMessage}
            >
                <div className='max-h-72 overflow-auto'>
                    <p className='text-xl font-bold text-admin-low'>{infoMessage?.sender?.username} :</p>
                    <p className='text-xl font-bold text-admin-High'>{infoMessage?.content} </p>
                </div>

            </Modal>

            {/* Delete Message */}
            <Modal
                isYesOrNo={true}
                title={`Are you sure you want to Delete ${infoMessage?.sender.username} Message ?`}
                setisOpenModal={setIsShowDeleteMessage}
                isOpenModal={isShowDeleteMessage}
                btnNoTitle={`keep the Message`}
                btnYesTitle={`Delete Message`}
                isAttention={true}
                submitHandler={deleteMessageHandler} />

            {/* show filter date */}
            <Modal
                isYesOrNo={false}
                setisOpenModal={setIsShowOpenFilter}
                isOpenModal={isShowOpenFilter}
            >
                <FilterDate
                    fromPicker={fromPicker}
                    setFromPicker={setFromPicker}
                    untilPicker={untilPicker}
                    setUntilPicker={setUntilPicker}
                    filterDateHandler={filterDateHandler}
                >
                    <div>
                        <FormControl>
                            <FormLabel id="demo-controlled-radio-buttons-group">Order By</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={orderMessage}
                                onChange={(e) => setOrderMessage(e.target.value as "NTO" | "OTN")}
                                style={{ display: 'flex', flexDirection: 'row' }} // اعمال flex
                            >
                                <FormControlLabel value="NTO" control={<Radio />} label="New to Old" />
                                <FormControlLabel value="OTN" control={<Radio />} label="Old to New" />
                            </RadioGroup>
                        </FormControl>
                        <div className='my-2'>
                            <Button
                                onClick={() => {
                                    setFromPicker(null)
                                    setUntilPicker(null)
                                    setOrderMessage("NTO")
                                }
                                }
                                variant="outlined"
                                sx={{ borderColor: '#c6415ed8', color: '#c6415ed8', '&:hover': { borderColor: '#f8587bf5', color: '#f8587bf5' } }}
                            >
                                Reset Filter
                            </Button>

                        </div>
                    </div>
                </FilterDate>

            </Modal>
        </>
    )
}

export default MessagesAdmin