import 'jsdom-global/register';
import React from 'react'
import { Form, Input, TextArea } from '../src/react-data-input'
import assert from 'assert';
import { describe } from 'mocha';
import { mount, shallow } from 'enzyme';
import Validators from '../src/Validators';
import Converters from '../src/Converters';
import { isFalse } from '../src/utils';
import sinon from 'sinon';

// const fail = msg => () => ok(false, msg)
const equal = assert.equal;
function noop() {};
describe('Input', function() {

  let form;

  function mountInput(input, state) {
    form = mount(<Form onSubmit={noop} state={state}>{input}</Form>);
    return form.find(Input).childAt(0);
  }

  it('should render correctly', function() {
    const state = { name: "foobar" };
    const input = mountInput(<Input type="text" className="foo" required name="name" />, state);
    assert(input.hasClass('foo'));
    equal(true, input.props().required);
    form.unmount();
  });

  it('should render a validation error', function() {
    const state = { };
    const input = mountInput(<Input type="text" required name="name" />, state);
    return form.instance().validationComponents[0].validate().then(() => {
      form.update();
      assert.equal(1, form.find('.input-error').length);
    });
  });

  it('should update int on change', function() {
    const state = { age: 20, color: 'red' };
    const callback = sinon.spy();
    const input = mountInput(<Input type="number" name="age" state={state} step="1" onChange={callback}/>, state);
    input.simulate('change', {
      target: { value: "32.2" }
    });
    equal(32, state.age);
    equal('red', state.color);
    assert(callback.called, "Did not invoke callback specified by user");
  });
  
  it('should update float on change', function() {
    const state = { age: 20 };
    const input = mountInput(<Input type="number" name="age" step="0.01" />, state);
    input.simulate('change', {
      target: { value: "32.2" }
    });
    equal(32.2, state.age);
  });

  it('should use checked with type=checkbox', function() {
    const state = { subscribed: true };
    const input = mountInput(<Input type="checkbox" name="subscribed" />, state);
    equal(true, input.props().checked);
    equal(undefined, input.props().value);
  });

  it('should not throw required error with not required checkboxes', function() {
    const state = { subscribed: false };
    const input = mountInput(<Input type="checkbox" name="subscribed" required={false}/>, state);
    return form.instance().validationComponents[0].validate().then(() => {
      form.update();
      assert.equal(0, form.find('.input-error').length);
    });
  });

  it('should throw required error with not required checkboxes', function() {
    const state = { subscribed: false };
    const input = mountInput(<Input type="checkbox" name="subscribed" required={true}/>, state);
    return form.instance().validationComponents[0].validate().then(() => {
      form.update();
      assert.equal(1, form.find('.input-error').length);
    });
  });

  it('should not propagate specific properties to the HTML5 element', function() {
    const input = mountInput(<Input type="text" className="foo" state={{ foo: 'foo' }} name="name" />, {});
    assert(!input.props().state, 'state attribute was propagated to nested <input>');
  });

  function initAsyncValidator(state) {
    const validator = (value) => new Promise((resolve) => {
      resolve(value === "abc"? undefined : "Validation failed");
    });
    const wrapper = mount(
      <Form onSubmit={noop} state={state}>
        <Input type="text" name="foo" validator={validator} />
      </Form>
    );
    return wrapper.instance();
  }

  it('custom validator with Promise expected to fail', function() {
    const state = { foo: 'xyz' };
    const form = initAsyncValidator(state);
    return form.validate().then((result) => {
      assert.equal(false, result);
    });
  });

  it('custom validator with Promise expected to pass', function() {
    const state = { foo: 'abc' };
    const form = initAsyncValidator(state);
    return form.validate().then(result => {
      assert.equal(true, result);
    });
  });

});

describe('TextArea', function() {

  let form;

  function mountTextArea(textarea, state) {
    form = mount(<Form onSubmit={noop} state={state}>{textarea}</Form>);
    return form.find(TextArea).childAt(0);
  }

  it('should not propagate specific properties to the HTML5 element', function() {
    const testConverter = { 
      toObject(value) {
        return value;
      },
      toString(value) {
        return value;
      }
    }
    const textarea = mountTextArea(<TextArea className="foo" state={{ foo: 'foo' }} name="name" converter={testConverter} />, {});
    assert(!textarea.props().converter, 'converter attribute was propagated to nested <textarea>');
  })

})

describe('Form', function() {

  function submit({ callback, state }) {
    const form = mount(<Form onSubmit={callback}><Input type="text" required state={state} name="name" /></Form>);
    return form.instance().onSubmit({ preventDefault: noop });
  }

  it('should call onSubmit only if validation passes', function() {
    const state = { };
    const callback = sinon.spy();
    return submit({ callback, state }).then(() => {
      assert(!callback.called, 'Invoked onSubmit() when validation was not passing');
    });
  });

  it('should call onSubmit if validation passes', function() {
    const state = { name: 'foo' };
    const callback = sinon.spy();
    return submit({ callback, state }).then(() => {
      assert(callback.called, 'Not invoked onSubmit() when validation was passing');
    });
  });

});

describe('Validators', function() {

  it('Required should reject empty, null, false and undefined', function() {
    const required = Validators.required; 
    const props = { required: true };
    assert(!required("foo", props));
    assert(required(null, props));
    assert(required(undefined, props));
    assert(required(false, props));
    assert(required("", props));

    // to be confirmed: let's reject blank strings as well
    assert(required(" \t", props));
  });

  it('number.required should reject null and undefined, but acept 0', function() {
    const required = Validators['number.required']; 
    const props = { required: true };
    assert(!required(0, props));
    assert(required(null, props));
    assert(required(undefined, props));
  });

  it('Min value', function() {
    const min = Validators['number.min']; 
    const props = { min: 0 };
    assert(min(-1, props), 'Validation passed for value < min');
    assert(!min(0, props), 'Validation rejected for value == min');
    assert(!min(1, props), 'Validation rejected for value > min');
    assert(!min(0, {}), 'Validation rejected without a min property');
  });

  it('Max value', function() {
    const max = Validators['number.max']; 
    const props = { max: 100 };
    assert(!max(99, props), 'Validation rejected for value < max');
    assert(!max(100, props), 'Validation rejected for value == max');
    assert(max(101, props), 'Validation passed for value > max');
    assert(!max(0, {}), 'Validation rejected without a max property');
  });

  it('URL format', function() {
    const url = Validators.url; 
    assert(!url("http://foo.bar"), 'Validation rejected for valid url');
    assert(url("foo"), 'Validation passed for invalid url');
  });

  it('E-mail format', function() {
    const email = Validators.email; 
    assert(!email("a@b"), 'Validation rejected for valid email');
    assert(email("foo"), 'Validation passed for invalid email');
  });

  it('Pattern format', function() {
    const pattern = Validators.pattern; 
    const props = { pattern: '[0-9]+' };
    assert(!pattern("1234", props), 'Validation rejected for valid input');
    assert(pattern("ab1234", props), 'Validation passed for invalid input');
    assert(pattern("1234cd", props), 'Validation passed for invalid input');
  });

  it('#filterValidationProps should filter only properties that are not empty or false' , function() {
    const filtered = Validators.filterValidationProps({ min: '1', foo: 'bar', required: false });
    assert.equal(2, Object.keys(filtered).length);
  })

});

