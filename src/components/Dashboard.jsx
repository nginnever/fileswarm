import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {hashHistory, Link} from 'react-router'

export const Dashboard = React.createClass({
  mixins: [PureRenderMixin],
	render: function() {
		return(
			<nav className="nav-group">
			  <h5 className="nav-group-title">Dashboard</h5>
			  <Link to={'/'} className="nav-group-item active">
			    <span className="icon icon-home"></span>
			    Fileswarm
			  </Link>
			  <Link to={'/seeding'} className="nav-group-item">
			    <span className="icon icon-upload"></span>
			    Seeding
			  </Link>
			  <span className="nav-group-item">
			    <span className="icon icon-folder"></span>
			    Files
			  </span>
			  <span className="nav-group-item">
			    <span className="icon icon-book"></span>
			    Account
			  </span>
			</nav>
		)
	}
})