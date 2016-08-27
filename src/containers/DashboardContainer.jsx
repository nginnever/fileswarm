import React from 'react'
import {Dashboard} from '../components/Dashboard'

export const DashboardContainer = React.createClass({
	getInitialState: function() {
		return{
			file: 'nav-group-item active',
			seed: 'nav-group-item',
			account: 'nav-group-item',
			active: 'file'
		}
	},
  setActive: function(selected) {
  	// BUG: state is lost when click registers between dashboard items
  	var _this = this
  	_this.setState({
  		[selected]: 'nav-group-item active',
  		[this.state.active]: 'nav-group-item',
  		active: selected
  	})
  },
	render: function() {
		return (
      <Dashboard 
        file={this.state.file} 
        seed={this.state.seed}
        account={this.state.account}
        setActive={this.setActive} />
		)
	}
})
