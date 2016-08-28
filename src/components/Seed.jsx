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
			      <th className="seedcenter" style={{width: 200}}> Diskspace Options</th>
			      <th className="seedcenter" style={{width: 200}}> Network Stats</th>
			    </tr>
			  </thead>
			  <tbody>
			  	<tr>
			      <td className="seedcenter"> Choose Ammount To Seed </td>
			      <td className="seedcenter"> IPFS: Online | Geth: Online < /td>
			    </tr>
			    <tr className="seedcenter">
			      <td><input ref="sli" className="seedcenter" type="range"  defaultValue="0" min="0" max="100" onChange={() => this.props.setdisk(this.refs.sli)}/>
			      </td>
			      <td className="seedcenter"> Connected Peers: 234 IPFS | 43 Geth </td>
			    </tr>
			    <tr className="seedcenter">
			      <td>
              {this.props.disk} MB / {this.props.max} MB
            </td>
            <td className="seedcenter"> Bandwidth Used: 2000 kb/s</td>
			    </tr>
			    <tr>
			      <td className="seedcenter"> Set Max Diskspace </td>
			      <td className="seedcenter"> </td>
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
			      <th>Successful Challenges</th>
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
