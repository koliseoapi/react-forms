/*

  Example code to use in browser

*/
import { Form, Input, RadioGroup } from "../src/react-data-input";
import ReactDOM from "react-dom";
import React from "react";
import MyState from "./MyState";

// just a class that can be spied for changes
const output = document.getElementsByClassName("output")[0];

window.addEventListener("error", function(err) {
  console.error(err);
  output.classList.add("error");
  output.innerHTML = err.message;
});

const state = new MyState({ name: "John Doe", age: 23, subscribed: true });
function onSubmit() {
  console.log("onSubmit() invoked successfully");
  printState();
}

function printState() {
  output.classList.remove("error");
  output.classList.add("highlight");
  output.innerHTML = JSON.stringify(state);
  setTimeout(() => output.classList.remove("highlight"), 0);
}

function MyApp(props) {
  return (
    <Form onSubmit={onSubmit} state={state}>
      <label htmlFor="name">Name</label>
      <Input
        id="name"
        name="name"
        type="text"
        autocomplete="off"
        required
        maxLength="50"
        onChange={printState}
        aria-describedby="name-desc"
      />
      <p id="name-desc">* Please introduce the first and last name</p>
      <label htmlFor="age">Age</label>
      <Input
        id="age"
        name="age"
        type="number"
        min="0"
        max="120"
        required
        onChange={printState}
      />
      <label>
        <Input name="subscribed" type="checkbox" onChange={printState} />{" "}
        Subscribe to newsletter
      </label>
      <RadioGroup>
        <label>
          <Input
            name="gender"
            type="radio"
            value="male"
            onChange={printState}
          />{" "}
          Male
        </label>
        <label>
          <Input
            name="gender"
            type="radio"
            value="female"
            onChange={printState}
          />{" "}
          Female
        </label>
      </RadioGroup>
      <input type="submit" value="Submit form and see resulting state" />
    </Form>
  );
}

ReactDOM.render(<MyApp />, document.getElementsByClassName("container")[0]);
printState();
