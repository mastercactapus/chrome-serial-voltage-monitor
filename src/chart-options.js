import React,{Component} from 'react'

import {connect} from 'react-redux'

import Checkbox from 'material-ui/Checkbox';
import Slider from 'material-ui/Slider';
import TextField from 'material-ui/TextField';

import {configChart, configPin} from './actions'

function PinConfig (props) {
  var text = `Label for Pin${props.pin}`
  return <div>
    <Checkbox
      style={{display: "inline-block", width: "auto"}}
      checked={props.enabled}
      onCeck={(e,val)=>props.configPin({enabled: val})} />
    <TextField
      style={{display: "inline-block"}}
      floatingLabelText={text}
      value={props.label}
      disabled={!props.enabled}
      onChange={(e,val)=>props.configPin({label: val})} />
    <input
      type="color"
      value={props.color}
      disabled={!props.enabled}
      onChange={(e,val)=>props.configPin({color: val})} />
  </div>
}

export class ChartOptions extends Component {
  render() {
    var pins = Object.keys(this.props.pins).sort().map(pin=> <PinConfig
                                                               key={pin}
                                                               configPin={(cfg)=>this.props.configPin(pin, cfg)}
                                                               pin={pin}
                                                               {...this.props.pins[pin]} />)
    return <div>
      <Checkbox
        label="Show Legend"
        value={this.props.showLegend}
        onChange={(e,val)=>this.props.configChart({showLegend: val})} />
      <Slider
        label="Number of pins"
        min={1}
        max={16}
        step={1}
        value={this.props.pinCount}
        onChange={(e,val)=>this.props.configChart({pinCount: val})} />
      {pins}
    </div>
  }
}

const mapStateToProps = (state) => {
  var pins = {}
  for (let pin in state.pins) {
    if (+pin < state.chart.pinCount) pins[pin] = state.pins[pin]
  }

  return {
    pins,
    pinCount: state.chart.pinCount,
    showLegend: state.chart.showLegend
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    configPin: (pin, cfg) => dispatch(configPin(pin, cfg)),
    configChart: cfg => dispatch(configChart(cfg)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChartOptions)
