import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

export const Account = React.createClass({
  mixins: [PureRenderMixin],
	render: function() {
		return(
			<h1 className="seedcenter"> Coming Soon! </h1>
		)
	}
})
