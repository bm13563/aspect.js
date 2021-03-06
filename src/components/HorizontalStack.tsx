import React, { Children } from "react";
import { StackBase } from "./StackBase";

export const HorizontalStack = ({
  spacing = 0,
  className = "",
  children,
}: {
  spacing?: number;
  className?: string;
  children?: JSX.Element | JSX.Element[];
}): JSX.Element => {
  return (
    <StackBase
      className={`children:ml-${String(
        spacing
      )} children:first:ml-0 flex flex-row items-center ${className}`}
    >
      {children}
    </StackBase>
  );
};
