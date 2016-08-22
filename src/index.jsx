require('!style!css!sass!../app/sass/photon.scss')

import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, hashHistory} from 'react-router'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import reducer from './reducers/reducer'
import {Main} from './components/Main'
import {HomeContainer} from './containers/HomeContainer'
import {SeedContainer} from './containers/SeedContainer'
import {store} from './store'
import {api} from './services'

// initialize state
console.log('begin setting up store')
console.log('calling set account store')
api.setAccount(0)
console.log('getting accounts from geth')
api.getAccounts()
console.log('getting balance from store')
api.getBalance(0)

const routes = <Route component={Main}>
  <Route path='/' component={HomeContainer} />
  <Route path='/seeding' component={SeedContainer} />
</Route>

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app')
)