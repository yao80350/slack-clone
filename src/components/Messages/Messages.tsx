import React from "react";
import { connect } from "react-redux";
import { Segment, Comment } from "semantic-ui-react";

import { getRef } from "../../firebase";
import MessagesHeader from "../MessagesHeader/MessagesHeader";
import MessageForm from "../MessageForm/MessageForm";
import { Channel } from "../Channels/Channels";
import Message from "../Message/Message";
import { InputChangeEvent } from "../../type";
import { StoreState } from "../../redux/reducers";

type MessagesProps = {
    currentChannel: null | Channel;
    currentUser: null | firebase.User;
    isPrivateChannel: boolean | Channel;
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
        currentChannel && getRef("messages").child(currentChannel.id).off();
    }

    getMessageRef = () => {
        const { isPrivateChannel } = this.props;
        return isPrivateChannel
            ? getRef("privateMessages")
            : getRef("messages");
    };

    addMessageListener = () => {
        const loadedMessages: MessageType[] = [];
        const { currentChannel } = this.props;
        const ref = this.getMessageRef();
        currentChannel &&
            ref.child(currentChannel.id).on("child_added", (snap) => {
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
        const { currentChannel, isPrivateChannel } = this.props;
        return (
            currentChannel &&
            `${isPrivateChannel ? "@" : "#"} ${currentChannel.name}`
        );
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
            progressBar,
            numUniqueUsers,
            searchTerm,
            searchLoading,
        } = this.state;
        const { isPrivateChannel } = this.props;
        return (
            <div className="messages">
                <MessagesHeader
                    channelName={this.displayChannleName()}
                    numUniqueUsers={numUniqueUsers}
                    handleSearchChange={this.handleSearchChange}
                    searchTerm={searchTerm}
                    searchLoading={searchLoading}
                    isPrivateChannel={isPrivateChannel}
                />

                <Segment
                    className={`messages__box ${progressBar && "progressBar"}`}
                >
                    <Comment.Group>{this.displayMessages()}</Comment.Group>
                </Segment>

                <MessageForm
                    messagesRef={this.getMessageRef()}
                    {...this.props}
                    isProgressBarVisible={this.isProgressBarVisible}
                    isPrivateChannel={isPrivateChannel}
                />
            </div>
        );
    }
}

const mapStateToProps = ({ channel: { isPrivateChannel } }: StoreState) => ({
    isPrivateChannel,
});

export default connect(mapStateToProps)(Messages);
