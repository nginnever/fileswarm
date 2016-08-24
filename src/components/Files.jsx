import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

export const Files = React.createClass({
  mixins: [PureRenderMixin],
	render: function() {
		return(
      <div className="table-scroll">
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
		  </div>
		)
	}
})
