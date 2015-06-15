var d3 = require('d3')

var svg;

var AttendanceGraph = module.exports = {
  margin: { top: 20, right: 20, bottom: 30, left: 50 },
  width: 0,
  height: 0,

  create(el, props, state) {
    this.width  = props.width - this.margin.right - this.margin.left
    this.height = props.height - this.margin.top - this.margin.bottom

    svg = d3.select(el).append('svg')
        .attr('class', 'd3')
        .attr('width', this.width + this.margin.right + this.margin.left)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + this.margin.top + ',' + this.margin.bottom + ')')

    svg.append('g')
        .attr('class', 'y axis')

    svg.append('g')
        .attr('class', 'x axis')

    svg.append('g')
        .attr('class', 'average')

    svg.append('g')
        .attr('class', 'bars')

    this.update(props, state);
  },

  update(props, state) {
    var data   = this._munge(state.data)
    var scales = this._scales(props, data)
    this._drawAxis(props, scales)
    this._drawBars(scales, data)
    this._drawAverage(scales, data)
  },

  destroy(el) {
  },

  _munge(data) {
    data.forEach( (d, i) => {
      d.id = i
      d.value = d.rsvps.length
    })

    return data;
  },

  _scales(props, data) {
    var x = d3.scale.linear()
      .range([0, this.width])
      .domain([0, data.length])

    var y = d3.scale.linear()
      .range([this.height, 0])
      .domain([0, d3.max(data, d => d.rsvps.length)])

    // #250e35
    // #EC2471
    // #B91C8D
    // #FDDA01
    // #EC894F

    return { x: x, y: y }
  },

  _drawAxis(props, scales) {
    var xAxis = d3.svg.axis()
      .scale(scales.x)
      .orient('bottom')

    var yAxis = d3.svg.axis()
      .scale(scales.y)
      .tickSize(this.width)
      .orient('right')

    svg.select('.y.axis')
        .attr('class', 'y axis')
        .call(yAxis)
      .append('text')
        .attr('y', 0)
        .style('text-anchor', 'start')
        .style('font-weight', '500')
        .text('Attendance')

    svg.select('.x.axis')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(xAxis)
  },

  _drawBars(scales, data) {
    var g = svg.selectAll('.bars')

    var bar = g.selectAll('.bar')
      .data(data)

    bar.enter().append('rect')
      .attr('class', 'bar')

    bar
      .attr('width', this.width / data.length - 0.8)
      .attr('height', d => this.height - scales.y(d.value))
      .attr('x', d => scales.x(d.id))
      .attr('y', d => scales.y(d.value))
      .style('fill', winColor)

    bar.exit()
      .remove()

    function winColor(d) {
      var win  = '#EC2471'
      var loss = '#303030'
      return win;
    }
  },

  _drawAverage(scales, data) {
    var lineGen = d3.svg.line()
      .x( d => scales.x(d.id) )
      .y( d => scales.y(d.value) )
      .interpolate('basis')

    var g = svg.selectAll('.average')

    var lines = svg.selectAll('.attendance.trend')
      .data([data])

    lines.enter().append('path')
      .attr('class', 'attendance trend line')

    lines
      .attr('d', lineGen)

    lines.exit()
      .remove()
  }
}
