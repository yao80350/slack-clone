import React from "react";
import { Grid } from "semantic-ui-react";

import ColorPanel from "../ColorPanel/ColorPanel";
import SidePanel from "../SidePanel/SidePanel";
import Messages from "../Messages/Messages";
import MetaPanel from "../MetaPanel/MetaPanel";

class Home extends React.Component {
    render() {
        return (
            <Grid columns="equal" className="app home">
                <ColorPanel />
                <SidePanel />
                <Grid.Column className="home__messages">
                    <Messages />
                </Grid.Column>
                <Grid.Column width={4}>
                    <MetaPanel />
                </Grid.Column>
            </Grid>
        );
    }
}

export default Home;
