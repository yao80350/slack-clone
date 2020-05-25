import React from "react";
import { Menu } from "semantic-ui-react";

import UserPanel from "../UserPanel/UserPanel";
import Channels from "../Channels/Channels";
import DirectMessages from "../DirectMessages/DirectMessages";

class SidePanel extends React.Component {
    render() {
        return (
            <Menu
                className="side-panel"
                size="large"
                inverted
                fixed="left"
                vertical
            >
                <UserPanel />
                <Channels />
                <DirectMessages />
            </Menu>
        );
    }
}

export default SidePanel;
