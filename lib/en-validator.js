import Validator from './react-validate-input';

Validator.MESSAGES = {
  NaN: 'The value is not a valid number',
  NaD: 'The value is not a valid date',
  required: 'Is required',
  min: 'Must be higher than ${min}',
  max: 'Must be lower than ${max}',
}

export default Validator;