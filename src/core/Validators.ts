import {
  ValidationAction,
  ValidationResult,
  filterActionsForProps,
} from "./ValidationActions";
import { BoundComponentProps } from "../components/InputElements";

export class Validator {
  propertyName: string;

  /** props assigned to the BoundComponent */
  props: BoundComponentProps;

  /** Validation actions to execute on this property */
  actions: ValidationAction<any>[];

  /**
   * If props.validate is not undefined, it will replace the automatic validations.
   * Otherwise a list of validations based on type, min, max, pattern will be set.
   */
  constructor(props: BoundComponentProps) {
    this.propertyName = props.name;
    this.actions = props.validate
      ? [props.validate]
      : filterActionsForProps(props);
    this.props = props;
  }

  /**
   * Launches all validation actions against the current value
   */
  async validate(currentValue: any): Promise<ValidationResult> {
    for (const action of this.actions) {
      const error = await action(currentValue, this.props);
      if (typeof error !== "undefined") {
        return error;
      }
    }
    return undefined;
  }
}

export interface Validators {
  [propertyName: string]: Validator;
}
