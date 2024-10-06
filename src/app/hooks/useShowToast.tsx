import { toast } from 'sonner';

const useShowToast = () => {
    const showToast = (success: boolean, message: string) => {
        success
            ? toast.success(message, { duration: 1500,style:{background:'#2f855a',color:'white'} })
            : toast.error(message, { duration: 1500, richColors: true });
    };

    return { showToast };
};

export default useShowToast;
