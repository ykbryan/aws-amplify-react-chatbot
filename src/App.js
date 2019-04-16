import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Launcher } from 'react-chat-window'
import Amplify, { Interactions } from 'aws-amplify';
import awsmobile from './aws-exports';

Amplify.configure(awsmobile);

class App extends Component {

  constructor() {
    super();
    this.state = {
      messageList: [],
      tempMessageList: []
    };
  }

  _onMessageWasSent = (message) => {

    this.setState({
      tempMessageList: [...this.state.messageList, message],
      messageList: [...this.state.messageList, message, {
        author: 'lex',
        type: 'emoji',
        data: { emoji: "💬" }
      }]
    })

    // Set timeout to check if the temp message is working
    // setTimeout(this.responseByLex(message.data.text), 3000)
    this.responseByLex(message.data.text)
  }

  responseByLex = async (message) => {

    const response = await Interactions.send("BookTrip_master", message);

    this.setState({
      messageList: [...this.state.tempMessageList, {
        author: 'lex',
        type: 'text',
        data: { text: response.message }
      }]
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <div>
          <Launcher
            agentProfile={{
              teamName: 'react-chat-window',
              imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
            }}
            onMessageWasSent={this._onMessageWasSent.bind(this)}
            messageList={this.state.messageList}
            showEmoji
          />
        </div>
      </div>
    );
  }
}

export default App;
