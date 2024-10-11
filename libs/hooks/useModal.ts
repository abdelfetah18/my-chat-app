import { useState } from "react";

export interface useModalReturn {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

export default function useModal(): useModalReturn {
    const [isOpen, setIsOpen] = useState(false);

    const open = (): void => {
        setIsOpen(true);
    }

    const close = (): void => {
        setIsOpen(false);
    }

    return {
        isOpen, open, close
    }
}