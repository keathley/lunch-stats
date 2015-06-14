var d3 = require('d3')

var AttendanceGraph = module.exports = {
  create(el, props, state) {
    var svg = d3.select(el).append('svg')
      .attr('class', 'd3')
      .attr('width', props.width)
      .attr('height', props.height)

    svg.append('g')
      .attr('class', 'd3-points')

    this.update(el, state);
  },
  update(el) {

  },
  destroy(el) {

  }
}
