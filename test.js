import { Form, Input, TextArea } from './lib/react-data-input'
import React from 'react'
import { equal } from 'assert';
import { describe } from 'mocha';
import { mount, shallow } from 'enzyme';
import 'jsdom-global/register';

// const fail = msg => () => ok(false, msg)

describe('Input[type=text]', function() {

  it('should render correctly', function() {
    const state = { name: "foobar" };
    const wrapper = mount(<Input type="text" className="foo" required state={state} name="name" />);
    const input = wrapper.find('input');
    //equal('foobar', wrapper.get(0).value);
    equal('foo', wrapper.prop('className'));
    equal(true, wrapper.prop('required'));
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

});
