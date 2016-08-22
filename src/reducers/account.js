import {Map} from 'immutable'

function setState(state, newState) {
	return state.merge(newState)
}

export default function(state = Map(), action) {
	switch (action.type) {
	case 'GET_BALANCE':
	  return setState(state, action.balance)
	case 'GET_ACCOUNT':
	  return setState(state, action.activeAccount)
	case 'GET_ACCOUNTS':
	  return setState(state, action.accounts)
	case 'GET_UNLOCKED':
	  return setState(state, action.unlocked)
	}
	return state
}