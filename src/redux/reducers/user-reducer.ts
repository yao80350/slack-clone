import { ActionTypes, UserAction } from "../actions";

export type UserState = {
    currentUser: null | firebase.User;
    isLoading: boolean;
};

const INITIAL_STATE: UserState = {
    currentUser: null,
    isLoading: true,
};

const userReducer = (state = INITIAL_STATE, action: UserAction) => {
    switch (action.type) {
        case ActionTypes.SET_USER:
            return {
                ...state,
                currentUser: action.payload,
                isLoading: false,
            };
        case ActionTypes.CLEAR_USER:
            return {
                ...state,
                currentUser: null,
                isLoading: false,
            };
        default:
            return state;
    }
};

export default userReducer;
