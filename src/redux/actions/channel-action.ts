import { ActionTypes } from "./";
import { Channel } from "../../components/Channels/Channels";

export type ChannelAction = {
    type: ActionTypes;
    payload: Channel;
};

export const setCurrentChannel = (channel: Channel) => {
    return {
        type: ActionTypes.SET_CURRENT_CHANNEL,
        payload: channel,
    };
};
