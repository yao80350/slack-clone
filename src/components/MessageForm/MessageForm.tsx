import React from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import { v4 } from "uuid";

import firebase from "../../firebase";
import { InputChangeEvent } from "../../type";
import { Channel } from "../Channels/Channels";
import FileModal from "../FileModal/FileModal";
import { MessageType } from "../Messages/Messages";
import ProgressBar from "../ProgressBar/ProgressBar";

type MessageFormProps = {
    messagesRef: firebase.database.Reference;
    currentUser: null | firebase.User;
    currentChannel: null | Channel;
    isProgressBarVisible: () => void;
};

class MessageForm extends React.Component<MessageFormProps> {
    state = {
        message: "",
        loading: false,
        errors: [{ message: "" }],
        modal: false,
        uploadState: "",
        percentUploaded: 0,
    };

    handleChange = (event: InputChangeEvent) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    createMessage = (url = "") => {
        const { message } = this.state;
        const currentUser = this.props.currentUser;
        if (!currentUser) return;
        const { uid, displayName, photoURL } = currentUser;
        const messages: MessageType = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: uid,
                name: displayName || "",
                avatar: photoURL || "",
            },
        };
        if (url) {
            messages.image = url;
        } else {
            messages.content = message.trim();
        }
        return messages;
    };

    sendMessage = async () => {
        const { message } = this.state;
        const { messagesRef, currentChannel } = this.props;
        if (message.trim()) {
            this.setState({ loading: true });
            if (!currentChannel) return;
            try {
                await messagesRef
                    .child(currentChannel.id)
                    .push()
                    .set(this.createMessage());
                this.setState({ loading: false, errors: [], message: "" });
            } catch (error) {
                this.setState({
                    loadding: false,
                    errors: [{ message: error.message }],
                });
            }
        } else {
            this.setState({ errors: [{ message: "Add Message" }] });
        }
    };

    handleModal = () => {
        this.setState({ modal: !this.state.modal });
    };

    sendFileMessage = async (url: string) => {
        const { messagesRef, currentChannel } = this.props;
        if (!currentChannel) return;
        try {
            await messagesRef
                .child(currentChannel.id)
                .push()
                .set(this.createMessage(url));
            this.setState({ uploadState: "done" });
            this.props.isProgressBarVisible();
        } catch (error) {
            this.setState({
                errors: [{ message: error.message }],
            });
        }
    };

    upLoadFile = (file: File, metadata: { contentType: string }) => {
        const arr = file.name.split(".");
        const type = arr[arr.length - 1];
        const path = `/chat/public/${v4()}.${type}`;
        const storageRef = firebase
            .storage()
            .ref()
            .child(path)
            .put(file, metadata);
        this.setState({ uploadState: "uploading" });
        this.props.isProgressBarVisible();
        storageRef.on(
            "state_changed",
            (snap) => {
                const percentUploaded = Math.round(
                    (snap.bytesTransferred / snap.totalBytes) * 100
                );
                this.setState({ percentUploaded });
            },
            (error) => {
                this.setState({
                    errors: [{ message: error.message, uploadState: "error" }],
                });
            },
            async () => {
                try {
                    const downloadURL = await storageRef.snapshot.ref.getDownloadURL();
                    this.sendFileMessage(downloadURL);
                } catch (error) {
                    this.setState({
                        errors: [
                            { message: error.message, uploadState: "error" },
                        ],
                    });
                }
            }
        );
    };

    render() {
        const {
            message,
            loading,
            errors,
            modal,
            uploadState,
            percentUploaded,
        } = this.state;
        return (
            <Segment className="message_form">
                <Input
                    className={`message_form__input ${
                        errors.some((error) => error.message) ? "error" : ""
                    }`}
                    fluid
                    name="message"
                    label={<Button icon="add" />}
                    labelPosition="left"
                    placeholder="Write your message"
                    onChange={this.handleChange}
                    value={message}
                />
                <Button.Group icon widths="2">
                    <Button
                        color="orange"
                        content="Add Reply"
                        labelPosition="left"
                        icon="edit"
                        onClick={this.sendMessage}
                        disabled={loading}
                    ></Button>
                    <Button
                        color="teal"
                        content="Upload Media"
                        labelPosition="right"
                        icon="cloud upload"
                        disabled={uploadState === "uploading"}
                        onClick={this.handleModal}
                    ></Button>
                </Button.Group>
                <FileModal
                    modal={modal}
                    handleModal={this.handleModal}
                    upLoadFile={this.upLoadFile}
                />
                <ProgressBar
                    uploadState={uploadState}
                    percentUpload={percentUploaded}
                />
            </Segment>
        );
    }
}

export default MessageForm;
