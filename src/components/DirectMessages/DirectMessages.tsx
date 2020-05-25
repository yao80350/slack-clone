import React from "react";
import { connect } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";

import { StoreState } from "../../redux/reducers";
import { getRef } from "../../firebase";

type DirectMessagesProps = {
    currentUser: null | firebase.User;
};

type User = {
    uid: string;
    name: string;
    status: string;
};

class DirectMessages extends React.Component<DirectMessagesProps> {
    state = { users: [] };

    componentDidMount = () => {
        const { currentUser } = this.props;
        if (currentUser) {
            this.addListeners(currentUser.uid);
        }
    };

    addStatusToUser = (userId: string, connected: boolean) => {
        const { users } = this.state;
        const updateUsers = users.map((user: User) => {
            if (user.uid === userId) {
                user.status = connected ? "online" : "offline";
            }
        });
        this.setState({ users: updateUsers });
    };

    addListeners = (currentUserUid: string) => {
        const loadedUsers: firebase.User[] = [];
        const persenceRef = getRef("persence");

        getRef("users").on("child_added", (snap) => {
            if (currentUserUid !== snap.key) {
                let user = snap.val();
                user.uid = snap.key;
                user.status = "offline";
                loadedUsers.push(user);
                this.setState({ users: loadedUsers });
            }
        });
        getRef(".info/connected").on("value", (snap) => {
            if (snap.val() === true) {
                const ref = persenceRef.child(currentUserUid);
                ref.set(true);
                ref.onDisconnect().remove((err) => {
                    if (err !== null) {
                        console.log(err);
                    }
                });
            }
        });

        persenceRef.on("child_added", (snap) => {
            if (currentUserUid !== snap.key) {
                snap.key && this.addStatusToUser(snap.key, true);
            }
        });

        persenceRef.on("child_removed", (snap) => {
            if (currentUserUid !== snap.key) {
                snap.key && this.addStatusToUser(snap.key, false);
            }
        });
    };

    isUserOnline = (user: User) => user.status === "online";

    render() {
        const { users } = this.state;
        return (
            <Menu.Menu className="channels">
                <Menu.Item>
                    <span>
                        <Icon name="mail" /> DIRECT MESSAGES
                    </span>
                    ({users.length})
                </Menu.Item>
                {users.map((user: User) => (
                    <Menu.Item
                        key={user.uid}
                        onClick={() => {
                            console.log(user);
                        }}
                        className="direact__user"
                    >
                        <Icon
                            name="circle"
                            color={this.isUserOnline(user) ? "green" : "red"}
                        />
                        @ {user.name}
                    </Menu.Item>
                ))}
            </Menu.Menu>
        );
    }
}

const mapStateToProps = ({ user: { currentUser } }: StoreState) => ({
    currentUser,
});

export default connect(mapStateToProps)(DirectMessages);
