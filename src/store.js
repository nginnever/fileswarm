import { createStore, applyMiddleware, combineReducers } from 'redux'
//import thunk from 'redux-thunk'

// add middleware to createStore
//csconst createStoreWithMiddleware = applyMiddleware(thunk)(createStore)

// App Reducers
import account from './reducers/account'
import files from './reducers/files'
import seed from './reducers/seed'

const reducers = combineReducers({
  accountReducer: account,
  filesReducer: files,
  seedReducer: seed
  // more
})

const store = createStore(reducers)

export { store }