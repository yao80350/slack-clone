import { createStore, applyMiddleware, Middleware } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";

import reducers from "./reducers";

const middlewares: Middleware[] = [thunk];

if (process.env.NODE_ENV === "development") {
    middlewares.push(logger);
}

const store = createStore(reducers, applyMiddleware(...middlewares));

export { store };
