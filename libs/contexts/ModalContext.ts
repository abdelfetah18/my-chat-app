import { createContext } from "react";
import { useModalReturn } from "../hooks/useModal";

export const ModalContext = createContext<useModalReturn>({
    isOpen: false,
    open: () => { },
    close: () => { }
});