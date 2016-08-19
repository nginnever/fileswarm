require('!style!css!sass!../app/sass/photon.scss')

import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, hashHistory} from 'react-router'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import reducer from './reducers/reducer'
import {MainContainer} from './components/Main'
import {HomeContainer} from './components/Home'
import {SeedContainer} from './components/Seed'
import {api} from './services'


const store = createStore(reducer)
store.dispatch({
  type: 'SET_STATE',
  state: {
    api: api
  }
})

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