import React from "react";
import { connect } from "react-redux";
import {
    Menu,
    Icon,
    Modal,
    Form,
    Input,
    Button,
    Label,
} from "semantic-ui-react";

import { InputChangeEvent } from "../../type";
import { getRef } from "../../firebase";
import { StoreState } from "../../redux/reducers";
import { setCurrentChannel } from "../../redux/actions/channel-action";

type ChannelsProps = {
    currentUser: null | firebase.User;
    setCurrentChannel: typeof setCurrentChannel;
};

export type Channel = {
    id: string;
    name: string;
    details?: string;
    createdBy?: string;
};

type Notifications = {
    [key: string]: {
        lastTotalCount: number;
        lastViewCount: number;
        count: number;
    };
};

class Channels extends React.Component<ChannelsProps> {
    state = {
        channels: [],
        modal: false,
        channelName: "",
        channelDetails: "",
        firstLoad: true,
        activeChannel: "",
        notifications: {},
        lastCount: 0,
        channelsRef: getRef("channels"),
    };

    componentDidMount() {
        this.addListeners();
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    addListeners = () => {
        const loadedChannels: firebase.database.DataSnapshot[] = [];
        this.state.channelsRef.on("child_added", (snap) => {
            loadedChannels.push(snap.val());
            this.setState({ channels: loadedChannels }, this.setFirstChannel);
            snap.key && this.addNotificationLisenner(snap.key);
        });
    };

    removeListeners = () => {
        this.state.channelsRef.off();
    };

    changeChannel = (channel: Channel) => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
        this.clearNotification(channel.id);
    };

    setActiveChannel = (channel: Channel) => {
        this.setState({ activeChannel: channel.id });
    };

    setFirstChannel = () => {
        const { firstLoad, channels } = this.state;
        if (firstLoad && channels[0]) {
            this.changeChannel(channels[0]);
            this.setState({ firstLoad: false });
        }
    };

    addNotificationLisenner = (channelId: string) => {
        console.log(channelId);
        getRef("messages")
            .child(channelId)
            .on("value", (snap) => {
                const {
                    activeChannel,
                    notifications,
                }: {
                    activeChannel: string;
                    notifications: Notifications;
                } = this.state;
                if (!notifications[channelId] || channelId === activeChannel) {
                    console.log(2);
                    this.setState({
                        notifications: {
                            ...notifications,
                            [channelId]: {
                                lastTotalCount: snap.numChildren(),
                                lastViewCount: snap.numChildren(),
                                count: 0,
                            },
                        },
                    });
                } else {
                    console.log(3);
                    this.setState({
                        notifications: {
                            ...notifications,
                            [channelId]: {
                                ...notifications[channelId],
                                lastTotalCount: snap.numChildren(),
                                count:
                                    snap.numChildren() -
                                    notifications[channelId].lastViewCount,
                            },
                        },
                    });
                }
            });
    };

    clearNotification = (channelId: string) => {
        const { notifications }: { notifications: Notifications } = this.state;
        const notification = notifications[channelId];

        notification &&
            this.setState({
                notifications: {
                    ...notifications,
                    [channelId]: {
                        ...notification,
                        lastViewCount: notification.lastTotalCount,
                        count: 0,
                    },
                },
            });
    };

    getNotificationCount = (channelId: string): number => {
        const { notifications }: { notifications: Notifications } = this.state;
        const notification = notifications[channelId];

        if (notification) {
            return notification.count;
        } else {
            return 0;
        }
    };

    displayChannels = () => {
        return this.state.channels.map((channel: Channel) => (
            <Menu.Item
                className="item"
                key={channel.id}
                onClick={() => {
                    this.changeChannel(channel);
                }}
                name={channel.name}
                active={channel.id === this.state.activeChannel}
            >
                # {channel.name}
                {this.getNotificationCount(channel.id) > 0 && (
                    <Label color="red">
                        {this.getNotificationCount(channel.id)}
                    </Label>
                )}
            </Menu.Item>
        ));
    };

    handleModal = () => {
        this.setState({ modal: !this.state.modal });
    };

    handleChange = (event: InputChangeEvent) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    isFormValid = () => {
        return (
            this.state.channelName.trim() && this.state.channelDetails.trim()
        );
    };

    addChannel = async () => {
        const { channelsRef, channelName, channelDetails } = this.state;
        const key = channelsRef.push().key;
        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: this.props.currentUser?.uid,
        };
        if (key) {
            try {
                await channelsRef.child(key).update(newChannel);
                this.setState({ channelName: "", channelDetails: "" });
                this.handleModal();
            } catch (error) {
                console.log(error.message);
            }
        }
    };

    handleSubmit = () => {
        if (this.isFormValid()) {
            console.log("channel added");
            this.addChannel();
        }
    };

    render() {
        const { channels, modal, channelName, channelDetails } = this.state;

        return (
            <>
                <Menu.Menu className="channels">
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" /> CHANNELS
                        </span>
                        ({channels.length}){" "}
                        <Icon name="add" onClick={this.handleModal} />
                    </Menu.Item>
                    {this.displayChannels()}
                </Menu.Menu>
                {/* add channel modal */}
                <Modal basic open={modal} onClose={this.handleModal}>
                    <Modal.Header>Add a Channel</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <Input
                                    fluid
                                    label="Name of Channel"
                                    name="channelName"
                                    value={channelName}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    fluid
                                    label="About the Channel"
                                    name="channelDetails"
                                    value={channelDetails}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            color="green"
                            inverted
                            onClick={this.handleSubmit}
                        >
                            <Icon name="checkmark" /> Add
                        </Button>
                        <Button color="red" inverted onClick={this.handleModal}>
                            <Icon name="remove" /> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = ({ user: { currentUser } }: StoreState) => ({
    currentUser,
});

export default connect(mapStateToProps, { setCurrentChannel })(Channels);
