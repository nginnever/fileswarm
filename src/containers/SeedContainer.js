import {store} from '../store'
import React from 'react'
import {Seed} from '../components/Seed'
import {api} from '../services'

export const SeedContainer = React.createClass({
	componentWillMount: function() {
	},
	render: function() {
		return (
      <Seed />
		)
	}
})
