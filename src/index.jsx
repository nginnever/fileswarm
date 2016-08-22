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
api.init().then(() => {
	console.log('finished init store')
  
  // set routes
	const routes = <Route component={Main}>
	  <Route path='/' component={HomeContainer} />
	  <Route path='/seeding' component={SeedContainer} />
	</Route>
  
  // render react after store init hack
	ReactDOM.render(
	  <Provider store={store}>
	    <Router history={hashHistory}>{routes}</Router>
	  </Provider>,
	  document.getElementById('app')
	)
})
