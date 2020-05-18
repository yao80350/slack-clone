import React from "react";
import { Segment, Comment } from "semantic-ui-react";

import MessagesHeader from "../MessagesHeader/MessagesHeader";
import MessageForm from "../MessageForm/MessageForm";

class Messages extends React.Component {
    render() {
        return (
            <div className="messages">
                <MessagesHeader />

                <Segment className="messages__box">
                    <Comment.Group>{/* {message} */}</Comment.Group>
                </Segment>

                <MessageForm />
            </div>
        );
    }
}

export default Messages;
