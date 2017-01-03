/*

  Example code to use in browser

*/
import { Form, Input } from '../lib/react-data-input';
import ReactDOM from "react-dom";
import React from 'react';

const output = document.getElementsByClassName('output')[0];

window.addEventListener('error', function(err) {
  console.error(err);
  output.classList.add('error');
  output.innerHTML = err.message;
});

// just a class that can be spied for changes
class MyState {

  constructor(props) {
    Object.assign(this, props);
  }

  set name(name) {
    this._name = name;
    this.printState();
  }

  get name() {
    return this._name;
  }

  set age(age) {
    this._age = age;
    this.printState();
  }

  get age() {
    return this._age;
  }

  printState(message) {
    output.classList.remove('error');
    output.innerHTML = message || JSON.stringify(this);
  }

}

function onSubmit() {
  state.printState('onSubmit() invoked successfully');
  setTimeout(() => state.printState(), 5000);
}

function MyApp(props) {
  return (
    <Form onSubmit={onSubmit} state={state}>
      <label htmlFor="name">Name</label>
      <Input name="name" type="text" required maxLength="50" />
      <label htmlFor="age">Age</label>
      <Input name="age" type="number" min="0" max="120" required />
      <input type="submit"/>
    </Form>
  );
}

const state = new MyState({ name: 'John Doe', age: 23 });

ReactDOM.render(<MyApp/>, document.getElementsByClassName('container')[0]);
