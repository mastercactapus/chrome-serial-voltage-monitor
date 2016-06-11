
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


let store = createStore(vmonApp, compose(
    applyMiddleware(thunkMiddleware, deviceManager),
    devTools({
      name: 'vmon app', realtime: true,
      // hostname: 'localhost', port: 8000,
      maxAge: 30, filters: { blacklist: [ 'DATA', 'GET_DEVICES'] }
      })
  )
)

listenWith(store)



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
