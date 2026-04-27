import { motion } from 'framer-motion';
import { pageVariants } from '../../animations/variants';

export default function PageWrapper({ children, className = '' }) {
    return (
        <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`mx-auto w-full max-w-[1280px] px-5 py-6 sm:px-6 sm:py-7 xl:px-8 ${className}`}
        >
            {children}
        </motion.div>
    );
}
