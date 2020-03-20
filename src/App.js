import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Launcher } from 'react-chat-window';
import Amplify, { Interactions } from 'aws-amplify';
import awsmobile from './aws-exports';

Amplify.configure(awsmobile);
Amplify.configure({
  Interactions: {
    bots: {
      RestaurantAssistant: {
        name: 'RestaurantAssistant',
        alias: 'Staging',
        region: 'us-east-1'
      }
    }
  }
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      messageList: [],
      tempMessageList: [],
      hasResponded: true
    };
  }

  _onMessageWasSent = message => {
    try {
      let currentMessageList = this.state.messageList;
      if (this.state.hasResponded === false) {
        currentMessageList.pop();
      }

      this.setState({
        tempMessageList: [...currentMessageList, message],
        messageList: [
          ...currentMessageList,
          message,
          {
            author: 'lex',
            type: 'text',
            data: { text: '...' }
          }
        ],
        hasResponded: false
      });
    } catch (error) {
      console.log(error);
    } finally {
      // Set timeout to check if the temp message is working
      // setTimeout(this.responseByLex(message.data.text), 3000)
      this.responseByLex(message.data.text);
    }
  };

  responseByLex = async message => {
    const response = await Interactions.send('RestaurantAssistant', message);
    console.log(response);

    this.setState({
      messageList: [
        ...this.state.tempMessageList,
        {
          author: 'lex',
          type: 'text',
          data: { text: response.message }
        }
      ],
      hasResponded: true
    });
  };

  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className='App-link'
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn React
          </a>
        </header>
        <div style={{ textAlign: 'left' }}>
          <Launcher
            agentProfile={{
              teamName: 'Restaurant Chatter',
              imageUrl:
                'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
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
