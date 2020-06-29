import {
  ValidationAction,
  InputProps,
  ValidationResult,
} from "./ValidationActions";

export class Validator {
  propertyName: string;

  /** props assigned to the BoundComponent */
  props: InputProps;

  /** Validation actions to execute on this property */
  actions: ValidationAction<any>[];

  constructor(
    propertyName: string,
    actions: ValidationAction<any>[],
    props: InputProps
  ) {
    this.propertyName = propertyName;
    this.actions = actions;
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
