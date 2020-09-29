import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { applyForm, mapForm, scopeFormElement, textbox, fromProp } from "./forms";

interface FormData {
  first: string;
  middle: string;
  last: string;
}

const firstLens = fromProp<FormData>()('first')
const middleLens = fromProp<FormData>()('middle')
const lastLens = fromProp<FormData>()('last')

const builtForm =
  applyForm(
    applyForm(
      mapForm(
        (firstName: string) => (middleName: string) => (lastName: string) => `${firstName} ${middleName} ${lastName}`,
        scopeFormElement(firstLens, textbox)
      ),
      scopeFormElement(middleLens, textbox)
    ),
    scopeFormElement(lastLens, textbox)
  )

const Form = () => {
  const [value, setValue] = useState<FormData>({
    first: "first",
    middle: "middle",
    last: "last",
  });
  const form = builtForm(value);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const submitValue = form.result();
        console.log(submitValue);
      }}
    >
      {form.ui(setValue)}
      <button>save</button>
    </form>
  );
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Form />
      </header>
    </div>
  );
}

export default App;
