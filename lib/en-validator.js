import { Validator, Types, Defaults } from './react-validate-input';

Validator.setMessages({
  NaN: 'The value is not a valid number',
  NaD: 'The value is not a valid date',
  required: 'Is required',
  min: 'Must be higher than ${min}',
  max: 'Must be lower than ${max}',
});

export default { Validator, Types, Defaults };