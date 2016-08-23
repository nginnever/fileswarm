import {store} from '../store'
import React from 'react'
import {Main} from '../components/Main'

export const MainContainer = React.createClass({
	componentWillMount: function() {
		console.log('1st')
	},
	render: function() {
		return (
      <Main />
		)
	}
})
