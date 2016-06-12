export const GET_DEVICES = 'GET_DEVICES'
export const SET_DEVICE = 'SET_DEVICE'
export const SET_OPTIONS = 'SET_OPTIONS'
export const ERROR = 'ERROR'
export const ACK_ERROR = 'ACK_ERROR'

export const DISCONNECT = 'DISCONNECT'
export const DISCONNECTED = 'DISCONNECTED'
export const CONNECT = 'CONNECT'
export const CONNECT_FAILED = 'CONNECT_FAILED'
export const CONNECTED = 'CONNECTED'
export const DATA = 'DATA'

export const CONFIG_CHART = 'CONFIG_CHART'
export const CONFIG_PIN = 'CONFIG_PIN'


export function configChart(options) {
  return {
    type: CONFIG_CHART, options
  }
}
export function configPin(pin, options) {
  return { type: CONFIG_PIN, pin, options }
}

export function data (connId, data) {
  return {
    type: DATA,
  connId, data}
}

export function setDevice (device) {
  return {
    type: SET_DEVICE,
  device}
}
export function setOptions (options) {
  return {
    type: SET_OPTIONS,
  options}
}

export function connect (device, options) {
  return {
    type: CONNECT,
  device, options}
}
export function connectFailed (device, options, err) {
  return {
    type: CONNECT_FAILED,
  device, options, err}
}
export function connected (device, options, conn) {
  return {
    type: CONNECTED,
  device, options, conn}
}
export function disconnect (connectionId) {
  return {
    type: DISCONNECT,
  connectionId}
}
export function disconnected (connectionId) {
  return {
    type: DISCONNECTED,
  connectionId}
}

export function connectDevice (device, options) {
  return dispatch => {
    dispatch(connect(device, options))
    return new Promise(resolve => {
      var opts = Object.assign({}, options, {name: device.displayName.replace(/_/g," ")})
      chrome.serial.connect(device.path, opts, conn => {
        if (chrome.runtime.lastError) {
          resolve(dispatch(connectFailed(device, options, chrome.runtime.lastError)))
          return
        }

        resolve(dispatch(connected(device, options, conn)))
      })
    })
  }
}

export function disconnectDevice (connectionId) {
  return dispatch => {
    dispatch(disconnect(connectionId))
    return new Promise(resolve => {
      chrome.serial.disconnect(connectionId, () => resolve(dispatch(disconnected(connectionId))))
    })
  }
}

export function error (err) {
  return {
    type: ERROR,
  err}
}
export function ackError (id) {
  return {
    type: ACK_ERROR,
  id}
}

export function getDevices (devices) {
  return {
    type: GET_DEVICES,
  devices}
}

export function refreshDevices () {
  return dispatch => {
    return new Promise((resolve, reject) => {
      chrome.serial.getDevices(devices => {
        if (chrome.runtime.lastError) {
          resolve(dispatch(error(chrome.runtime.lastError)))
        } else {
          resolve(dispatch(getDevices(devices)))
        }
      })
    })
  }
}
