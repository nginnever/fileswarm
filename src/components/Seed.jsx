import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

export const Seed = React.createClass({
  mixins: [PureRenderMixin],
	render: function() {
		return(
			<div>
			<table className="table-striped-seed">
			  <thead>
			    <tr>
			      <th className="seedcenter"> Seeding Options</th>
			    </tr>
			  </thead>
			  <tbody>
			  	<tr>
			      <td className="seedcenter"> Choose Ammount To Seed </td>
			    </tr>
			    <tr className="seedcenter">
			      <td><input ref="sli" className="seedcenter" type="range"  defaultValue="0" min="0" max="100" onChange={() => this.props.slider(this.refs.sli)}/>
			      </td>
			    </tr>
			    <tr className="seedcenter">
			      <td>
              {this.props.slide} MB / {this.props.max} MB
            </td>
			    </tr>
			    <tr>
			      <td className="seedcenter"> Set Max Diskspace </td>
			    </tr>
			    <tr>
			      <td className="seedcenter"><input ref="max" type="text" size="15" onChange={() => this.props.setmax(this.refs.max)}/></td>
			    </tr>
			  </tbody>
			</table>
			<table className="table-striped">
			  <thead>
			    <tr>
			      <th>Chunk</th>
			      <th>Challenge Num</th>
			      <th>Rewarded</th>
			    </tr>
			  </thead>
			  <tbody>
			    {this.props.chunks}
			  </tbody>
			</table>
			</div>
		)
	}
})
