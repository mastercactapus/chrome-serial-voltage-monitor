import {
  SET_OPTIONS, SET_DEVICE, CONNECTED, GET_DEVICES, ERROR, ACK_ERROR,
  CONNECT_FAILED, CONNECT, DISCONNECT, DISCONNECTED, DATA, CONFIG_CHART,
  CONFIG_PIN
} from '../actions'

import { combineReducers } from 'redux'

function devices (state = [] , action) {
  switch (action.type) {
    case GET_DEVICES:
      return action.devices.slice()
    default:
      return state
  }
}
function options (state = {bitrate: 230400, bufferSize: 512} , action) {
  if (action.type === SET_OPTIONS) return Object.assign({}, state, action.options)
  return state
}
function device (state = null , action) {
  switch (action.type) {
    case SET_DEVICE:
      return action.device
    case GET_DEVICES:
      // if our device drops from the list, remove the selection
      if (state && !action.devices.find(d => d.path === state.path)) return null
    default:
      return state
  }
  return state
}
function conn (state = null , action) {
  switch (action.type) {
    case CONNECTED:
      return action.conn
    case CONNECT:
    case DISCONNECTED:
    case DISCONNECT:
      return null
  }
  return state
}

function errors (state = [] , action) {
  switch (action.type) {
    case ERROR:
    case CONNECT_FAILED:
      let id = state.reduce((id, err) => Math.max(id, err.id), 100)
      return state.concat({
        err: action.err,
        message: action.err.message || action.err,
        ack: false,
      id})
    case ACK_ERROR:
      return state.map(e => {
        if (e.id !== action.id) return e
        return Object.assign({}, e, {ack: true})
      })
  }
  return state
}

function chart(state={pinCount: 6, showLegend: true}, action) {
  switch (action.type) {
    case CONFIG_CHART:
      return Object.assign({}, state, action.options)
  }
  return state
}

const defaultColors = [
  "#F44336",
  "#9C27B0",
  "#2196F3",
  "#4CAF50",
  "#CDDC39",
  "#FF9800",
  "#795548",
  "#9E9E9E",
  "#1DE9B6",
  "#9C27B0",
  "#E91E63",
  "#3F51B5",
  "#607D8B",
  "#FF5722",
  "#FFFFFF",
  "#827717"
]

function pin(num, state={label: "A" + num, enabled: true, multiplier: 1, color: defaultColors[num]}, action) {
  switch (action.type) {
    case CONFIG_PIN:
      if (+action.pin !== num) return state;
      return Object.assign({}, state, action.options)
  }
  return state
}

function pins() {
  var cfg = {}
  for (let i=0;i<16;i++) cfg[i] = (state, action) => pin(i, state, action)
  return combineReducers(cfg)
}

export default combineReducers({
  devices,
  conn,
  errors,
  chart,
  pins: pins(),
  selected: combineReducers({
  options, device})
})
