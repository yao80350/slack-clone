import React from "react";
import { Link } from "react-router-dom";
import md5 from "md5";
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
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    errors: Error[];
    loading: boolean;
    usersRef: firebase.database.Reference;
};

class Register extends React.Component {
    state: State = {
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errors: [],
        loading: false,
        usersRef: firebase.database().ref("users"),
    };

    handleChange = ({
        target: { name, value },
    }: types.InputChangeEvent): void => {
        this.setState({ [name]: value });
    };

    isFormEmpty = (): boolean => {
        const { username, email, password, passwordConfirmation } = this.state;
        return (
            !username.trim().length ||
            !email.trim().length ||
            !password.trim().length ||
            !passwordConfirmation.trim().length
        );
    };

    isPasswordVilid = (): boolean => {
        const { password, passwordConfirmation } = this.state;
        if (password.trim() !== passwordConfirmation.trim()) {
            return false;
        } else if (password.trim().length < 6) {
            return false;
        } else {
            return true;
        }
    };

    isFormValid = (): boolean => {
        const errors: Error[] = [];
        let message = "";
        if (this.isFormEmpty()) {
            message = "Fill in all fields";
            this.setState({ errors: errors.concat({ message }) });
            return false;
        } else if (!this.isPasswordVilid()) {
            message = "Password is invalid";
            this.setState({ errors: errors.concat({ message }) });
            return false;
        } else {
            return true;
        }
    };

    displayErrors = (errors: Error[]): JSX.Element[] => {
        return errors.map((error, index) => <p key={index}>{error.message}</p>);
    };

    saveUser = ({ user }: firebase.auth.UserCredential) => {
        if (!user) {
            return;
        }
        const { uid, displayName, photoURL } = user;
        return this.state.usersRef.child(uid).set({
            name: displayName,
            avatar: photoURL,
        });
    };

    handleSubmit = async (event: types.FormEvent): Promise<void> => {
        event.preventDefault();
        const { username, email, password, loading } = this.state;

        if (!this.isFormValid() || loading) return;
        this.setState({ loading: true, errors: [] });

        try {
            const createdUser = await firebase
                .auth()
                .createUserWithEmailAndPassword(email, password);
            try {
                await createdUser.user?.updateProfile({
                    displayName: username,
                    photoURL: `https://www.gravatar.com/avatar/${md5(
                        email
                    )}?d=identicon`,
                });
                console.log(createdUser);
                await this.saveUser(createdUser);
                console.log("user saved");
                this.setState({ loading: false });
            } catch (error) {
                throw new Error(error);
            }
        } catch (error) {
            this.setState({
                loading: false,
                errors: [{ message: error.message }],
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
        const {
            username,
            email,
            password,
            passwordConfirmation,
            errors,
            loading,
        } = this.state;

        return (
            <Grid
                textAlign="center"
                verticalAlign="middle"
                className="app register"
            >
                <Grid.Column className="register__column">
                    <Header as="h1" icon color="orange" textAlign="center">
                        <Icon name="puzzle piece" color="orange" />
                        Register for Slack Clone
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
                            <Form.Input
                                fluid
                                type="text"
                                name="username"
                                icon="user"
                                iconPosition="left"
                                placeholder="Username"
                                onChange={this.handleChange}
                                value={username}
                            />
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
                            <Form.Input
                                fluid
                                type="password"
                                name="passwordConfirmation"
                                icon="repeat"
                                iconPosition="left"
                                placeholder="Password Confirmation"
                                onChange={this.handleChange}
                                value={passwordConfirmation}
                                className={this.handleInputError(
                                    errors,
                                    "password"
                                )}
                            />
                            <Button
                                disabled={loading}
                                className={loading ? "loading" : ""}
                                fluid
                                color="orange"
                                size="large"
                            >
                                Submit
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
                        Already a user? <Link to="/login">Login</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Register;
