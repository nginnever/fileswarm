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
		      <td>CSS</td>
		      <td>28K</td>
		    </tr>
    	)
    }
		return {
			max: 0,
			slide: 0,
			chunks: chunks
		}
	},
	slider: function(input) {
    var _this = this
    const dec = input.value * 0.01
    var val = dec * this.state.max
    val = val.toString()
    const i = val.indexOf('.')
    _this.setState({
    	slide: val.slice(0, i + 3)
    })
	},
	setmax: function(input) {
		var _this = this
    _this.setState({
    	max: input.value
    })
	},
	render: function() {
		return (
      <Seed 
        slider={this.slider} 
        setmax={this.setmax} 
        max={this.state.max}
        slide={this.state.slide} 
        chunks={this.state.chunks} />
		)
	}
})
