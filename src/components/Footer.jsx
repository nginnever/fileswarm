import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

export const Footer = React.createClass({
  mixins: [PureRenderMixin],
	render: function() {
		return(
			<footer className="toolbar toolbar-footer">
			  <div className="toolbar-actions">
			    <button className="btn btn-default">
			      <span className="icon icon-stop"></span>
			      &nbsp; Stop Seeding
			    </button>
			    <button className="btn btn-warning pull-right">
			      <span className="icon icon-key"></span>
			      &nbsp; Unlock
			    </button>
			  </div>
			</footer>
		)
	}
})