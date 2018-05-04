import { createStore, applyMiddleware } from 'redux';
import loggerMiddleware from 'redux-logger';
import thunkMiddleware from 'redux-thunk'
import axios from 'axios'
import socket from './socket'

const GOT_MESSAGES_FROM_SERVER = 'GOT_MESSAGES_FROM_SERVER';
const WRITE_MESSAGE = 'WRITE_MESSAGE';
const GOT_NEW_MESSAGE_FROM_SERVER = 'GOT_NEW_MESSAGE_FROM_SERVER';

export const gotMessagesFromServer = (messages) => {
    return {
        type: GOT_MESSAGES_FROM_SERVER,
        messages
    }
}

export const writeMessage = (inputContent) => {
    return {
        type: WRITE_MESSAGE,
        newMessageEntry: inputContent
    }
}

export const gotNewMessageFromServer = (message) => {
    return {
        type: GOT_NEW_MESSAGE_FROM_SERVER,
        message
    }
}

// our "thunk creator"
export function fetchMessages() {
    // our "thunk"
    return (dispatch) => {
      return axios.get('/api/messages')
        .then(res => res.data)
        .then(messages => {
          const action = gotMessagesFromServer(messages);
          // note that we can just "dispatch", rather than "store.dispatch"
          dispatch(action);
        });
    }
}

export function postMessageThunk(content, channelId){
    return function thunk(dispatch) {
        axios.post('/api/messages', { content: content, channelId: channelId })
      .then(res => res.data)
      .then(message => {dispatch(gotNewMessageFromServer(message));
      socket.emit('new-message', message);
    })
    }
}

const initialState = {
    messages: [],
    newMessageEntry: ''
}

function reducer( state = initialState, action){
    switch(action.type){
        case GOT_MESSAGES_FROM_SERVER:
            return Object.assign({}, state, {messages: action.messages})
        case GOT_NEW_MESSAGE_FROM_SERVER:
            return { ...state, messages:[ ...state.messages, action.message ] }
        case WRITE_MESSAGE: 
            return Object.assign({}, state, {newMessageEntry: action.newMessageEntry})
        default:
            return state
    }

}


const store = createStore(reducer, applyMiddleware(loggerMiddleware, thunkMiddleware));
export default store;