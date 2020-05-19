import { ActionTypes } from "./types";

export type UserAction = {
    type: ActionTypes;
    payload: firebase.User;
};

export const setUser = (user: firebase.User) => {
    return { type: ActionTypes.SET_USER, payload: user };
};

export const clearUser = () => {
    return { type: ActionTypes.CLEAR_USER };
};
