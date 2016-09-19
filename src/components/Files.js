import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

export const Files = React.createClass({
  mixins: [PureRenderMixin],
	render: function() {
		return(
			<div>

			<table className="noborder">
			  <thead className="bgcolor">
			    <tr>
			      <th className="seedcenter" style={{width: 200}}> Upload File</th>
			      <th className="seedcenter" style={{width: 200}}> Contract Settings</th>
			    </tr>
			  </thead>
			  <tbody className="bgcolor">
			  	<tr>
			      <td className="seedcenter"> Select file[0] (no dynamic array support yet) </td>
			      <td className="seedcenter"> File Ξther Value (Higher values will seed longer) </td>
			    </tr>
			    <tr className="seedcenter">
			      <td><input ref="uploader" type="file" accept="*" onChange={() => this.props.getFile(this.refs.uploader)} multiple></input>
			      </td>
			      <td className="seedcenter"><input ref="filev" type="text" size="15"/></td>
			    </tr>
			    <tr className="seedcenter">
			      <td>
              IPFS Multihash: 
            </td>
            <td className="seedcenter"> <button className="btn btn-primary" onClick={() => this.props.upload(this.refs.filev)}>Upload</button></td>
			    </tr>
			    <tr>
			      <td className="seedcenter">{this.props.hash}</td>
			      <td className="seedcenter" style={{color: 'red'}}>Warning this will spend Ether </td>
			    </tr>
			    <tr>
			      <td></td>
			      <td></td>
			    </tr>
			    <tr>
			      <td></td>
			      <td></td>
			    </tr>
			    <tr>
			      <td></td>
			      <td></td>
			    </tr>
			    <tr>
			      <td></td>
			      <td></td>
			    </tr>
			  </tbody>
			</table>

		  <div className="table-scroll-header">  
	        <table className="table-striped-files">
	          <thead>
	            <tr>
			      <th style={{width: 70}}>Hash</th>
			      <th style={{width: 110}}>Name</th>
			      <th style={{width: 80}}>File Size</th>
			      <th style={{width: 80}}>Seeders</th>
			      <th style={{width: 150}}>Balance</th>
			      <th style={{width: 80}}>Available</th>
			      <th style={{width: 150}}>Address</th>
			      <th style={{width: 80}}>Download</th>
			    </tr>
			  </thead>
			</table>
		  </div>  
	      <div className="table-scroll-files">      
					<table className="table-striped-files">
					  <tbody>
					    {this.props.fileRows}
					  </tbody>
					</table>
			  </div>
			</div>  
		)
	}
})
