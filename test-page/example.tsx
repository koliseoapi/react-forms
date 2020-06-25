/*

  Example code to use in browser

*/
import { Form, Input, Button } from "../src/index";
import ReactDOM from "react-dom";
import React from "react";

interface MyState {
  name: string;
  age: number;
  subscribed: boolean;
  gender?: "male" | "female" | "other";
  expires?: string;
  time?: string;
}

// just a class that can be spied for changes
const output = document.getElementsByClassName("output")[0];

window.addEventListener("error", function (err) {
  console.error(err);
  output.classList.add("error");
  output.innerHTML = err.message;
});

const state: MyState = {
  name: "John Doe",
  age: 23,
  subscribed: true,
};

function onSubmit() {
  console.log("onSubmit() invoked successfully");
  printState();
  return Promise.resolve();
}

function printState() {
  output.classList.remove("error");
  output.classList.add("highlight");
  output.innerHTML = JSON.stringify(state);
  setTimeout(() => output.classList.remove("highlight"), 0);
}

function MyApp() {
  return (
    <Form onSubmit={onSubmit} initialValues={state}>
      <label htmlFor="name">Name</label>
      <Input
        name="name"
        type="text"
        autoComplete="off"
        required
        maxLength={50}
        onChange={printState}
        aria-describedby="name-desc"
      />
      <p id="name-desc">* Please introduce the first and last name</p>
      <label htmlFor="age">Age</label>
      <Input
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
      <label>
        <Input
          name="gender"
          type="radio"
          defaultValue="male"
          onChange={printState}
        />{" "}
        Male
      </label>
      <label>
        <Input
          name="gender"
          type="radio"
          defaultValue="female"
          onChange={printState}
        />{" "}
        Female
      </label>
      <label>
        <Input
          name="gender"
          type="radio"
          defaultValue="other"
          onChange={printState}
        />{" "}
        Other
      </label>
      <label htmlFor="expires">Expires</label>
      <Input
        name="expires"
        type="date"
        min={new Date().toISOString().substring(0, 10)}
        required
        pattern="\d{4}-\d{2}-\d{2}"
        onChange={printState}
      />
      <label htmlFor="time">Time</label>
      <Input
        name="time"
        id="time"
        type="time"
        pattern="[0-9]{2}:[0-9]{2}"
        onChange={printState}
      />
      <Button>Submit form and see resulting state</Button>
    </Form>
  );
}

ReactDOM.render(<MyApp />, document.getElementsByClassName("container")[0]);
printState();
