import {store} from '../store'
import React from 'react'
import {Files} from '../components/Files'

export const FilesContainer = React.createClass({
  getInitialState: function() {
  	// TODO: Make table resizable
    var files = []
    let rand
    for(var i = 0; i < 20; i++) {
    	rand = Math.floor(Math.random()*100000000000000000)
    	files.push(
		    <tr key={rand}>
		      <td style={{width: 200}}>photon.css</td>
		      <td style={{width: 80}}>CSS</td>
		      <td style={{width: 80}}>28K</td>
		      <td style={{width: 80}}>14</td>
		      <td style={{width: 150}}>Ξ 0.3230332323203</td>
		      <td style={{width: 80}}>100%</td>
		      <td style={{width: 80}}><span className="icon icon-download"></span></td>
		    </tr>
    	)
    }
    return { fileRows: files }
  },
	render: function() {
		return (
      <Files 
        fileRows={this.state.fileRows} />
		)
	}
})
