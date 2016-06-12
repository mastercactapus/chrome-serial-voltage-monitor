
import React from 'react';
import ReactDOM from 'react-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dashboard from './dashboard';

import './main.css'

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { compose, createStore, applyMiddleware } from 'redux'
import devTools from 'remote-redux-devtools';
import vmonApp from './reducers'

import deviceManager, {listenWith} from './device-manager'
import {debounce} from 'lodash'

chrome.storage.sync.get("settings", items=>{
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError)
    return start()
  } else if (!items.settings) {
    return start()
  }
  var state= {
    chart: items.settings.chart,
    pins: items.settings.pins,
    selected: {
      options: items.settings.device
    }
  }
  start(state)
})

function start(state={}) {
  let store = createStore(vmonApp, state,  compose(
      applyMiddleware(thunkMiddleware, deviceManager),
      devTools({
        name: 'vmon app', realtime: true,
        // hostname: 'localhost', port: 8000,
        maxAge: 30, filters: { blacklist: [ 'DATA', 'GET_DEVICES'] }
        })
    )
  )
  listenWith(store)

  function select(state) {
    return {
      chart: state.chart,
      pins: state.pins,
      device: state.selected && state.selected.options
    }
  }
  let currentValue = null
  store.subscribe(debounce(()=>{
    let previousValue = currentValue
    currentValue = select(store.getState())
    if (!previousValue) return

    if (previousValue.chart === currentValue.chart && previousValue.pins === currentValue.pins && previousValue.device === currentValue.device) return

    chrome.storage.sync.set({settings: currentValue})
  }, 1000))

  const App = () => (
    <MuiThemeProvider muiTheme={getMuiTheme()}>
      <Provider store={store}>
        <Dashboard />
      </Provider>
    </MuiThemeProvider>
  );

  ReactDOM.render(
    <App />,
    document.getElementById('app')
  );
}
