var React = require('react')
  , ajax  = require('reqwest')

var Attendance = require('./Attendance')
  , Registrations = require('./Registrations')

var Graphs = React.createClass({
  getInitialState() {
    return {
      events: [],
      members: []
    }
  },
  componentDidMount() {
    ajax({
        url: '/events.json'
      , type: 'json'
      , method: 'get'
      , contentType: 'application/json'
      , success: this.handleEventsSuccess
    })
    ajax({
        url: '/members.json'
      , type: 'json'
      , method: 'get'
      , contentType: 'application/json'
      , success: this.handleMembersSuccess
    })
  },
  handleEventsSuccess(data) {
    this.setState({
      events: data
    })
  },
  handleMembersSuccess(data) {
    this.setState({
      members: data
    })
  },
  render() {
    var events = this.state.events
      , members = this.state.members

    return (
      <div id="charts">
        <Attendance data={events} />
        <Registrations data={members} />
      </div>
    );
  }
});

module.exports = Graphs;
