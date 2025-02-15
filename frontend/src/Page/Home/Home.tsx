
import MetaData from '../../Components/MetaData/MetaData'
import PostsContainer from '../../Components/User/PostsContainer/PostsContainer'
import SideBarLeft from '../../Parts/User/SideBarLeft/SideBarLeft'
import Header from '../../Parts/User/Header/Header'
import SideBarBottom from '../../Parts/User/SideBarBottom/SideBarBottom'
import Sidebar from '../../Components/User/Sidebar/Sidebar'

function Home() {


    return (
        <>
            <MetaData title="Instagram" />
            <Header />
            <SideBarLeft />
            <div className="flex mt-10 md:mt-0 gap-2 h-full w-full xl:w-5/6 mx-auto p-3 sm:p-0">
                <PostsContainer />
                <Sidebar />
            </div>
            <SideBarBottom />
        </>

    )
}

export default Home