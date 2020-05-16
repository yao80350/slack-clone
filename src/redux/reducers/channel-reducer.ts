import { ChannelAction, ActionTypes } from "../actions";
import { Channel } from "../../components/Channels/Channels";

export type ChannelState = {
    currentChannel: null | Channel;
};

const INITIAL_STATE: ChannelState = {
    currentChannel: null,
};

const channelReducer = (state = INITIAL_STATE, action: ChannelAction) => {
    switch (action.type) {
        case ActionTypes.SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel: action.payload,
            };
        default:
            return state;
    }
};

export default channelReducer;
