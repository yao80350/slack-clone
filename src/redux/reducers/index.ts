import { combineReducers } from "redux";

import userReducer, { UserState } from "./user-reducer";
import channelReducer, { ChannelState } from "./channel-reducer";

export type StoreState = {
    user: UserState;
    channel: ChannelState;
};

const rootReducer = combineReducers<StoreState>({
    user: userReducer,
    channel: channelReducer,
});

export default rootReducer;
