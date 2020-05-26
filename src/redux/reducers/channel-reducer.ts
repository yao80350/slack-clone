import { ActionTypes } from "../actions/types";
import { ChannelAction } from "../actions/channel-action";
import { Channel } from "../../components/Channels/Channels";

export type ChannelState = {
    currentChannel: null | Channel;
    isPrivateChannel: boolean | Channel;
};

const INITIAL_STATE: ChannelState = {
    currentChannel: null,
    isPrivateChannel: false,
};

const channelReducer = (state = INITIAL_STATE, action: ChannelAction) => {
    switch (action.type) {
        case ActionTypes.SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel: action.payload,
                isPrivateChannel: false,
            };
        case ActionTypes.SET_PRIVATE_CHANNEL:
            return {
                ...state,
                isPrivateChannel: action.payload,
            };
        default:
            return state;
    }
};

export default channelReducer;
