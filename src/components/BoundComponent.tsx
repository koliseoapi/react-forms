import React, { useContext, ChangeEvent, useEffect, useState } from "react";
import { Converters, Converter } from "../core/Converters";
import { InputProps } from "../core/ValidationActions";
import { FormContext, FormContextContent } from "./Form";

export interface BoundComponentProps extends InputProps {
  /** type of input component to use */
  elementName: "input" | "select" | "textarea";

  /** propertyName. Will also be used as id if none is specified */
  name: string;

  /** Optional: the converter to use. If not set, the default for the input type will be used */
  converter?: Converter<any>;
}

/**
 * An input/select/textarea component that will bind automatically
 * with the corresponding object propety in the containing `Form`
 */
export function BoundComponent({
  elementName,
  converter,
  name,
  id,
  onChange: originalOnChange,
  children,
  ...props
}: BoundComponentProps) {
  const type = props.type;
  if (process.env.NODE_ENV != "production") {
    if (type === "radio" && !props.defaultValue) {
      throw new Error(`Radio button ${name} requires a defaultValue`);
    }
    if (typeof props.value !== "undefined") {
      throw new Error(`${name} should use defaultValue instead of value`);
    }
  }

  converter = converter || Converters[type] || Converters.text;
  const formContext = useContext<FormContextContent>(FormContext);
  const defaultValue =
    type === "checkbox"
      ? undefined
      : type === "radio"
      ? (props.defaultValue as string)
      : converter.objectToHtml(formContext.getValue(name));
  const defaultChecked =
    type === "checkbox"
      ? formContext.getValue(name)
      : type === "radio"
      ? formContext.getValue(name) == defaultValue
      : undefined;

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const element = e.target;
    const objectValue =
      type === "checkbox"
        ? element.checked
        : converter.htmlToObject({ value: element.value, ...props });
    formContext.setValue(name, objectValue);
    originalOnChange && originalOnChange(e);
  }

  useEffect(() => {
    formContext.addValidator(name, props);
    // TODO: should we do something to unmount?
  }, []);

  const error = formContext.errors[name];
  const errorMessageId = error ? `${id}_error` : undefined;

  // ARIA attributes to point to the error message
  const adb = props["aria-describedby"];
  const ariaProps = !errorMessageId
    ? {}
    : {
        "aria-invalid": true,
        "aria-describedby": adb ? `${errorMessageId} ${adb}` : errorMessageId,
      };

  return (
    <>
      {React.createElement(
        elementName,
        {
          name,
          id: id,
          onChange,
          defaultChecked,
          defaultValue,
          ...ariaProps,
          ...props,
        },
        children
      )}
      {error ? (
        <div className="input-error" id={errorMessageId} role="alert">
          {error}
        </div>
      ) : undefined}
    </>
  );
}
