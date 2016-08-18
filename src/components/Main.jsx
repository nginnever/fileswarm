import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {connect} from 'react-redux'

export const Main = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return (
      <div className="window">
      <header className="toolbar toolbar-header">
  <h1 className="title">Header with actions</h1>

  <div className="toolbar-actions">
    <div className="btn-group">
      <button className="btn btn-default">
        <span className="icon icon-home"></span>
      </button>
      <button className="btn btn-default">
        <span className="icon icon-folder"></span>
      </button>
      <button className="btn btn-default active">
        <span className="icon icon-cloud"></span>
      </button>
      <button className="btn btn-default">
        <span className="icon icon-popup"></span>
      </button>
      <button className="btn btn-default">
        <span className="icon icon-shuffle"></span>
      </button>
    </div>

    <button className="btn btn-default">
      <span className="icon icon-home icon-text"></span>
      Filters
    </button>

    <button className="btn btn-default btn-dropdown pull-right">
      <span className="icon icon-megaphone"></span>
    </button>
  </div>
</header>
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
     <footer className="toolbar toolbar-footer">
  <div className="toolbar-actions">
    <button className="btn btn-default">
      Cancel
    </button>

    <button className="btn btn-primary pull-right">
      Save
    </button>
  </div>
</footer>
      </div>
    )
  }
})

function mapStateToProps(state) {
  console.log(state.toJSON())
  return state.toJSON()
}

export const MainContainer = connect(mapStateToProps)(Main)