import React, {
  useContext,
  ChangeEvent,
  useEffect,
  InputHTMLAttributes,
} from "react";
import { Converters, Converter } from "../core/Converters";
import { FormContext, FormContextContent } from "./Form";
import { ValidationResult } from "../core/ValidationActions";

export interface BoundComponentProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** propertyName. Will also be used as id if none is specified */
  name: string;

  /** Optional: the converter to use. If not set, the default for the input type will be used */
  converter?: Converter<any>;

  /** Optional: the validator to use. If set, all default validators (required, number, etc) will be replaced by this. Received the value after being converted */
  validate?(value: any): Promise<ValidationResult>;
}

export interface InputProps extends BoundComponentProps {
  type:
    | "text"
    | "url"
    | "email"
    | "number"
    | "checkbox"
    | "date"
    | "time"
    | "radio"
    | "datetime-local";
}

export interface BoundComponentPropsWithElement extends BoundComponentProps {
  /** type of input component to use */
  elementName: "input" | "select" | "textarea";
}

/**
 * An input/select/textarea component that will bind automatically
 * with the corresponding object propety in the containing `Form`
 */
export function BoundComponent({
  elementName,
  converter,
  validate,
  name,
  id,
  onChange: originalOnChange,
  children,
  ...props
}: BoundComponentPropsWithElement) {
  const type: string = (props as any).type;
  if (process.env.NODE_ENV !== "production") {
    if (type === "radio" && typeof props.defaultValue === "undefined") {
      throw new Error(`Radio button ${name} requires a defaultValue`);
    }
    if (typeof props.value !== "undefined") {
      throw new Error(`${name} should use defaultValue instead of value`);
    }
  }

  if (!id) {
    id = name.replace(/\./g, "-");
    if (type === "radio") {
      id = `${name}_${props.defaultValue}`;
    }
  }
  converter = converter || Converters[type] || Converters.text;
  const formContext = useContext<FormContextContent>(FormContext);
  const defaultValue =
    type === "checkbox"
      ? undefined
      : type === "radio"
      ? (props.defaultValue as string)
      : converter.toValue(formContext.getValue(name));
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
        : converter!.fromValue({ value: element.value, ...props });
    formContext.setValue(name, objectValue);
    originalOnChange && originalOnChange(e);
  }

  useEffect(() => {
    formContext.addValidator({ name, validate, ...props });
    // TODO: should we do something to unmount?
  }, []);

  const error = formContext.errors[name];

  // ARIA attributes to point to the error message
  const errorMessageId = error ? `${id}_error` : undefined;
  const adb = props["aria-describedby"];
  const ariaProps = !error
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
          ...props,
          ...ariaProps,
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

export function Input({ autoComplete = "off", ...props }: InputProps) {
  return (
    <BoundComponent
      elementName="input"
      autoComplete={autoComplete}
      {...props}
    />
  );
}

export function Select(props: BoundComponentProps) {
  return <BoundComponent elementName="select" {...props} />;
}

export function TextArea(props: BoundComponentProps) {
  return <BoundComponent elementName="textarea" {...props} />;
}
