import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {connect} from 'react-redux'

export const Seed = React.createClass({
  mixins: [PureRenderMixin],
	render: function() {
		return(
			<table className="table-striped">
			  <thead>
			    <tr>
			      <th>Name</th>
			      <th>Kind</th>
			      <th>File Size</th>
			    </tr>
			  </thead>
			  <tbody>
			    <tr>
			      <td>photon.css</td>
			      <td>CSS</td>
			      <td>28K</td>
			    </tr>
			    <tr>
			      <td>photon.css</td>
			      <td>CSS</td>
			      <td>28K</td>
			    </tr>
			    <tr>
			      <td>photon.css</td>
			      <td>CSS</td>
			      <td>28K</td>
			    </tr>
			    <tr>
			      <td>photon.css</td>
			      <td>CSS</td>
			      <td>28K</td>
			    </tr>
			  </tbody>
			</table>
		)
	}
})

function mapStateToProps(state) {
  console.log(state.toJSON())
  return state.toJSON()
}

export const SeedContainer = connect(mapStateToProps)(Seed)