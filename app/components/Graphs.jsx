var React = require('react')
  , ajax  = require('reqwest')

var Attendance = require('./Attendance')

var Graphs = React.createClass({
  getInitialState() {
    return {
      events: []
    }
  },
  componentDidMount() {
    ajax({
        url: '/events.json'
      , type: 'json'
      , method: 'get'
      , contentType: 'application/json'
      , success: this.handleSuccess
    })
  },
  handleSuccess(data) {
    this.setState({
      events: data
    })
  },
  render() {
    var events = this.state.events

    return (
      <div id="charts">
        <Attendance data={events} />
      </div>
    );
  }
});

module.exports = Graphs;
