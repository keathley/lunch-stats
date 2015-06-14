var React = require('react');

var AttendanceGraph = require('./graphs/AttendanceGraph.js')

var Attendance = React.createClass({
  propTypes: {
    data: React.PropTypes.array,
    domain: React.PropTypes.object
  },
  componentDidMount: function() {
    var el = this.getDOMNode()
    AttendanceGraph.create(el, {
      width: '100%',
      height: '300px'
    }, this.getChartState())
  },
  componentDidUpdate: function() {
    var el = this.getDOMNode();
    AttendanceGraph.update(el, this.getChartState())
  },
  getChartState: function() {
    return {
      data: this.props.data,
      domain: this.props.domain
    }
  },
  componentWillUnmount: function() {
    var el = this.getDOMNode()
    AttendanceGraph.destroy(el)
  },
  render: function() {
    return (
      <div className="attendance-chart" />
    );
  }
});

module.exports = Attendance;
