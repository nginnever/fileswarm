import {Map} from 'immutable'

function setState(state, newState) {
	return state.merge(newState)
}

export default function(state = Map(), action) {
	switch (action.type) {
	case 'GET_FILES':
	  return setState(state, action.files)
	}
	return state
}