import {Map} from 'immutable'

function setState(state, newState) {
	return state.merge(newState)
}

export default function(state = Map(), action) {
	switch (action.type) {
	case 'GET_MAXDISK':
	  return setState(state, action.max)
	case 'GET_DISKSPACE':
	  return setState(state, action.disk)
	case 'GET_SEEDS':
	  return setState(state, action.user)
	}
	return state
}