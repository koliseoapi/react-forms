import 'jsdom-global/register';
import React from 'react'
import { Form, TextArea } from '../src/react-data-input'
import assert from 'assert';
import { describe } from 'mocha';
import { mount } from 'enzyme';

const equal = assert.equal;
function noop() { };
describe('TextArea', function () {

  let form;

  function mountTextArea(textarea, state) {
    form = mount(<Form onSubmit={noop} state={state}>{textarea}</Form>);
    return form.find(TextArea).childAt(0);
  }

  it('should not propagate specific properties to the HTML5 element', function () {
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

