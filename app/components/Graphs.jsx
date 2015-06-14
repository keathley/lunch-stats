var React = require('react');

var Attendance = require('./Attendance')

var Graphs = React.createClass({
  render: function() {
    return (
      <div id="charts">
        <Attendance />
      </div>
    );
  }
});

module.exports = Graphs;
