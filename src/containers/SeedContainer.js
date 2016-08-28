import {store} from '../store'
import React from 'react'
import {Seed} from '../components/Seed'
import {api} from '../services'

export const SeedContainer = React.createClass({
	getInitialState: function() {
    var chunks = []
    let rand
    for(var i = 0; i < 100; i++) {
    	rand = Math.floor(Math.random()*100000000000000000)
    	chunks.push(
		    <tr key={rand}>
		      <td>QmbH7fpAV1FgMp6J7GZXUV6rj6Lck5tDix9JJGBSjFPgUd</td>
		      <td>324</td>
		      <td>Ξ 0.3230332323203</td>
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
			_this.setState({
				max: currentStore.seedReducer.toJSON().max,
				disk: currentStore.seedReducer.toJSON().disk
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
