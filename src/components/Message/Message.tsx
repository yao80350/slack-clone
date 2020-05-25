import React from "react";
import moment from "moment";
import { Comment, Image } from "semantic-ui-react";
import { MessageType } from "../Messages/Messages";

type MessageProps = {
    message: MessageType;
    currentUser: null | firebase.User;
};

class Message extends React.Component<MessageProps> {
    isOwnMessage = () => {
        const { message, currentUser } = this.props;
        return message.user.id === currentUser?.uid ? "message__self" : "";
    };

    timeFromNow = (timestamp: Object) => moment(timestamp).fromNow();

    render() {
        const {
            user: { avatar, name },
            timestamp,
            content,
            image,
        } = this.props.message;
        return (
            <Comment>
                <Comment.Avatar src={avatar} />
                <Comment.Content className={this.isOwnMessage()}>
                    <Comment.Author as="a">{name}</Comment.Author>
                    <Comment.Metadata>
                        {this.timeFromNow(timestamp)}
                    </Comment.Metadata>
                    {image ? (
                        <Image src={image} className="message__image" />
                    ) : (
                        <Comment.Text>{content}</Comment.Text>
                    )}
                </Comment.Content>
            </Comment>
        );
    }
}

export default Message;
