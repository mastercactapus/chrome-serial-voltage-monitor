import React, {Component} from 'react'
import {connect} from 'react-redux'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


import {setOptions, configChart} from './actions'

const bitrates = [
  300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 74880,
  115200, 230400, 250000
]

const pins = [
  1, 2, // for custom stuff
  6,
  8, // mini and nano
  16 // mega
]

export class DeviceOptions extends Component {
  render() {

    var bitrateItems = bitrates.map((rate,i)=><MenuItem key={i} value={rate} primaryText={rate} />)
    var pinItems = pins.map((count,i)=><MenuItem key={i} value={count} primaryText={count} />)

    return <div style={{padding:16}}>
      <div>
        <SelectField
          value={this.props.bitrate}
          onChange={(e,idx,val)=>this.props.setBitrate(val)}
          floatingLabelText="Bitrate">
        {bitrateItems}
        </SelectField>
      </div>
      <div>
        <SelectField
          value={this.props.pinCount}
          onChange={(e,idx,val)=>this.props.setPinCount(val)}
          floatingLabelText="Max Pins">
        {pinItems}
        </SelectField>
      </div>
    </div>
  }
}


const mapStateToProps = (state) => {
  return {
    bitrate: state.selected.options.bitrate,
    pinCount: state.chart.pinCount,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBitrate: bitrate => dispatch(setOptions({bitrate})),
    setPinCount: pinCount => dispatch(configChart({pinCount}))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceOptions)
