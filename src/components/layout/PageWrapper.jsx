import { motion } from 'framer-motion';
import { pageVariants } from '../../animations/variants';

export default function PageWrapper({ children, className = '' }) {
    return (
        <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`w-full max-w-[1440px] px-5 py-6 sm:px-6 sm:py-7 lg:px-8 xl:px-10 2xl:px-12 ${className}`}
        >
            {children}
        </motion.div>
    );
}
