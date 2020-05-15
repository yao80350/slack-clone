import React from "react";
import { connect } from "react-redux";
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";

import firebase from "../../firebase";
import { StoreState } from "../../redux/reducers";

type UserPanelProps = {
    currentUser: null | firebase.User;
};

class UserPanel extends React.Component<UserPanelProps> {
    handleSignOut = async () => {
        await firebase.auth().signOut();
        console.log("signed out");
    };

    dropdownOptions = () => [
        {
            key: "user",
            text: (
                <span>
                    Signed in as{" "}
                    <strong>{this.props.currentUser?.displayName}</strong>
                </span>
            ),
            disabled: true,
        },
        {
            key: "avatar",
            text: <span>Change Acatar</span>,
        },
        {
            key: "signout",
            text: <span onClick={this.handleSignOut}>Sign Out</span>,
        },
    ];

    render() {
        const { currentUser } = this.props;
        return (
            <Grid className="user-panel">
                <Grid.Column>
                    <Grid.Row className="user-panel__row">
                        <Header inverted floated="left" as="h2">
                            <Icon name="code" />
                            <Header.Content>DevChat</Header.Content>
                        </Header>
                        <Header
                            className="user-panel__heading"
                            as="h4"
                            inverted
                        >
                            <Dropdown
                                trigger={
                                    <span>
                                        <Image
                                            src={currentUser?.photoURL}
                                            avatar
                                            spaced="right"
                                        />
                                        {currentUser?.displayName}
                                    </span>
                                }
                                options={this.dropdownOptions()}
                            />
                        </Header>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        );
    }
}

const mapStateToProps = ({ user }: StoreState) => ({
    currentUser: user.currentUser,
});

export default connect(mapStateToProps)(UserPanel);
