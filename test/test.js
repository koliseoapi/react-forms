import 'jsdom-global/register';
import React from 'react'
import { Form, Input, TextArea } from '../lib/react-data-input'
import assert from 'assert';
import { describe } from 'mocha';
import { mount, shallow } from 'enzyme';
import Validators from '../lib/Validators';
import Converters from '../lib/Converters';
import sinon from 'sinon';

// const fail = msg => () => ok(false, msg)
const equal = assert.equal;
function noop() {};
describe('Input', function() {

  function mountInput(input, state) {
    const wrapper = mount(<Form onSubmit={noop} state={state}>{input}</Form>);
    return wrapper.find(Input).childAt(0);
  }

  it('should render correctly', function() {
    const state = { name: "foobar" };
    const input = mountInput(<Input type="text" className="foo" required name="name" />, state);
    assert(input.hasClass('foo'));
    equal(true, input.props().required);
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

describe('Form', function() {

  it('should call onSubmit only if validation passes', function() {
    const state = { };
    const callback = sinon.spy();
    const wrapper = mount(<Form onSubmit={callback}><Input type="text" required state={state} name="name" /></Form>);
    const input = wrapper.find('form').simulate('submit');
    assert(!callback.called, 'Invoked onSubmit() when validation was not passing');
  });

});

describe('Validators', function() {

  it('Required should reject null and undefined', function() {
    const required = Validators.required; 
    assert(!required("foo"));
    assert(!required(0));
    assert(required(null));
    assert(required(undefined));
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

  it('#filterValidationProps should filter only properties that are not empty' , function() {
    const filtered = Validators.filterValidationProps({ min: '1', foo: 'bar' });
    assert.equal(1, Object.keys(filtered).length);
  })

});

describe('Converters', function() {

  it('#text should transform the empty String to undefined', function() {
    const text = Converters.text; 
    assert(typeof (text.toObject("")) === 'undefined');
    assert(typeof (text.toObject("  ")) === 'undefined');
    assert.equal("  abc  ", text.toObject("  abc  "));
  });

});