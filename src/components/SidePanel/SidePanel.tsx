import React from "react";
import { Menu } from "semantic-ui-react";

import UserPanel from "../UserPanel/UserPanel";

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
            </Menu>
        );
    }
}

export default SidePanel;
