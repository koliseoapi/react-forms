import React, {
  ChangeEvent,
  InputHTMLAttributes,
  useContext,
  useEffect,
  useRef,
} from "react";
import { Converter, Converters } from "../core/Converters";
import { ValidationResult } from "../core/ValidationActions";
import { errorStyles, isNullOrUndefined } from "../core/utils";
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

  /** to be used together with value, sends the converted value when the value changes */
  setValue?(value: Type | undefined): void;

  /** Optional value, for controlled components. It gets converted before calling onPropertyChange */
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
export function BoundComponent<Type>(
  originalProps: BoundComponentPropsWithElement<Type>
) {
  let {
    elementName,
    converter,
    validate,
    name,
    id,
    onChange: originalOnChange,
    children,
    setValue,
    value,
    ...props
  } = originalProps;
  const type: string = (props as any).type;
  if (process.env.NODE_ENV !== "production") {
    if (type === "radio" && typeof props.defaultValue === "undefined") {
      throw new Error(`Radio button ${name} requires a defaultValue`);
    }
  }
  const controlled = "value" in originalProps || "setValue" in originalProps;
  if (controlled) {
    if (isNullOrUndefined(value) || !setValue) {
      throw new Error(
        `Both value and setValue are required for controlled components`
      );
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
  const optionalProps: Partial<InputHTMLAttributes<HTMLInputElement>> = {};
  if (type == "checkbox") {
    optionalProps.defaultChecked = formContext.getValue(name);
  } else if (type == "radio") {
    optionalProps.defaultValue = props.defaultValue;
    optionalProps.defaultChecked =
      formContext.getValue(name) == props.defaultValue;
  } else {
    if (controlled) {
      optionalProps.value =
        "value" in originalProps
          ? converter.toValue(value)
          : converter.toValue(formContext.getValue(name));
    } else {
      optionalProps.defaultValue = converter.toValue(
        formContext.getValue(name)
      );
    }
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const element = e.target;
    const objectValue =
      type === "checkbox"
        ? element.checked
        : converter!.fromValue({ ...props, value: element.value });
    formContext.setValue(name, objectValue);
    setValue && setValue(objectValue as Type);
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
          ref,
          onKeyDown,
          ...optionalProps,
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
