import * as React from "react";
import { render } from "react-dom";
import { StoreProvider } from "easy-peasy";
import store from "./store";

import App from "./App";

const rootElement = document.getElementById("root");
render(
  <StoreProvider store={store}>
    <App />
  </StoreProvider>,
  rootElement
);
