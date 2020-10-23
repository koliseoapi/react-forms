import { ButtonHTMLAttributes, useContext } from "react";
import React from "react";
import { FormContext } from "./Form";

/**
 * A submit button that can display an "in progress" css style. Its use is optional.
 * Use: <Button className="mybutton">Save</Button>
 * While the form is submitting, this button will be disabled. Also, by default it does not
 * submit the form, use type="submit" to submit the form by default.
 */
export function Button({
  className = "",
  children,
  type = "button",
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { submitting } = useContext(FormContext);
  return (
    <button
      className={`${submitting ? "in-progress " : ""}${className}`}
      disabled={typeof disabled === "undefined" ? submitting : disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
