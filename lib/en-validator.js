import { Validator, Types, Defaults } from './react-validate-input';

// Blatantly copied from the validation messages in Chrome
Validator.setMessages({
  NaN: 'The value is not a valid number',
  NaD: 'The value is not a valid date',
  required: 'Please fill out this field',
  min: 'Must be higher than ${min}',
  max: 'Must be lower than ${max}',
});

export { Validator, Types, Defaults };