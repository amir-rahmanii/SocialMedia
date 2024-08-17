import React, { PropsWithChildren } from 'react'


const Auth: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="w-full h-full">
          
            <div className="flex w-full h-screen md:w-2/3 py-8 mx-auto">

                <div className="hidden xl:block my-10">
                    <img src='/src/assets/images/homepage.webp' draggable="false" className="mr-[80px] mt-[1.8rem] ml-[155px]" alt="homepage" />
                </div>

                <div className="flex flex-col gap-3 w-full xl:w-2/5">

                    {children}

                </div>
            </div>
        </div>
    )
}

export default Auth