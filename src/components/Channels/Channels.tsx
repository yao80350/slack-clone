import React from "react";
import { connect } from "react-redux";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";

import { InputChangeEvent } from "../../type";
import firebase from "../../firebase";
import { StoreState } from "../../redux/reducers";

type ChannelsProps = {
    currentUser: null | firebase.User;
};

class Channels extends React.Component<ChannelsProps> {
    state = {
        channels: [],
        modal: false,
        channelName: "",
        channelDetails: "",
        channelsRef: firebase.database().ref("channels"),
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
                    {/* { channels } */}
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

export default connect(mapStateToProps)(Channels);
