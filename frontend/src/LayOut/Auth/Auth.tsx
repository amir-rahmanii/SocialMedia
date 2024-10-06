import React, { PropsWithChildren } from 'react'
import LogoInstagramAnimate from '../../Components/User/LogoInstagramAnimate/LogoInstagramAnimate'


const Auth: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="w-full h-full p-3 sm:p-0">
            <div className="flex justify-center w-full h-screen md:w-2/3 py-8 mx-auto">
                <div className="hidden xl:block my-10 mr-28">
                    <LogoInstagramAnimate />
                </div>

                <div className="flex flex-col gap-3 w-full xl:w-2/5">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Auth