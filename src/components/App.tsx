import React from "react";
import {
    Switch,
    Route,
    withRouter,
    RouteComponentProps,
} from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { connect } from "react-redux";

import firebase from "../firebase";
import Home from "./Home/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import "../sass/app.scss";
import { setUser, clearUser } from "../redux/actions/user-action";
import { StoreState } from "../redux/reducers";
import Spinner from "./Spinner/Spinner";

type AppProps = {
    setUser: typeof setUser;
    clearUser: typeof clearUser;
    isLoading: boolean;
} & RouteComponentProps;

class App extends React.Component<AppProps> {
    componentDidMount() {
        firebase.auth().onAuthStateChanged((userAuth) => {
            if (userAuth) {
                this.props.setUser(userAuth);
                this.props.history.push("/");
            } else {
                this.props.clearUser();
                this.props.history.push("/login");
            }
        });
    }

    render() {
        return this.props.isLoading ? (
            <Spinner />
        ) : (
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
            </Switch>
        );
    }
}

const mapStateToProps = ({ user }: StoreState) => ({
    isLoading: user.isLoading,
});

export default withRouter(
    connect(mapStateToProps, { setUser, clearUser })(App)
);
