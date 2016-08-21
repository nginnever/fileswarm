import {connect} from 'react-redux'
import {Seed} from '../components/Seed'

function mapStateToProps(state) {
  return state.mainReducer.toJSON()
}

export const SeedContainer = connect(mapStateToProps)(Seed)