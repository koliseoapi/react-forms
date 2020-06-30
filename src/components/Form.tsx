import React, {
  FormHTMLAttributes,
  ReactEventHandler,
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";
import {
  filterActionsForProps,
  ValidationResult,
} from "../core/ValidationActions";
import { I18nContext } from "./I18nContext";
import { Messages } from "../core/Messages";
import { Validators, Validator } from "../core/Validators";
import { BoundComponentProps } from "./InputElements";
import { setNestedProperty, getNestedProperty } from "../core/utils";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  /** the object being edited  */
  initialValues: any;

  /** the method to invoke when submitting, after passing all validations */
  onSubmit: (values: any) => Promise<any>;
}

/**
 * The list of all validation errors. The key is the propertyName,
 * the value is the error message
 */
export interface ValidationErrors {
  [propertyName: string]: string;
}

/**
 * Context to share with child BoundComponents
 */
export interface FormContextContent {
  /**
   * All error messages, indexed by property name
   */
  errors: ValidationErrors;

  /**
   * True if this form is submitting the value
   */
  submitting: boolean;

  /**
   * Add a Validator to the list of fields validated by this form
   */
  addValidator(props: BoundComponentProps): void;

  /**
   * Triggered by a change in the form field
   */
  setValue(propertyName: string, value: any): void;

  /**
   * Get value associated to a BoundComponent
   */
  getValue(propertyName: string): any;
}
function undefinedFormContext(): never {
  throw new Error("A <Form> context is required");
}
export const FormContext = createContext<FormContextContent>({
  addValidator: undefinedFormContext,
  setValue: undefinedFormContext,
  getValue: undefinedFormContext,
  errors: {},
  submitting: false,
});

/**
 * Form is the required container  of BoundComponent instances.
 */
export function Form({
  initialValues,
  onSubmit,
  children,
  ...props
}: FormProps) {
  // errors to display, sorted by component key
  const [errors, setErrors] = useState<ValidationErrors>({});

  // object with the data introduced in this form
  const [values, setValues] = useState(initialValues);

  // the list of validators to use for this object
  const [validators, setValidators] = useState<Validators>({});

  // the submission status
  const [submitting, setSubmitting] = useState(false);

  // should focus on the first component with error
  const [focusFirstError, setFocusFirstError] = useState(false);

  // validation rules to apply
  const entries = useContext(I18nContext);
  const messages = new Messages(entries);

  const formContextValue: FormContextContent = {
    errors,
    submitting,
    addValidator: function (props) {
      validators[props.name] = new Validator(props);
      setValidators(validators);
    },

    setValue: function (propertyName, value) {
      setNestedProperty(values, propertyName, value);
      if (errors[propertyName]) {
        delete errors[propertyName];
        setErrors({ ...errors });
      }
    },

    getValue(propertyName) {
      return getNestedProperty(values, propertyName);
    },
  };

  async function validate(): Promise<ValidationErrors> {
    const newErrors: ValidationErrors = {};
    await Promise.all(
      Object.entries(validators).map(async ([propertyName, validator]) => {
        const error: ValidationResult = await validator.validate(
          values[propertyName]
        );
        if (!!error) {
          newErrors[propertyName] = messages.get(error, validator.props);
        }
      })
    );
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setFocusFirstError(true);
    }
    return newErrors;
  }

  const onSubmitHandler: ReactEventHandler = async function (e): Promise<any> {
    e.preventDefault();
    const errors = await validate();
    if (!Object.keys(errors).length) {
      setSubmitting(true);
      return onSubmit(values).finally(() => setSubmitting(false));
    } else {
      return Promise.reject(errors);
    }
  };

  // todo: only do this when fully validating, not by setErrors()

  useEffect(() => {
    if (focusFirstError) {
      const firstInvalidElement = document.body.querySelector<HTMLInputElement>(
        "[aria-invalid=true]"
      );
      firstInvalidElement && firstInvalidElement.focus();
      setFocusFirstError(false);
    }
  }, [errors]);

  return (
    <form {...props} onSubmit={onSubmitHandler} noValidate>
      <FormContext.Provider value={formContextValue}>
        {children}
      </FormContext.Provider>
    </form>
  );
}

/**
 * A fieldset that will disable all input controls while submitting
 */
export function FieldSet({ children, ...props }) {
  const formContext = useContext(FormContext);
  return (
    <fieldset disabled={formContext.submitting} {...props}>
      {children}
    </fieldset>
  );
}
