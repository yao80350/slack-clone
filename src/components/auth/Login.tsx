import React from "react";
import { Link } from "react-router-dom";
import {
    Grid,
    Form,
    Segment,
    Button,
    Header,
    Message,
    Icon,
} from "semantic-ui-react";

import * as types from "../../type";
import firebase from "../../firebase";

type Error = {
    message: string;
};

type State = {
    email: string;
    password: string;
    errors: Error[];
    loading: boolean;
};

class Login extends React.Component {
    state: State = {
        email: "",
        password: "",
        errors: [],
        loading: false,
    };

    handleChange = ({
        target: { name, value },
    }: types.InputChangeEvent): void => {
        this.setState({ [name]: value });
    };

    displayErrors = (errors: Error[]): JSX.Element[] => {
        return errors.map((error, index) => <p key={index}>{error.message}</p>);
    };

    isFormValid = () => {
        const { email, password } = this.state;
        return email.trim() && password.trim();
    };

    handleSubmit = async (event: types.FormEvent): Promise<void> => {
        event.preventDefault();
        const { email, password, loading } = this.state;

        if (!this.isFormValid() && loading) return;
        this.setState({ errors: [], loading: true });

        try {
            const singedInUser = await firebase
                .auth()
                .signInWithEmailAndPassword(email, password);
            console.log(singedInUser);
            this.setState({ loading: false });
        } catch (error) {
            this.setState({
                errors: [{ message: error.message }],
                loading: false,
            });
        }
    };

    handleInputError = (errors: Error[], inputName: string): string => {
        const result = errors.some((error): boolean => {
            return error.message.toLowerCase().includes(inputName);
        });
        return result ? "error" : "";
    };

    render() {
        const { email, password, errors, loading } = this.state;

        return (
            <Grid
                textAlign="center"
                verticalAlign="middle"
                className="app register"
            >
                <Grid.Column className="register__column">
                    <Header as="h1" icon color="violet" textAlign="center">
                        <Icon name="code branch" color="violet" />
                        Login to Slack Clone
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
                            <Form.Input
                                fluid
                                type="email"
                                name="email"
                                icon="mail"
                                iconPosition="left"
                                placeholder="Email Address"
                                onChange={this.handleChange}
                                value={email}
                                className={this.handleInputError(
                                    errors,
                                    "email"
                                )}
                            />
                            <Form.Input
                                fluid
                                type="password"
                                name="password"
                                icon="lock"
                                iconPosition="left"
                                placeholder="Password"
                                onChange={this.handleChange}
                                value={password}
                                className={this.handleInputError(
                                    errors,
                                    "password"
                                )}
                            />
                            <Button
                                disabled={loading}
                                className={loading ? "loading" : ""}
                                fluid
                                color="violet"
                                size="large"
                            >
                                Login
                            </Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>
                        Don't have an account?{" "}
                        <Link to="/register">Register</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Login;
