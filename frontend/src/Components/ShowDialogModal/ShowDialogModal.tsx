import { Dialog } from '@mui/material'
import React from 'react'
import DialogHeader from './DialogHeader/DialogHeader'

type ShowDialogModalProps = {
  isOpenShowLDialogModal: boolean,
  setisOpenShowLDialogModal: (value: boolean) => void,
  title: string,
  height : string,
  children: React.ReactNode
}

function ShowDialogModal({ isOpenShowLDialogModal, setisOpenShowLDialogModal , height, title, children }: ShowDialogModalProps) {
  return (
    <Dialog open={isOpenShowLDialogModal} onClose={() => setisOpenShowLDialogModal(false)} maxWidth='xl'>
      <div className={`flex flex-col ${height} overflow-y-auto xl:w-screen max-w-xl bg-white dark:bg-black`}>
        <DialogHeader
          title={title}
          setIsOpenShowModal={setisOpenShowLDialogModal}
        />
      {children}
      </div>
    </Dialog>
  )
}

export default ShowDialogModal