var KDAGraph = (function() {
  var margin   = { top: 10, right: 50, bottom: 50, left: 40 }
  var parseDate = d3.time.format.iso.parse;
  var displayDate = d3.time.format('%e %b')

  function create(el, props, state) {
    props.width  = props.width - margin.right - margin.left
    props.height = props.height - margin.top - margin.bottom

    var svg = d3.select(el).append('svg')
        .attr('class', 'd3 kda')
        .attr('width', props.width + margin.right + margin.left)
        .attr('height', props.height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    this.update(svg, props, state)
  }

  function update(svg, props, state) {
    var data   = _munge(props, state.data)
    var scales = _scales(props, data)
    var tip   = _tooltips(svg, data)
    _drawAxis(svg, props, scales)
    _drawArea(svg, scales, data)
    _drawLines(svg, scales, data)
    _drawPoints(svg, scales, data, tip)
  }

  function _munge(props, data) {
    data.forEach(function(d, i) {
      d.date = parseDate(d.date);
      d.match_id = i;
    });

    return data;
  }

  function _scales(props, data) {
    var x = d3.scale.linear()
      .range([0, props.width])
      .domain([0, data.length])

    var dmg = d3.scale.linear()
      .range([props.height, 0])
      .domain([
        d3.min(data, function(d) { return Math.min(d.dmgDealt, d.dmgTaken); }),
        d3.max(data, function(d) { return Math.max(d.dmgDealt, d.dmgTaken); }),
      ])

    var kad = d3.scale.linear()
      .range([props.height, 0])
      .domain(d3.extent(data.map(function(i) { return i.kad; } )))

    return {
      x: x,
      dmg: dmg,
      kad: kad
    }
  }

  function _tooltips(svg, data) {
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return line('Dmg Dealt', d.dmgDealt)
          + line('Dmg Taken', d.dmgTaken)
          + line('Win', d.win ? 'Won' : 'Loss')
          + line('God', d.god)
          + line('Kills', d.kills)
          + line('Deaths', d.deaths)
          + line('Assists', d.assists)
          + line('Gold', d.gold)
          + line('Minutes', d.minutes_played)

        function line(title, value) {
          return '<div>'
                + '<strong>' + title + '</strong>'
                + '<span class="value">' + value + "</span>"
              + '</div>'
        }
      })

    svg.call(tip);

    return tip
  }

  function _drawAxis(svg, props, scales) {
    var xAxis = d3.svg.axis()
      .scale(scales.x)
      .orient('bottom')
      .ticks(6)
      // .tickFormat(function(d) { return displayDate(data[d-1].date) })

    var yAxis = d3.svg.axis()
      .scale(scales.kad)
      .tickSize(props.width)
      .ticks(4)
      .orient('right')

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + props.height + ')')
      .call(xAxis)

    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
      .append('text')
        .attr('y', 0)
        .style('text-anchor', 'start')
        .style('font-weight', '500')
        .text('KDA')
  }

  function _drawArea(svg, scales, data) {
    var line = d3.svg.area()
      .x(function(d) { return scales.x(d.match_id) })
      .y(function(d) { return scales.dmg(d.dmgDealt) })
      .interpolate('basis')

    var area = d3.svg.area()
      .x(function(d) { return scales.x(d.match_id) })
      .y1(function(d) { return scales.dmg(d.dmgDealt) })
      .interpolate('basis')

    svg.datum(data);

    svg.append('clipPath')
        .attr('id', 'clip-below')
      .append('path')
        .attr('d', area.y0(scales.dmg.range()[0]))

    svg.append('clipPath')
        .attr('id', 'clip-above')
      .append('path')
        .attr('d', area.y0(0))

    svg.append('path')
      .attr('class', 'area above')
      .attr('clip-path', 'url(#clip-above)')
      .attr('d', area.y0(function(d) { return scales.dmg(d.dmgTaken) }))

    svg.append('path')
      .attr('class', 'area below')
      .attr('clip-path', 'url(#clip-below)')
      .attr('d', area);

    svg.append('path')
      .attr('class', 'line')
      .attr('d', line)
  }

  function _drawLines(svg, scales, data) {
    var lineGen = d3.svg.line()
      .x(function(d) { return scales.x(d.match_id) })
      .y(function(d) { return scales.kad(d.kad)    })

    var lines = svg.selectAll('.kad.trend')
      .data([data])

    lines.enter().append('path')
        .attr('class', 'kad trend line')

    lines.attr('d', lineGen)

    lines.exit()
      .remove()
  }

  function _drawPoints(svg, scales, data, tip) {
    var kad = svg.selectAll('.point')
        .data(data)

    kad.enter().append('circle')
        .attr('class', 'point')
        .style('stroke', '#EC2471')
        .style('stroke-width', 2)
        .style('fill', winColor)
        .attr('r', 5)

    kad
      .attr('cx', function(d) { return scales.x(d.match_id) })
      .attr('cy', function(d) { return scales.kad(d.kad)    })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

    kad.exit()
      .remove()

    var dmgDealt = svg.selectAll('.point.above')
        .data(data)

    dmgDealt.enter().append('circle')
        .attr('class', 'point above')
        .attr('r', 2)

    dmgDealt
      .attr('cx', function(d) { return scales.x(d.match_id) })
      .attr('cy', function(d) { return scales.dmg(d.dmgDealt) })

    dmgDealt.exit()
      .remove()

    var dmgTaken = svg.selectAll('.point.below')
        .data(data)

    dmgTaken.enter().append('circle')
        .attr('class', 'point below')
        .attr('r', 2)

    dmgTaken
      .attr('cx', function(d) { return scales.x(d.match_id)   })
      .attr('cy', function(d) { return scales.dmg(d.dmgTaken) })

    dmgTaken.exit()
      .remove()

    function winColor(d) {
      var win  = '#EC2471'
      var loss = '#303030'
      return d.win ? win : loss
    }
  }

  return {
    create: create,
    update: update
  }
})();
