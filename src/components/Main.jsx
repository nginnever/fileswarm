import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {connect} from 'react-redux'

export const Main = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return (
      <div className="window">
        <div className="window-content">
          <div className="pane-group">
            <div className="pane-sm sidebar">
               test
            </div>
            <div className="pane">
               <h1>FILESWARM: Decentralized File Storage Platform</h1>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

function mapStateToProps(state) {
  console.log(state.toJSON())
  return state.toJSON()
}

export const MainContainer = connect(mapStateToProps)(Main)