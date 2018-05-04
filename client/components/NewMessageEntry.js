import React, { Component } from 'react';
import store from '../store';
import axios from 'axios';
import socket from '../socket'
import { writeMessage, gotNewMessageFromServer, postMessageThunk } from '../store';

export default class NewMessageEntry extends Component {
  constructor () {
    super();
    this.state = store.getState();

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => this.setState(store.getState()));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleInput(evt){
    const action = writeMessage(evt.target.value)
    store.dispatch(action)
  }

  handleSubmit(evt) {
    evt.preventDefault(); // don't forget to preventDefault!

    // our message content is on our state, which we're getting from our Redux store
    const content = this.state.newMessageEntry;

    // our channelId is available from the props sent by MessagesList, which it receives as props from the Route!
    const channelId = this.props.channelId;

    // axios.post('/api/messages', { content: content, channelId: channelId })
    //   .then(res => res.data)
    //   .then(message => {store.dispatch(gotNewMessageFromServer(message));
    //   socket.emit('new-message', message);
    // })
    const newMessageThunk = postMessageThunk(content, channelId)
    store.dispatch(newMessageThunk)
  }

  render () {
    return (
      <form id="new-message-form" onSubmit={this.handleSubmit}>
        <div className="input-group input-group-lg">
          <input
            className="form-control"
            type="text"
            name="content"
            value={this.state.NewMessageEntry}
            onChange={this.handleInput}
            placeholder="Say something nice..."
          />
          <span className="input-group-btn">
            <button className="btn btn-default" type="submit">Chat!</button>
          </span>
        </div>
      </form>
    );
  }
}
