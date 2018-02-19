import 'jsdom-global/register';
import React from 'react'
import { Form, Input, RadioGroup } from '../src/react-data-input'
import assert from 'assert';
import { describe } from 'mocha';
import { mount } from 'enzyme';
import sinon from 'sinon';

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


  it('should render type=radio', function () {
    const state = { gender: 'male' };
    form = mount(
      <Form onSubmit={noop} state={state}>
        <RadioGroup>
          <div>
            <Input type="radio" name="gender" value="male" />,
            <Input type="radio" name="gender" value="female" />
          </div>
        </RadioGroup>
      </Form>, state
    );
    const div = form.childAt(0).childAt(0);
    let input1 = div.childAt(0).childAt(0);
    let input2 = div.childAt(1).childAt(0);
    equal('male', input1.props().value);
    equal('female', input2.props().value);
    assert(input1.props().checked);
    assert(!input2.props().checked);

    // trigger change in input2
    input2.simulate('change', {
      target: { value: "female", checked: true }
    });
    //form.update();
    input1 = div.childAt(0).childAt(0);
    input2 = div.childAt(1).childAt(0);
    equal('female', state.gender);
    assert(!input1.props().checked);
    assert(input2.props().checked);
  });

  it('should render type specific validation errors', function() {
    const state = { email: 'foo'};
    const input = mountInput(<Input type="email" required name="email" />, state);
    return form.instance().validationComponents[0].validate().then(() => {
      form.update();
      assert.equal(1, form.find('.input-error').length);
    });
  });

});
