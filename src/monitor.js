import React, { Component } from 'react'
import SmoothieComponent from 'react-smoothie'
import { connect } from 'react-redux'
import {throttle} from 'lodash'

import eventBus from './event-bus'

const colorBoxStyle = {
  display: "inline-block",
  border: "1px solid black",
  verticalAlign: "middle",
  height: 8, width: 8, margin: 0, padding: 0,
}

function LegendPin(props) {
  var value = `${props.value.toFixed(1)}v`
  return <tr>
    <td><span style={Object.assign({}, colorBoxStyle, { backgroundColor: props.color })}> </span></td>
    <td>{value}</td>
    <td>{props.label}</td>
  </tr>
}

const legendStyle = {
  position: "absolute",
  float: "left",
  left: 34, top: 84,
  backgroundColor: "white",
  fontFamily: "Roboto, sans-serif"
}
function Legend(props) {
  return <table style={legendStyle}>
    <tbody>
      {props.pins.map((pin,i)=><LegendPin key={i} {...pin} />)}
    </tbody>
  </table>
}

export class Monitor extends Component {
  constructor() {
    super()

    this.ts = new Array(16)
    this.tsEventFns = new Array(16)
    this.state = {

    }
    for (let i=0;i<16;i++) {
      this.state["value_" + i] = 0
    }
  }

  tsEvent(pin, value) {
    if (!this.props.enabled[pin]) return
    this.ts[pin].append(new Date().getTime(), value)
    this.setState({["value_" + pin]: value})
  }

  componentDidMount () {
    for (let i=0;i<16;i++) {
      this.ts[i] = this.refs.chart.addTimeSeries({}, {strokeStyle: this.props.color[i], lineWidth: 1})
      this.tsEventFns[i] = throttle(data => this.tsEvent(i, data.value * 5 / 1023),100)
      eventBus.on("pin_" + i, this.tsEventFns[i])
    }
  }

  componentWillUnmount () {
    this.tsEventFns.forEach((fn,i)=>eventBus.removeListener('pin_'+i,fn))
  }

  render () {
    var gridOpts = {
      verticalSections: 5
    }


    var pins = this.props.pins.map(pin=>{
      return {
        label: this.props.label[pin],
        color: this.props.color[pin],
        value: this.state["value_" + pin],
      }
    })

    var legend = this.props.showLegend && <Legend pins={pins} />
    var labelOpts = {fontSize: 16}

    return <div>
      {legend}
      <SmoothieComponent
        grid={gridOpts}
        labels={labelOpts}
        width={window.innerWidth-16}
        height={window.innerHeight-66}
        maxValue={5}
        minValue={0}
        ref="chart" />
    </div>
  }
}

const mapStateToProps = (state) => {
  var enabled = {}
  var color = {}
  var label = {}
  for (let pin in state.pins) {
    if (+pin < state.chart.pinCount && state.pins[pin].enabled) {
      enabled[pin] = true
    }
    color[pin] = state.pins[pin].color
    label[pin] = state.pins[pin].label
  }

  var pins = Object.keys(enabled)

  return { enabled, color, pins, label, showLegend: state.chart.showLegend }
}

export default connect(mapStateToProps)(Monitor)
