import React, { useState } from 'react'
import PostItem from '../../Home/PostItem/PostItem'
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Post } from '../../../hooks/post/post.types';



type PostContainerUserProps = {
    posts: Post[],
    showCol: boolean,
};

function PostContainerUser({ showCol, posts }: PostContainerUserProps) {

    const [column, setColumn] = useState(3);

    const handleChange = (e: SelectChangeEvent<number>) => {
        setColumn(e.target.value as number)
    }

    return (
        <>
            {showCol && (
                <div className='p-3 w-32 hidden lg:block '>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Column</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={column}
                            label="Column"
                            onChange={handleChange}
                        >
                            <MenuItem value={1}>One</MenuItem>
                            <MenuItem value={2}>Two</MenuItem>
                            <MenuItem value={3}>Three</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            )}
            <div className={`grid w-full  ${!showCol ? "grid-cols-1 md:ml-20 lg:ml-36 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : column === 3 ? "grid-cols-1 lg:grid-cols-3" : column === 2 ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 xl:grid-cols-1"} gap-1 sm:gap-8 my-1 mb-4 p-3`}>
                {posts.map((post) => (
                    <PostItem key={post._id} {...post} />
                )).reverse()}
            </div>
        </>
    )
}

export default PostContainerUser