import 'jsdom-global/register';
import React from 'react'
import { Form, Input } from '../src/react-data-input'
import assert from 'assert';
import { describe } from 'mocha';
import { mount } from 'enzyme';
import sinon from 'sinon';

const equal = assert.equal;
function noop() { };
describe('Form', function () {

  function submit({ callback, state }) {
    const form = mount(<Form onSubmit={callback}><Input type="text" required state={state} name="name" /></Form>);
    return form.instance().onSubmit({ preventDefault: noop });
  }

  it('should call onSubmit only if validation passes', function () {
    const state = {};
    const callback = sinon.spy();
    return submit({ callback, state }).then(() => {
      assert(!callback.called, 'Invoked onSubmit() when validation was not passing');
    });
  });

  it('should call onSubmit if validation passes', function () {
    const state = { name: 'foo' };
    const callback = sinon.spy();
    return submit({ callback, state }).then(() => {
      assert(callback.called, 'Not invoked onSubmit() when validation was passing');
    });
  });

});
