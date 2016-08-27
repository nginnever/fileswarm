import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Link} from 'react-router'

export const Dashboard = React.createClass({
  mixins: [PureRenderMixin],
	render: function() {
		return(
			<nav className="nav-group">
			  <h5 className="nav-group-title">Dashboard</h5>
			  <Link to={'/'} className={this.props.file} onClick={() => this.props.setActive('file')}>
			    <span className="icon icon-folder"></span>
			    Files
			  </Link>
			  <Link to={'/seeding'} className={this.props.seed} onClick={() => this.props.setActive('seed')}>
			    <span className="icon icon-upload"></span>
			    Seeding
			  </Link>
			  <Link to={'/account'} className={this.props.account} onClick={() => this.props.setActive('account')}>
			    <span className="icon icon-book"></span>
			    Account
			  </Link>
			</nav>
		)
	}
})