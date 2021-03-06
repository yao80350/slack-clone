import React from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";
import { InputChangeEvent } from "../../type";
import { Channel } from "../Channels/Channels";

type MessagesHeaderProps = {
    channelName: null | string;
    numUniqueUsers: string;
    handleSearchChange: (event: InputChangeEvent) => void;
    searchTerm: string;
    searchLoading: boolean;
    isPrivateChannel: boolean | Channel;
};

class MessagesHeader extends React.Component<MessagesHeaderProps> {
    render() {
        const {
            channelName,
            numUniqueUsers,
            handleSearchChange,
            searchTerm,
            searchLoading,
            isPrivateChannel,
        } = this.props;
        return (
            <Segment clearing>
                {/* {Channel Title} */}
                <Header className="header" fluid="true" as="h2" floated="left">
                    <span>
                        {channelName}
                        {!isPrivateChannel && (
                            <Icon name="star outline" color="black" />
                        )}
                    </span>
                    <Header.Subheader>{numUniqueUsers}</Header.Subheader>
                </Header>

                {/* Channel Search Input */}
                <Header floated="right">
                    <Input
                        size="mini"
                        icon="search"
                        name="searchTerm"
                        placeholder="Search Messages"
                        onChange={handleSearchChange}
                        value={searchTerm}
                        loading={searchLoading}
                    />
                </Header>
            </Segment>
        );
    }
}

export default MessagesHeader;
