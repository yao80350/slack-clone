import React from "react";
import { Progress } from "semantic-ui-react";

type ProgressBarProps = {
    uploadState: string;
    percentUpload: number;
};

class ProgressBar extends React.Component<ProgressBarProps> {
    render() {
        const { uploadState, percentUpload } = this.props;
        return uploadState !== "uploading" ? null : (
            <Progress
                className="progress__bar"
                percent={percentUpload}
                progress
                indicating
                size="medium"
                inverted
            />
        );
    }
}

export default ProgressBar;
