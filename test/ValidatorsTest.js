import 'jsdom-global/register';
import React from 'react'
import assert from 'assert';
import { describe } from 'mocha';
import Validators from '../src/Validators';

const equal = assert.equal;
function noop() { };
describe('Validators', function () {

  it('Required should reject empty, null, false and undefined', function () {
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

  it('number.required should reject null and undefined, but acept 0', function () {
    const required = Validators['number.required'];
    const props = { required: true };
    assert(!required(0, props));
    assert(required(null, props));
    assert(required(undefined, props));
  });

  it('Min value', function () {
    const min = Validators['number.min'];
    const props = { min: 0 };
    assert(min(-1, props), 'Validation passed for value < min');
    assert(!min(0, props), 'Validation rejected for value == min');
    assert(!min(1, props), 'Validation rejected for value > min');
    assert(!min(0, {}), 'Validation rejected without a min property');
  });

  it('Max value', function () {
    const max = Validators['number.max'];
    const props = { max: 100 };
    assert(!max(99, props), 'Validation rejected for value < max');
    assert(!max(100, props), 'Validation rejected for value == max');
    assert(max(101, props), 'Validation passed for value > max');
    assert(!max(0, {}), 'Validation rejected without a max property');
  });

  it('URL format', function () {
    const url = Validators.url;
    assert(!url("http://foo.bar"), 'Validation rejected for valid url');
    assert(url("foo"), 'Validation passed for invalid url');
  });

  it('E-mail format', function () {
    const email = Validators.email;
    assert(!email("a@b"), 'Validation rejected for valid email');
    assert(email("foo"), 'Validation passed for invalid email');
  });

  it('Pattern format', function () {
    const pattern = Validators.pattern;
    const props = { pattern: '[0-9]+' };
    assert(!pattern("1234", props), 'Validation rejected for valid input');
    assert(pattern("ab1234", props), 'Validation passed for invalid input');
    assert(pattern("1234cd", props), 'Validation passed for invalid input');
  });

  it('#filterValidationProps should filter only properties that are not empty or false', function () {
    const filtered = Validators.filterValidationProps({ min: '1', foo: 'bar', required: false });
    assert.equal(2, Object.keys(filtered).length);
  })

});

