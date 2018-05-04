import React, { Component } from 'react';
import Message from './Message';
import NewMessageEntry from './NewMessageEntry';
import axios from 'axios';

import store from '../store'
import {gotMessagesFromServer, fetchMessages} from '../store'

export default class MessagesList extends Component {

  constructor () {
    super();
    this.state = store.getState();
  }

  componentDidMount() {
    // axios.get('/api/messages/')
    //   .then(res => res.data)
    //   .then(messages => {
    //     const action = gotMessagesFromServer(messages);
    //     store.dispatch(action);
    //   });
    //   this.unsubscribe = store.subscribe(() => this.setState(store.getState()));
    const messageThunk = fetchMessages()
    store.dispatch(messageThunk)
    this.unsubscribe = store.subscribe(() => this.setState(store.getState()));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render () {

    const channelId = Number(this.props.match.params.channelId); // because it's a string "1", not a number!
    const messages = this.state.messages;
    const filteredMessages = messages.filter(message => message.channelId === channelId);
    
    return (
      <div>
        <ul className="media-list">
          { filteredMessages.map(message => <Message message={message} key={message.id} />) }
        </ul>
        <NewMessageEntry channelId={channelId}/>
      </div>
    );
  }
}