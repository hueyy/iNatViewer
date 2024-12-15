import { type ContainerNode, render } from "preact"
import { App } from "./app.js"

import "./index.css"

render(<App />, document.getElementById("app") as ContainerNode)
