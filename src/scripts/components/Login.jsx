import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import { LoginInitialState } from '../constants/InitialStates.js';
import LoadingModal from './LoadingModal.jsx';

class Login extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = LoginInitialState;
        this.onStop = this.onStop.bind(this);
        this.onStart = this.onStart.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEnterKey = this.handleEnterKey.bind(this);
        this.handleClearClick = this.handleClearClick.bind(this);
        this.handleConnectClick = this.handleConnectClick.bind(this);
    }

    onStart() {
        this.setState({
            shadow: "rgba(0, 0, 0, 0.247059) 0px 14px 45px, rgba(0, 0, 0, 0.219608) 0px 10px 18px",
            opacity: 0.9
        });

        this.props.actions.windowFocused(this.props.connId);
    }

    onStop() {
        this.setState({
            shadow: "rgba(0, 0, 0, 0.247059) 1px 5px 20px -5px",
            opacity: 1
        });
    }

    handleClearClick() {
        this.setState({
            hostname: "",
            port    : "",
            username: "",
            password: ""
        });
    }

    handleEnterKey(event) {
        // Call the login request action with the user inputs
        if(event.keyCode == 13) {
            let credentials = {
                hostname: this.state.hostname,
                port    : this.state.port,
                username: this.state.username,
                password: this.state.password
            };
            this.props.actions.loginRequest(this.props.connId, credentials);
        }
    }

    handleConnectClick() {
        let credentials = {
            hostname: this.state.hostname,
            port    : this.state.port,
            username: this.state.username,
            password: this.state.password
        };
        this.props.actions.loginRequest(this.props.connId, credentials);
    }

    handleChange(event) {
        let input = event.target.id;
        let value = event.target.value;
        this.setState({ [input]: value });
    }
	
    render() {
        const {
            zIndex,
            connId,
            message,
            isAuthenticated,
            isLoading
        } = this.props;

        let drags = {
            onStart: this.onStart, 
            onStop: this.onStop
        };
        
        let inputProps = {
            type: "text",
            className: "login-input",
            onKeyDown: this.handleEnterKey
        };

        let loadingModalProps = {
            styles: {
                modal: {
                    visibility: isLoading ? "visible" : "hidden",
                    opacity: isLoading ? "1" : "0"
                },
                cube: {
                    right: '12px',
                    bottom: '15px',
                    width: '15px',
                    height: '15px'
                }
            }
        };

        let boxStyle = {
            zIndex: zIndex,
            opacity: this.state.opacity,
            boxShadow: this.state.shadow
        };

        let messageStyle = {
            padding: "5px",
            textAlign: "center",
            fontSize: "12px",
            fontWeight: "100",
            position: "relative",
            color: isAuthenticated ? "green" : "red"
        };

        return (
            <Draggable bounds="parent" handle="strong" {...drags}>
                <div id={`login-${connId}`} style={boxStyle} className="login">

                    <LoadingModal {...loadingModalProps}/>

                    <strong className="menubar"> Remote Host Login </strong>

                    <input id="hostname" placeholder="Hostname" {...inputProps}
                            value={this.state.hostname} onChange={this.handleChange} />

                    <input id="port" placeholder="Port" {...inputProps}
                            value={this.state.port} onChange={this.handleChange} />

                    <input id="username" placeholder="Username" {...inputProps}
                            value={this.state.username} onChange={this.handleChange} />

                    <input id="password" type="password" placeholder="Password" className="login-input" 
                            value={this.state.password} onKeyDown={this.handleEnterKey}
                            onChange={this.handleChange} />

                    <div id="login-buttons">
                        <button id="clear-btn" onClick={this.handleClearClick}
                            type="submit" className="login-button"> Clear </button>
                        <button id="connect-btn" onClick={this.handleConnectClick}
                            type="submit" className="login-button"> Connect </button>
                    </div>

                    <p id={`message-${connId}`} style={messageStyle}> {message} </p>
	        </div>
    	    </Draggable>
        );
    }
};

export default Login
