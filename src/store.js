import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'

// add middleware to createStore
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)

// App Reducers
import reducer from './reducers/reducer'

const reducers = combineReducers({
  mainReducer: reducer
  // more
})

const store = createStoreWithMiddleware(reducers)

export { store }