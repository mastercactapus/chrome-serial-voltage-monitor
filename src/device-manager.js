import { SET_OPTIONS, SET_DEVICE, CONNECTED, DISCONNECT, disconnectDevice, connectDevice, data, error, refreshDevices} from './actions'

import eventBus from './event-bus'

const deviceManager = store => next => action => {
  var res = next(action)
  switch (action.type) {
    case SET_OPTIONS:
    case SET_DEVICE:
      let state = store.getState()
      if (state.selected.device) {
        if (state.conn) store.dispatch(disconnectDevice(state.conn.connectionId))
        store.dispatch(connectDevice(state.selected.device, state.selected.options))
      }
  }

  return res
}

class DataReader {
  constructor () {
    var buf = new ArrayBuffer(819200)
    this.buf = new Uint8ClampedArray(buf) // overkill
    this.end = 0
    this.pin = -1
    this.pos = 0
    this.dv = new DataView(buf)

    this.data = []
  }
  scanPins () {
    // if we don't have a pin, and align fails, return false
    if (this.pin === -1 && !this.align()) return false
    let added = false
    let pin = 0
    let value = 0
    while (this.pos < this.end - 1) {
      value = this.dv.getUint16(this.pos, false)

      pin = (value >> 1) & 15
      value = (value >> 5) & 1023
      this.pos += 2
      if (pin !== (this.pin + 1)) {
        this.pin = -1
        this.pos -= 2
        return this.scanPins() || added
      }
      this.pin++
      this.data.push({pin, value})
      added = true
    }
    return added
  }

  reset () {
    this.pos = 0
    this.end = 0
    this.pin = -1
    this.data = []
  }

  // align will find the next 0x00 byte, and position after
  align () {
    var idx = this.buf.subarray(this.pos, this.end).indexOf(0)
    if (idx === -1) {
      this.pos = 0
      this.end = 0
      return false
    }

    this.pos += idx + 1
    return true
  }

  write (data) {
    this.buf.set(new Uint8ClampedArray(data), this.end)
    this.end += data.byteLength

    return this.scanPins()
  }

  consume () {
    var data = this.data
    this.data = []
    return data
  }
}

export function listenWith (store) {
  setInterval(() => store.dispatch(refreshDevices()), 1000)
  chrome.serial.onReceiveError.addListener(info => {
    store.dispatch(error(info.error))
    store.dispatch(disconnectDevice(info.connectionId))
  })

  let r = new DataReader()
  let connId = null
  chrome.serial.onReceive.addListener(info => {
    var state = store.getState()
    // ignore stuff we don't need
    if (!state.conn || state.conn.connectionId !== info.connectionId) return

    if (info.connectionId !== connId) {
      r.reset()
      connId = info.connectionId
    }

    let res = r.write(info.data)
    if (res) r.consume().forEach(data => eventBus.emit('pin_' + data.pin, data))
  })
}

export default deviceManager
