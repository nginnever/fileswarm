import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

export const Header = React.createClass({
  mixins: [PureRenderMixin],
	render: function() {
		return(
			<header className="toolbar toolbar-header" style={{flexDirection:'row' }}>
			    <img src={'logo.svg'} style={{height: 25, marginTop: 5, marginLeft: 5, marginRight: 0}} />
			  <div className="toolbar-actions" style={{marginLeft: 25, marginTop: -31}}>

			    <div className="btn-group">
			      <button className="btn btn-default">
			        <span className="icon icon-home"></span>
			      </button>
			      <button className="btn btn-default active">
			        <span className="icon icon-upload"></span>
			      </button>
			      <button className="btn btn-default">
			        <span className="icon icon-folder"></span>
			      </button>
			      <button className="btn btn-default">
			        <span className="icon icon-book"></span>
			      </button>
			    </div>

			    <button className="btn btn-default">
			      <span className="icon icon-network icon-text" style={{color: '#20BE6F'}}></span>
			      1337 Files Online
			    </button>
			    <button className="btn btn-default btn-dropdown pull-right">
			      <span className="icon icon-user"></span>
			    </button>
			    <button className="btn btn-default pull-right">
			      
			      Balance: Ξ420.2992944
			    </button>
			  </div>
			</header>
		)
	}
})