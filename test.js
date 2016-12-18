import Validator from './lib/en-validator'
//import React from 'react'
import { equal } from 'assert';
import { describe } from 'mocha';

const TYPES = Validator.TYPES;
const props = {
  name: {
    type: Types.STRING,
    attrs: { required: true }
  },
  height: {
    type: Types.NUMBER
  },
  weight: {
    type: Types.NUMBER,
    attrs: { min: 10, max: 100 }
  }
}

const fail = msg => () => ok(false, msg)
const validate = (state) => {
  return new Validator(
    { props, state }
  ).validate()
}

describe('Validator', function() {
  describe('#required', function(done) {
    return validate({})
      .then((messages) => {
        equal('kk', messages.name);
        ok(!messages.height, 'Height did not pass');
      })
  });
});

/*
const test = f => x => f(x)

const spec = (name, state, onSuccess, onFailure) => {
  console.log(`> ${name}...`)
  return new Validator(
    { props, state }
  ).validate()
  .then(onSuccess, onFailure)
  .then(() => {
    console.log(`√ ${name}`)
  })
  .catch((err) => {
    console.error(`ø ${name}`)
    console.error(err.stack)
    return Promise.reject(err)
  })
}

const runner = (specs) => {
  return Promise.all(specs).then(() => console.log('OK.'), () => {
    console.log('Failed.')
    process.exit(1);
  })
}

runner([
  spec(
    'Required value missing',
    {},
    fail('Form validated properly'),
    test((state) => {
      ok(state.name === 'kk', 'state.name passed')
      ok(!state.height, 'state.height failed')
    })
  ),
  spec(
    'Name is there',
    {
      name: 'Josh',
      age: 14,
    },
    fail('Form validated properly'),
    test((state) => {
      ok(state.name === 'Josh', 'state.name is present')
    })
  ),
  spec(
    'Stats is empty',
    {
      name: 'Josh',
      stats: {},
      age: 21,
    },
    fail('Form validated properly'),
    test((state) => {
      ok(state.stats instanceof Error, 'state.stats is an empty obj')
    })
  ),
  spec(
    'Stats has incorrect props',
    {
      name: 'Josh',
      stats: { height: 151, weight: '83' },
      age: 28,
    },
    fail('Form validated properly'),
    test((state) => {
      ok(state.stats instanceof Error, 'state.stats is an empty obj')
    })
  ),
  spec(
    'All good',
    {
      name: 'Josh',
      stats: { height: 149, weight: 101 },
      age: 35,
    },
    test((state) => {
      ok(state.name === 'Josh')
      ok(state.stats.height === 149)
      ok(state.stats.weight === 101)
      ok(state.age === 35)
    }),
    fail('Form had an error')
  ),
])
*/