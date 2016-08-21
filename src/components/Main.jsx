import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {connect} from 'react-redux'
import {Header} from './Header'
import {Dashboard} from './Dashboard'
import {Footer} from './Footer'

export const Main = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return (
      <div className="window">
        <Header />
        <div className="window-content">
          <div className="pane-group">
            <div className="pane-sm sidebar">
              <Dashboard />
            </div>
            <div className="pane">
              {this.props.children}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
})
