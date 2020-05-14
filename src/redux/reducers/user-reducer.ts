import { ActionTypes, Action } from "../actions";

export type UserState = {
    currentUser: null | firebase.User;
    isLoading: boolean;
};

const INITIAL_STATE: UserState = {
    currentUser: null,
    isLoading: true,
};

const userReducer = (state = INITIAL_STATE, action: Action) => {
    switch (action.type) {
        case ActionTypes.SET_USER:
            return {
                ...state,
                currentUser: action.payload,
                isLoading: false,
            };
        case ActionTypes.CLEAR_USER:
            return {
                ...INITIAL_STATE,
                isLoading: false,
            };
        default:
            return state;
    }
};

export default userReducer;
