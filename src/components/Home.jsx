import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

export const Home = React.createClass({
  mixins: [PureRenderMixin],
	render: function() {
		return(
      <h2>FILESWARM: Decentralized File Storage Platform</h2>
		)
	}
})
