import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface IRotatingDotsLoader extends React.ComponentPropsWithoutRef<'div'> {}
export default function RotatingDotsLoader({ className }: IRotatingDotsLoader) {
    const rotateVariants = {
        rotate: {
            rotate: 360,
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
            },
        },
    };

    return (
        <div className={cn('flex items-center justify-center', className)}>
            <motion.div className='relative h-12 w-12' variants={rotateVariants} animate='rotate'>
                <motion.div
                    className='absolute left-0 top-0 h-4 w-4 rounded-full bg-red-500'
                    initial='initial'
                    animate='animate'
                    transition={{ delay: 0 }}
                ></motion.div>
                <motion.div
                    className='absolute right-0 top-0 h-4 w-4 rounded-full bg-red-500'
                    initial='initial'
                    animate='animate'
                    transition={{ delay: 0.2 }}
                ></motion.div>
                <motion.div
                    className='absolute bottom-0 left-0 h-4 w-4 rounded-full bg-red-500'
                    initial='initial'
                    animate='animate'
                    transition={{ delay: 0.4 }}
                ></motion.div>
                <motion.div
                    className='absolute bottom-0 right-0 h-4 w-4 rounded-full bg-red-500'
                    initial='initial'
                    animate='animate'
                    transition={{ delay: 0.6 }}
                ></motion.div>
            </motion.div>
        </div>
    );
}
