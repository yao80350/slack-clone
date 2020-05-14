import { UserAction } from "./";

export enum ActionTypes {
    SET_USER = "SET_USER",
    CLEAR_USER = "CLEAR_USER",
}

export type Action = UserAction;
