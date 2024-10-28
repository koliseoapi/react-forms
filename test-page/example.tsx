/*

  Example code to use in browser

*/
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Button, Form, Input, Select, TextArea } from "../src/index";

type Pet = "cat" | "dog" | "other";

interface MyState {
  name: string;
  description: string;
  age: number;
  subscribed: boolean;
  gender?: "male" | "female" | "other";
  expires?: string;
  time?: string;
  pet: Pet;
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
  description: "",
  age: 23,
  subscribed: true,
  gender: "other",
  pet: "dog",
};

function MyApp() {
  const [output, setOutput] = useState(initialState);
  const [outputClass, setOutputClass] = useState("");
  const [pet, setPet] = useState<Pet>(initialState.pet);

  function onSubmit(newState: MyState) {
    console.log(
      "onSubmit() invoked with: " + JSON.stringify(newState, undefined, "  ")
    );
    setOutputClass("highlight");
    setOutput(newState);
    setTimeout(() => setOutputClass(""), 0);
    return Promise.resolve();
  }

  // Example controlled form
  // <Form onSubmit={onSubmit} values={output} setValues={setOutput}>
  // Example uncontrolled form
  // <Form onSubmit={onSubmit} initialValues={initialState}>
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
        <div className="flex-column">
          <label htmlFor="description">Description</label>
          <TextArea name="description" required />
        </div>
        <label htmlFor="age">Age</label>
        <Input name="age" type="number" min="0" max="120" required />
        <label>
          <Input name="subscribed" type="checkbox" /> Subscribe to newsletter
        </label>
        <label className="radio">
          <Input name="gender" type="radio" defaultValue="male" /> Male
        </label>
        <label className="radio">
          <Input name="gender" type="radio" defaultValue="female" /> Female
        </label>
        <label className="radio">
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
        <Select name="pet" required value={pet} setValue={setPet}>
          <option value="cat">Cat</option>
          <option value="dog">Dog</option>
          <option value="other">Other</option>
        </Select>
        <p>Selected pet: {pet}</p>
        <Button type="submit">Submit form and see resulting state</Button>
      </Form>
      <pre className={`output ${outputClass}`}>
        {JSON.stringify(output, undefined, "  ")}
      </pre>
    </>
  );
}

const root = createRoot(document.getElementsByClassName("container")[0]);
root.render(<MyApp />);
