import { AnimatePresence, motion } from 'framer-motion';

export default function Modal({ isOpen, onClose, children, panelClassName = '' }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.button
                        type="button"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
                            exit: { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
                        }}
                        aria-label="Close modal backdrop"
                        className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-md"
                        onClick={onClose}
                    />
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={{
                            hidden: { opacity: 0, scale: 0.96, y: 18 },
                            visible: {
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
                            },
                            exit: { opacity: 0, scale: 0.97, y: 12, transition: { duration: 0.22, ease: 'easeIn' } },
                        }}
                        className={`fixed left-1/2 top-1/2 z-[60] w-[min(92vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-[28px] bg-white shadow-[0_28px_80px_rgba(15,23,42,0.18)] ${panelClassName}`}
                        onClick={(event) => event.stopPropagation()}
                    >
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
