import React, {
  ChangeEvent,
  InputHTMLAttributes,
  useContext,
  useEffect,
  useRef,
} from "react";
import { Converter, Converters } from "../core/Converters";
import { ValidationResult } from "../core/ValidationActions";
import { errorStyles } from "../core/utils";
import { FormContext, FormContextContent } from "./Form";

export interface BoundComponentProps<Type>
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange" | "value"
  > {
  /** propertyName. Will also be used as id if none is specified */
  name: string;

  /** Optional: the converter to use. If not set, the default for the input type will be used */
  converter?: Converter<Type>;

  /** Optional: the validator to use. If set, all default validators (required, number, etc) will be replaced by this. Received the value after being converted */
  validate?(value: Type): Promise<ValidationResult>;

  /** onChange event handler has been extended to also receive the formContext */
  onChange?(
    event: ChangeEvent<HTMLInputElement>,
    formContext: FormContextContent
  ): void;

  /** to be used together with value, receives the transformed object when the value changes */
  onPropertyChange?(value: Type): void;

  /** Optional value, must be on type Type. It gets converted before calling onPropertyChange */
  value?: Type;
}

export interface InputProps<Type> extends BoundComponentProps<Type> {
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

export interface BoundComponentPropsWithElement<Type>
  extends BoundComponentProps<Type> {
  /** type of input component to use */
  elementName: "input" | "select" | "textarea";
}

/**
 * An input/select/textarea component that will bind automatically
 * with the corresponding object propety in the containing `Form`
 */
export function BoundComponent<Type>({
  elementName,
  converter,
  validate,
  name,
  id,
  onChange: originalOnChange,
  children,
  ...props
}: BoundComponentPropsWithElement<Type>) {
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
        : converter!.fromValue({ ...props, value: element.value });
    formContext.setValue(name, objectValue);
    originalOnChange && originalOnChange(e, formContext);
  }

  useEffect(() => {
    formContext.addValidator({ name, validate, converter, ...props });
    return () => formContext.removeValidator(name);
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
  const ref = useRef(null);

  // submit on Ctrl + Enter
  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && e.ctrlKey) {
      formContext.submit();
    }
  }

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
          ref,
          onKeyDown,
          ...props,
          ...ariaProps,
        },
        children
      )}
      {error ? (
        <div
          className="input-error"
          id={errorMessageId}
          role="alert"
          style={errorStyles(ref)}
        >
          {error}
        </div>
      ) : undefined}
    </>
  );
}

export function Input<Type>({
  autoComplete = "off",
  ...props
}: InputProps<Type>) {
  return (
    <BoundComponent
      elementName="input"
      autoComplete={autoComplete}
      {...props}
    />
  );
}

export function Select<Type>(props: BoundComponentProps<Type>) {
  return <BoundComponent elementName="select" {...props} />;
}

export function TextArea<Type>(props: BoundComponentProps<Type>) {
  return <BoundComponent elementName="textarea" {...props} />;
}
