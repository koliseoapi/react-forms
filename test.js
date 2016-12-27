import { Form, Input, TextArea } from './lib/react-data-input'
import React from 'react'
import assert from 'assert';
import { describe } from 'mocha';
import { mount, shallow } from 'enzyme';
import 'jsdom-global/register';

// const fail = msg => () => ok(false, msg)
const equal = assert.equal;
describe('Input[type=text]', function() {

  it('should render correctly', function() {
    const state = { name: "foobar" };
    const wrapper = shallow(<Input type="text" className="foo" required state={state} name="name" />);
    const input = wrapper.find('input');
    //equal('foobar', wrapper.get(0).value);
    assert(input.hasClass('foo'));
    equal(true, input.props().required);
  });

  it('should update int on property change', function() {
    const state = { age: 20 };
    const wrapper = mount(<Input type="number" name="age" state={state} step="1"/>);
    wrapper.find('input').simulate('change', {
      target: { value: "32.2" }
    });
    equal(32, state.age);
  });
  
  it('should update float on property change', function() {
    const state = { age: 20 };
    const wrapper = mount(<Input type="number" name="age" step="0.01" state={state} />);
    wrapper.find('input').simulate('change', {
      target: { value: "32.2" }
    });
    equal(32.2, state.age);
  });

  it('should not propagate the state property', function() {
    const wrapper = shallow(<Input type="text" state={{ foo: 'foo' }} name="name" />);
    const input = wrapper.find('input');
    assert(!input.props().state, 'state attribute was propagated to nested <input>');
  });

});

describe('Form', function() {

  it('should call onSubmit only if validation passes', function() {
    const state = { };
    let invoked = false;
    function callback() { invoked = true };
    const wrapper = mount(<Form onSubmit={callback}><Input type="text" required state={state} name="name" /></Form>);
    const input = wrapper.find('form').simulate('submit', {
      target: { 
        validate: function() { 
          return false; 
        } 
      }
    });
    assert(!invoked, 'Invoked onSubmit() when validation was not passing');
  });

});
