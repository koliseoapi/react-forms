# react-forms

[![Build Status](https://secure.travis-ci.org/koliseoapi/react-forms.svg?branch=master)](http://travis-ci.org/koliseoapi/react-forms)
[![Coverage Status](https://coveralls.io/repos/github/koliseoapi/react-forms/badge.svg?branch=master)](https://coveralls.io/github/koliseoapi/react-forms?branch=master)
<a href="https://www.npmjs.com/package/@koliseoapi/react-forms"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@koliseoapi/react-forms.svg?maxAge=43200"></a>

A library of HTML5 elements that convert user input automatically to state attributes. [Give it a try](https://koliseoapi.github.io/react-forms/).

```JavaScript
import { Form, Input, TextArea } from '@koliseoapi/react-forms';

const state = { username: 'Foo', age: 20 };

function MyComponent(props) {
  return (
    <Form onSubmit={mySaveFunction} state={state}>
      <Input type="text" name="username" required maxLength="100" />
      <Input type="number" name="age" min="0" step="1" />
    </Form>
  );
});
```

Any user input is converted into the right type (`number`, `date`, `boolean`) and assigned to the corresponding attribute inside the `state` object. When submitted, the `Form` container validates all fields before triggering the `onSubmit` callback.

The following components are supported:

- `Form`
- `Input (text, number, checkbox, radio, url, email, date, time)`
- `TextArea`
- `Select`

Radio buttons require a `RadioGroup` ancestor to manage a mutually exclusive `checked` state.

## Conversions

Each input field converts values automatically from `string` to the expected type:

- `text`, `url` and `email` are validated for format and passed as is:

```JavaScript
<Input type="email" name="email" />
<TextArea name="description" />
```

The native HTML element is used for data input, and the data is validated again using JavaScript before submission.

- `number` is converted to a JavaScript with decimals according to the value of `step` (default is `1`):

```JavaScript
<Input type="number" name="age" />
<Input type="number" name="percentage" step="0.01" />
```

- `checkbox` is transformed to a boolean:

```JavaScript
<Input type="checkbox" name="subscribed" />
```

- `date` and `time` are validated for format and min/max restrictions, then passed as strings with format `yyyy-MM-dd` and `HH:mm` respectively.

```JavaScript
<Input type="date" name="birthdate" min="1900-01-01" max="2020-01-01" pattern="\d{4}-\d{2}-\d{2}"/>
<Input type="time" pattern="[0-9]{2}:[0-9]{2}">
```

Keep in mind that these will render the corresponding native HTML elements, which are supported on all major browsers except Safari on MacOS, where `input[type=text]` will be used instead. For this reason we recommend to set a `pattern` attribute like the example above. Even though the date picker doesn't use it, the text input fallback will.

These are the default conversions, but you can override the converter associated to any form field:

```JavaScript
const AllowedValues = { one: instanceOne, two: instanceTwo };
const state = { defcon: AllowedValues.one }
const myConverter =

    // transform from String to Object
    toObject: function(value) {
      return AllowedValues[value] || AllowedValues.one;
    },

    // transform from object to String
    toString: function(value) {
      const key = Object.keys(AllowedValues).find((key) => AllowedValues[key] === value);
      return key || 'one';
    }

};

<Input type="text" name="defcon" converter={myConverter} state={state}/>
```

## Validations

Before submitting the form, all user input is validated. The field validations are configured according to the following input atributes:

- `[required]`
- `[pattern]`
- `[min]` and `[max]` for `[type=number|date|time]`
- `[type=email]`
- `[type=url]`

When the user submits a `Form`, the `onSubmit` callback will only be called if all validations pass. If there are errors an error message will be displayed instead, and focus will be transferred to the first field that didn't pass.

To override the validation applied to a component, return either a `Promise` or the validation result:

```JavaScript
const validator = (value, props) => {
  return fetch('checkValueIsAvailable', {
    body: { username: value }
  });
}

<Form onSubmit={save} state={state}>
  <label htmlFor="username">Choose your username</label>
  <Input type="text" name="username" validator={validator} />
</Form>
```

The function should return `undefined` if the validation passes, or an error message otherwise.

## Internationalization

To override the locale for validation messages, call `Messages.set()` once when initializing your application:

```JavaScript
import { Messages } from '@koliseoapi/react-forms';

Messages.set({
    required: "Por favor, rellena este campo",
    min: "El valor debe ser mayor o igual que ${min}"
})
```

The full list of values validation messages is available in [Messages.js](https://github.com/koliseoapi/react-forms/blob/master/src/Messages.js).

## Accessibility

Both input fields and alert messages will use the corresponding ARIA attributes (`aria-invalid`, `aria-describedBy` and `role=alert`) to be used by assistive technologies.

## Play with the test suite

Feel free to play with our test suite:

```bash
# To run the test suite based on Mocha
npm run test
npm run coverage

# To fiddle with the browser and a sample form at
# http://localhost:8080/test-page/example.html
npm run dev
```
