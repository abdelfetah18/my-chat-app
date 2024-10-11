import { AnimatePresence, Variants, motion } from "framer-motion";
import { useModalReturn } from "../libs/hooks/useModal";
import { ModalContext } from "../libs/contexts/ModalContext";
import { FaTimes } from "react-icons/fa";

interface ModalProps {
    children: React.ReactNode;
    useModal: useModalReturn;
    animationName?: AnimationName;
};

type AnimationName = 'CenterScaleFadeIn' | 'EdgeScaleFadeIn'

export default function Modal({ children, useModal, animationName = 'CenterScaleFadeIn' }: ModalProps) {
    const { isOpen, close } = useModal;

    console.log("animations[animationName]:", animations[animationName]);

    return (
        <ModalContext.Provider value={useModal}>
            <AnimatePresence>
                {
                    isOpen && (
                        <motion.div
                            variants={animations[animationName]}
                            initial="close"
                            animate="open"
                            exit="close"
                            className="w-full h-screen bg-black/20 overflow-auto flex flex-col items-center absolute top-0 left-0 backdrop-blur-sm z-50"
                        >
                            <div className="w-11/12 flex items-center flex-nowrap justify-between py-4">
                                <div></div>
                                <div onClick={() => close()} className="text-2xl bg-primaryColor rounded-full p-1 cursor-pointer hover:bg-secondaryColor active:scale-110 duration-300 text-white">
                                    <FaTimes />
                                </div>
                            </div>
                            <div className="w-11/12 flex flex-col items-center">
                                {children}
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </ModalContext.Provider>
    )
}

type AnimationNamesMap = {
    [key in AnimationName]: Variants;
};

const animations: AnimationNamesMap = {
    EdgeScaleFadeIn: {
        open: {
            opacity: 1,
            width: "100%",
            height: "100%",
            transition: { duration: 0.3, ease: "easeInOut" },
        },
        close: {
            opacity: 0,
            width: 0,
            height: 0,
            transition: { duration: 0.3, ease: "easeInOut" },
        }
    },
    CenterScaleFadeIn: {
        open: {
            opacity: 1,
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
            transition: { duration: 0.3, ease: "easeOut" },
        },
        close: {
            opacity: 0,
            width: "60%",
            height: "60%",
            left: "20%",
            top: "20%",
            transition: { duration: 0.3, ease: "easeOut" },
        }
    }
}