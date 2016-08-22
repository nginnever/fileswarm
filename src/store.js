import { createStore, applyMiddleware, combineReducers } from 'redux'
//import thunk from 'redux-thunk'

// add middleware to createStore
//csconst createStoreWithMiddleware = applyMiddleware(thunk)(createStore)

// App Reducers
import reducer from './reducers/reducer'
import account from './reducers/account'

const reducers = combineReducers({
  mainReducer: reducer,
  accountReducer: account
  // more
})

const store = createStore(reducers)

export { store }