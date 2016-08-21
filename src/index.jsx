require('!style!css!sass!../app/sass/photon.scss')

import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, hashHistory} from 'react-router'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import reducer from './reducers/reducer'
import {MainContainer} from './containers/MainContainer'
import {HomeContainer} from './containers/HomeContainer'
import {SeedContainer} from './containers/SeedContainer'
import {store} from './store'

const routes = <Route component={MainContainer}>
  <Route path='/' component={HomeContainer} />
  <Route path='/seeding' component={SeedContainer} />
</Route>

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app')
)