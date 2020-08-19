/*

  Example code to use in browser

*/
import { Form, Input, Button } from "../src/index";
import ReactDOM from "react-dom";
import React, { useState, useContext } from "react";
import { FormContext } from "../src/components/Form";

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

const initialState: MyState = {
  name: "John Doe",
  age: 23,
  subscribed: true,
  gender: "other",
};

function MyApp() {
  const [output, setOutput] = useState(initialState);
  const [outputClass, setOutputClass] = useState("");

  function onSubmit(newState: MyState) {
    console.log(
      "onSubmit() invoked with: " + JSON.stringify(newState, undefined, "  ")
    );
    setOutputClass("highlight");
    setOutput(newState);
    setTimeout(() => setOutputClass(""), 0);
    return Promise.resolve();
  }

  return (
    <>
      <Form onSubmit={onSubmit} initialValues={initialState}>
        <label htmlFor="name">Name</label>
        <Input
          name="name"
          type="text"
          autoComplete="off"
          required
          maxLength={50}
          aria-describedby="name-desc"
        />
        <p id="name-desc">Introduce the first and last name of the user</p>
        <label htmlFor="age">Age</label>
        <Input name="age" type="number" min="0" max="120" required />
        <label>
          <Input name="subscribed" type="checkbox" /> Subscribe to newsletter
        </label>
        <label>
          <Input name="gender" type="radio" defaultValue="male" /> Male
        </label>
        <label>
          <Input name="gender" type="radio" defaultValue="female" /> Female
        </label>
        <label>
          <Input name="gender" type="radio" defaultValue="other" /> Other
        </label>
        <label htmlFor="expires">Expires</label>
        <Input
          name="expires"
          type="date"
          min={new Date().toISOString().substring(0, 10)}
          required
          pattern="\d{4}-\d{2}-\d{2}"
        />
        <label htmlFor="time">Time</label>
        <Input name="time" id="time" type="time" pattern="[0-9]{2}:[0-9]{2}" />
        <Button>Submit form and see resulting state</Button>
      </Form>
      <p>Form state:</p>
      <pre className={`output ${outputClass}`}>
        {JSON.stringify(output, undefined, "  ")}
      </pre>
    </>
  );
}

ReactDOM.render(<MyApp />, document.getElementsByClassName("container")[0]);
