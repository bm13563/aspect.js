import React, { useState, useRef, useContext } from "react";
import { Button } from "../../components/Button";
import { VerticalStack } from "../../components/VerticalStack";
import { HandleClickOutside } from "../../hooks/HandleClickOutside";
import { ActionState } from "../actionPanel/ActionContext";

export const ToolbarMenu = ({
    name,
    children,
}: {
    name: string;
    children?: JSX.Element | JSX.Element[];
}): JSX.Element => {
    const menuRef = useRef<HTMLDivElement>(null);
    const { configState } = useContext(ActionState);

    const [open, setOpen] = useState(false);

    const clickOutsideCallback = () => {
        setOpen(false);
    };

    const exceptionCallback = () => {
        return !!configState;
    };

    HandleClickOutside(menuRef, clickOutsideCallback, exceptionCallback);

    return (
        <div ref={menuRef} className="mr-10 z-2 text-center">
            <Button text={name} onClick={() => setOpen(!open)} />
            <VerticalStack className={`${!open && "invisible"}`} spacing={2}>
                {children}
            </VerticalStack>
        </div>
    );
};
