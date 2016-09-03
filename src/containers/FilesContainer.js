'use strict'

import {store} from '../store'
import React from 'react'
import {Files} from '../components/Files'
import {api} from '../services'

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
  componentWillMount: function() {
		// var _this = this

		// store.subscribe(function() {
		// 	console.log('files store subscribe triggered')
		// 	currentStore = store.getState()
		// 	_this.setState({
		// 		balance: currentStore.accountReducer.toJSON().balance,
		// 		activeAccount: currentStore.accountReducer.toJSON().activeAccount
		// 	})
  //     console.log('rerendering accounts drop down')
  //     _this.renderAccounts()
		// })
  //   console.log('rendering accounts 1st time')
  //   _this.renderAccounts()
  },
  getFile: function(file) {
    console.log(file)
    const f = file.files[0]
    let reader = new FileReader()
    reader.onloadend = () => {
      api.getFile(reader)
    }
    reader.readAsArrayBuffer(f)
  },
	render: function() {
		return (
      <Files 
        fileRows={this.state.fileRows} 
        getFile={this.getFile} />
		)
	}
})
