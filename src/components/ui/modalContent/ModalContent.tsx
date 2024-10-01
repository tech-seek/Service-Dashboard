
import { FC, ReactNode } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface IProps {
  title: string;
  modalContentProps?: ReactNode;
}

const ModalContent: FC<IProps> = ({ title, modalContentProps }) => {
  return (
    <DialogContent className="w-full max-w-lg p-4 md:p-5  bg-black  flex flex-col text-white capitalize">
      <DialogHeader>
        <DialogTitle className='text-xl md:text-2xl text-center font-bold text-white uppercase'>{title}</DialogTitle>
      </DialogHeader>

      <div className="">{modalContentProps}</div>

    </DialogContent>
  )
}

export default ModalContent