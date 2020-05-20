import React from "react";
import { connect } from "react-redux";
import { Grid } from "semantic-ui-react";

import ColorPanel from "../ColorPanel/ColorPanel";
import SidePanel from "../SidePanel/SidePanel";
import Messages from "../Messages/Messages";
import MetaPanel from "../MetaPanel/MetaPanel";
import { StoreState } from "../../redux/reducers";
import { Channel } from "../Channels/Channels";

type HomeProps = {
    currentChannel: null | Channel;
    currentUser: null | firebase.User;
};

class Home extends React.Component<HomeProps> {
    render() {
        const { currentChannel } = this.props;
        return (
            <Grid columns="equal" className="app home">
                <ColorPanel />
                <SidePanel />
                <Grid.Column className="home__messages">
                    <Messages key={currentChannel?.id} {...this.props} />
                </Grid.Column>
                <Grid.Column width={4}>
                    <MetaPanel />
                </Grid.Column>
            </Grid>
        );
    }
}

const mapStateToProps = ({
    channel: { currentChannel },
    user: { currentUser },
}: StoreState) => ({
    currentChannel,
    currentUser,
});

export default connect(mapStateToProps)(Home);
