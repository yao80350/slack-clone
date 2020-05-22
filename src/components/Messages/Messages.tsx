import React from "react";
import { Segment, Comment } from "semantic-ui-react";

import firebase from "../../firebase";
import MessagesHeader from "../MessagesHeader/MessagesHeader";
import MessageForm from "../MessageForm/MessageForm";
import { Channel } from "../Channels/Channels";
import Message from "../Message/Message";

type MessagesProps = {
    currentChannel: null | Channel;
    currentUser: null | firebase.User;
};

export type MessageType = {
    timestamp: Object;
    user: {
        id: string;
        name: string;
        avatar: string;
    };
    content?: string;
    image?: string;
};

class Messages extends React.Component<MessagesProps> {
    state = {
        messagesRef: firebase.database().ref("messages"),
        messages: [],
        loading: true,
    };

    componentDidMount() {
        const { currentChannel, currentUser } = this.props;
        if (currentChannel && currentUser) {
            this.addListeners();
        }
    }

    componentWillUnmount() {
        const { currentChannel } = this.props;
        currentChannel && this.state.messagesRef.child(currentChannel.id).off();
    }

    addMessageListener = () => {
        const loadedMessages: MessageType[] = [];
        const { messagesRef } = this.state;
        const { currentChannel } = this.props;
        currentChannel &&
            messagesRef.child(currentChannel.id).on("child_added", (snap) => {
                loadedMessages.push(snap.val());
                console.log(this.state.messages);
                this.setState({ messages: loadedMessages, loading: false });
            });
    };

    addListeners = () => {
        this.addMessageListener();
    };

    displayMessages = () => {
        const { messages } = this.state;
        const { currentUser } = this.props;
        return messages.map((message: MessageType) => (
            <Message
                key={message.timestamp.toString()}
                message={message}
                currentUser={currentUser}
            />
        ));
    };

    render() {
        const { messagesRef } = this.state;
        return (
            <div className="messages">
                <MessagesHeader />

                <Segment className="messages__box">
                    <Comment.Group>{this.displayMessages()}</Comment.Group>
                </Segment>

                <MessageForm messagesRef={messagesRef} {...this.props} />
            </div>
        );
    }
}

export default Messages;
