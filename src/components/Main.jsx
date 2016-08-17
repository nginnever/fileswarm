import React from 'react'
import ReactDOM from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {connect} from 'react-redux'

export const Main = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return (
      <h1>FILESWARM: Decentralized File Storage Platform</h1>
    )
  }
})

function mapStateToProps(state) {
  console.log(state.toJSON())
  return state.toJSON()
}

export const MainContainer = connect(mapStateToProps)(Main)