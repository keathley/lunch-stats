var React = require('react');

var AttendanceGraph = require('./graphs/AttendanceGraph.js')

var Attendance = React.createClass({
  propTypes: {
    data: React.PropTypes.array
  },
  componentDidMount: function() {
    AttendanceGraph.create(
      this.getDOMNode(),
      this.getChartProps(),
      this.getChartState()
    )
  },
  componentDidUpdate: function() {
    AttendanceGraph.update(
      this.getChartProps(),
      this.getChartState()
    )
  },
  getChartProps() {
    return { width: 900, height: 300 }
  },
  getChartState() {
    return {
      data: this.props.data
    }
  },
  componentWillUnmount: function() {
    AttendanceGraph.destroy(this.getDOMNode())
  },
  render: function() {
    return (
      <div className="d3 attendance-chart" />
    );
  }
});

module.exports = Attendance;
