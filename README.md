A library to automatically bind to state in React applications. It does type conversion and expects that 
you will be using HTML5 validations.

```JavaScript
import { Form, Input, TextArea } from 'react-data-input';

let model = { username: 'Foo', age: 20 };

// keep a copy of your data in case the user cancels
let state = Object.assign({}, model);

function onSubmit(e) {
    e.preventDefault();

    // if the tests pass
    if (e.target.validate()) {
        save(state);
    }
}

<form onSubmit={onSubmit}>
    <Input type="text" name="username" state={state} required maxLength="100" />
    <Input type="number" name="age" min="0" step="1" state={state} />
</form>
```

These `input` fields will automatically inject changes into the corresponding property in the `state` 
instance, transforming into a number if necessary.