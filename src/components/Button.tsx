import { ButtonHTMLAttributes, useContext } from "react";
import React from "react";
import { FormContext } from "./Form";

/**
 * A submit button that can display an "in progress" css style. Its use is optional.
 * Use: <Button className="mybutton">Save</Button>
 */
export function Button({
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { submitting } = useContext(FormContext);
  return (
    <button
      className={`${submitting ? "in-progress " : ""}${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
