var React = require('react')
  , Router = require('react-router');

var Graphs = require('./components/Graphs.jsx');

require('./styles/index.scss');

var App = React.createClass({
  render() {
    return (
      <main className="app">
        <h1>DevLunch</h1>
        <h2>The Stats</h2>
        <Router.RouteHandler {...this.props} />
      </main>
    );
  }
});

var routes = (
  <Router.Route name="app" path="/" handler={App}>
    <Router.DefaultRoute handler={Graphs} />
  </Router.Route>
);

Router.run(routes, Router.HistoryLocation, (Handler, state) => {
  React.render(<Handler/>, document.body);
});
