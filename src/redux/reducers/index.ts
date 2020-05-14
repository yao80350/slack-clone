import { combineReducers } from "redux";

import userReducer, { UserState } from "./user-reducer";

export type StoreState = {
    user: UserState;
};

const rootReducer = combineReducers<StoreState>({
    user: userReducer,
});

export default rootReducer;
