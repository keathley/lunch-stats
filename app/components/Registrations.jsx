var React = require('react');

var RegistrationsGraph = require('./graphs/RegistrationsGraph')

var Registrations = React.createClass({
  propTypes: {
    data: React.PropTypes.array
  },
  componentDidMount: function() {
    RegistrationsGraph.create(
      this.getDOMNode(),
      this.getChartProps(),
      this.getChartState()
    )
  },
  componentDidUpdate: function() {
    RegistrationsGraph.update(
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
      <div className="d3 registrations-chart" />
    );
  }
});

module.exports = Registrations;
