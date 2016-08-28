import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

export const Files = React.createClass({
  mixins: [PureRenderMixin],
	render: function() {
		return(
			<div>
			  <div className="table-scroll-header">  
	        <table className="table-striped-files">
	          <thead>
	            <tr>
					      <th style={{width: 200}}>Name</th>
					      <th style={{width: 80}}>Kind</th>
					      <th style={{width: 80}}>File Size</th>
					      <th style={{width: 80}}>Seeders</th>
					      <th style={{width: 150}}>Balance</th>
					      <th style={{width: 80}}>Available</th>
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
