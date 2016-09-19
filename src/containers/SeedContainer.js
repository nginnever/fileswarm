import {store} from '../store'
import React from 'react'
import {Seed} from '../components/Seed'
import {api} from '../services'

export const SeedContainer = React.createClass({
	getInitialState: function() {
		var currentStore = store.getState()
    var chunks = []
    let rand
    for(var i = 0; i < currentStore.seedReducer.toJSON().user[0].chunks.length; i++) {
    	rand = Math.floor(Math.random()*100000000000000000)
    	chunks.push(
		    <tr key={rand}>
		      <td>{currentStore.seedReducer.toJSON().user[0].chunks[i].file}</td>
		      <td>{currentStore.seedReducer.toJSON().user[0].chunks[i].address}</td>
		      <td>{currentStore.seedReducer.toJSON().user[0].chunks[i].size}</td>
		      <td>{currentStore.seedReducer.toJSON().user[0].chunks[i].success}</td>
		    </tr>
    	)
    }
		return {
			max: 0,
			disk: 0,
			chunks: chunks
		}
	},
	componentWillMount: function() {
		var _this = this
		store.subscribe(function() {
			console.log('seed store subscribe triggered')
			var currentStore = store.getState()
      var acc
      if (currentStore.accountReducer.toJSON().activeAccount === undefined) {
        acc = 0
      } else {
        acc = currentStore.accountReducer.toJSON().activeAccount
      }
      //console.log(currentStore.seedReducer.toJSON().user[acc])
      if (currentStore.seedReducer.toJSON().user[acc] === undefined) {
      	console.log('test')
      	console.log(acc)
        api.initSeed(acc)
        return
      }

	    var chunks = []
	    let rand
	    for(var i = 0; i < currentStore.seedReducer.toJSON().user[acc].chunks.length; i++) {
	    	rand = Math.floor(Math.random()*100000000000000000)
	    	chunks.push(
			    <tr key={rand}>
			      <td>{currentStore.seedReducer.toJSON().user[acc].chunks[i].file}</td>
			      <td>{currentStore.seedReducer.toJSON().user[acc].chunks[i].address}</td>
			      <td>{currentStore.seedReducer.toJSON().user[acc].chunks[i].size}</td>
			      <td>{currentStore.seedReducer.toJSON().user[acc].chunks[i].success}</td>
			    </tr>
	    	)
	    }

			var currentStore = store.getState()
			_this.setState({
				max: currentStore.seedReducer.toJSON().max,
				disk: currentStore.seedReducer.toJSON().disk,
				chunks: chunks
			})
		})
	},
	setdisk: function(input) {
    var _this = this
    const dec = input.value * 0.01
    var val = dec * this.state.max
    val = val.toString()
    const i = val.indexOf('.')
    api.getDiskspace(val.slice(0, i == -1 ? val.length : i + 3))
	},
	setmax: function(input) {
		var _this = this
		api.getMax(input.value)
	},
	render: function() {
		return (
      <Seed 
        setdisk={this.setdisk} 
        setmax={this.setmax} 
        max={this.state.max}
        disk={this.state.disk} 
        chunks={this.state.chunks} />
		)
	}
})
