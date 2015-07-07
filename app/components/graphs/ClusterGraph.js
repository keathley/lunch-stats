var ClusterGraph = (function() {
  var margin = {top: 20, right: 20, bottom: 30, left: 40}
    , width  = 0
    , height = 0

  function create(el, props, state) {
    width  = props.width - margin.left - margin.right
    height = props.height - margin.top - margin.bottom

    var svg = d3.select(el).append('svg')
        .attr('class', 'd3')
        .attr('width', props.width + margin.right + margin.left)
        .attr('height', props.height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    update(svg, props, state)
  }

  function update(svg, props, state) {
    var data = _munge(state.data)
    var scales = _scales(props, state)
    _drawAxis(svg, scales, data)
  }

  function _munge(data) {
    // Do some data manipulation
    return data;
  }

  function _scales(props, state) {
    // Build your scales
    var x = null
    var y = null

    return {
      x: x,
      y: y
    }
  }

  function _drawAxis(scales, data) {
    // Draw some axis
  }

  return {
    create: create,
    update: update
  }
})()
