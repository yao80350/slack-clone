import React from "react";
import { Segment, Comment } from "semantic-ui-react";

import firebase from "../../firebase";
import MessagesHeader from "../MessagesHeader/MessagesHeader";
import MessageForm from "../MessageForm/MessageForm";
import { Channel } from "../Channels/Channels";
import Message from "../Message/Message";
import { InputChangeEvent } from "../../type";

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
        progressBar: false,
        numUniqueUsers: "",
        searchTerm: "",
        searchLoading: false,
        searchResult: [],
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
                this.countUniqueUsers(loadedMessages);
            });
    };

    addListeners = () => {
        this.addMessageListener();
    };

    displayMessages = () => {
        const { messages, searchResult, searchTerm } = this.state;
        const { currentUser } = this.props;
        const results = searchTerm ? searchResult : messages;
        return results.map((message: MessageType) => (
            <Message
                key={message.timestamp.toString()}
                message={message}
                currentUser={currentUser}
            />
        ));
    };

    isProgressBarVisible = () => {
        this.setState({ progressBar: !this.state.progressBar });
    };

    displayChannleName = () => {
        const { currentChannel } = this.props;
        return currentChannel && currentChannel.name;
    };

    countUniqueUsers = (messages: MessageType[]) => {
        const uinqueUsers = messages.reduce((acc: string[], message) => {
            if (!acc.includes(message.user.id)) {
                acc.push(message.user.id);
            }
            return acc;
        }, []);
        const numUniqueUsers = `${uinqueUsers.length} ${
            uinqueUsers.length !== 1 ? "users" : "user"
        }`;
        this.setState({ numUniqueUsers });
    };

    handleSearchChange = (event: InputChangeEvent) => {
        this.setState(
            { searchTerm: event.target.value, searchLoading: true },
            () => {
                this.handleSearchMessages();
            }
        );
    };

    handleSearchMessages = () => {
        const { messages, searchTerm } = this.state;
        const channelMessages = [...messages];
        const regex = new RegExp(searchTerm, "ig");
        const searchResult = channelMessages.reduce(
            (acc: MessageType[], message: MessageType) => {
                if (
                    (message.content && message.content.match(regex)) ||
                    message.user.name.match(regex)
                ) {
                    acc.push(message);
                }
                return acc;
            },
            []
        );
        this.setState({ searchResult });
        setTimeout(() => {
            this.setState({ searchLoading: false });
        }, 1000);
    };

    render() {
        const {
            messagesRef,
            progressBar,
            numUniqueUsers,
            searchTerm,
            searchLoading,
        } = this.state;
        return (
            <div className="messages">
                <MessagesHeader
                    channelName={this.displayChannleName()}
                    numUniqueUsers={numUniqueUsers}
                    handleSearchChange={this.handleSearchChange}
                    searchTerm={searchTerm}
                    searchLoading={searchLoading}
                />

                <Segment
                    className={`messages__box ${progressBar && "progressBar"}`}
                >
                    <Comment.Group>{this.displayMessages()}</Comment.Group>
                </Segment>

                <MessageForm
                    messagesRef={messagesRef}
                    {...this.props}
                    isProgressBarVisible={this.isProgressBarVisible}
                />
            </div>
        );
    }
}

export default Messages;
