import {store} from '../store'
import React from 'react'
import {Home} from '../components/Home'
import {api} from '../services'

export const HomeContainer = React.createClass({

	render: function() {
		return (
      <Home />
		)
	}
})
