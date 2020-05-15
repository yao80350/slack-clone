import React from "react";
import { Menu } from "semantic-ui-react";

import UserPanel from "../UserPanel/UserPanel";
import Channels from "../Channels/Channels";

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
            </Menu>
        );
    }
}

export default SidePanel;
