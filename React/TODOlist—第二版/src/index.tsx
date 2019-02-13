import * as React from "react"
import { render } from "react-dom"
import rootReducer from "./reducers/index"
import { createStore } from "redux"
import { Provider } from "react-redux"
import App from "./components/app"
const store = createStore(rootReducer)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement
)
