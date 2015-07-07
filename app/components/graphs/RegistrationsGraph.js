var RegistrationsGraph = (function() {
  var margin = {top: 20, right: 25, bottom: 30, left: 50}
    , width  = 0
    , height = 0
    , svg = null

  function create(el, props, state) {
    width  = props.width - margin.left - margin.right
    height = props.height - margin.top - margin.bottom

    svg = d3.select(el).append('svg')
        .attr('class', 'd3')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    svg.append('g')
        .attr('class', 'y axis')

    svg.append('g')
        .attr('class', 'x axis')

    svg.append('g')
      .attr('class', 'areas')

    update(props, state)
  }

  function update(props, state) {
    var data = _munge(state.data)
    var scales = _scales(props, data)
    _drawAxis(scales, data)
    _drawArea(scales, data)
  }

  function _munge(data) {
    data.sort( (a, b) => a.joined_at - b.joined_at )
    data.forEach( (d, i) => {
      d.date = new Date(d.joined_at)
      d.runningTotal = i
    })
    return data;
  }

  function _scales(props, data) {
    var x = d3.time.scale()
      .range([ 0, width ])
      .domain( d3.extent(data, d => d.date) )

    var y = d3.scale.linear()
      .range([ height, 0 ])
      .domain([ 0, d3.max(data, d => d.runningTotal) ])

    return {
      x: x,
      y: y
    }
  }

  function _drawAxis(scales, data) {
    var xAxis = d3.svg.axis()
      .scale(scales.x)
      .orient('bottom')

    var yAxis = d3.svg.axis()
      .scale(scales.y)
      .tickSize(width)
      .orient('right')

    var yx = svg.select('.y.axis')
        .attr('class', 'y axis')
        .call(yAxis)
      .append('text')
        .attr('y', 0)
        .style('text-anchor', 'start')
        .style('font-weight', '500')
        .text('Registrations')

    svg.select('.x.axis')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
  }

  function _drawArea(scales, data) {
    var area = d3.svg.area()
      .x(  d => scales.x(d.date) )
      .y0(height)
      .y1( d => scales.y(d.runningTotal) )

    var g = svg.selectAll('.areas')

    var registrations = g.selectAll('.area')
      .data([data])

    registrations.enter().append('path')
      .attr('class', '.area')
      .style('fill', '#EC2471')

    registrations
      .attr('d', area)

    registrations.exit()
      .remove()
  }

  return {
    create: create,
    update: update
  }

})()

module.exports = RegistrationsGraph
