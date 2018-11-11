// @TODO: YOUR CODE HERE!

// setting width and height of svg
var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;

// setting the margins, to adjust?
var margin = {
    top: 50,
    bottom: 50,
    right: 50,
    left: 50
  };

// setting the width and height of chart?
var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// Create SVG wrapper, append svg, and shift appropriately
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

// append an svg group
var chart = svg.append('g')

// adding a div w/ class tooltip and style opacity 0
d3.select('#scatter').append('div').attr('class','tooltip').style('opacity', 0)

// load data from data.csv, must follow this format for v5!
d3.csv('assets/data/data.csv').then(function(stateData) {
  // console.log(stateData)

  // Step 1: Parse/Cast Data, can clean up by using forEach function

  var id = stateData.map(element => +element.id)
  var state = stateData.map(element => element.state)
  var abbr = stateData.map(element => element.abbr)
  var poverty = stateData.map(element => +element.poverty)
  var povertyMoe = stateData.map(element => +element.povertyMoe)
  var age = stateData.map(element => +element.age)
  var ageMoe = stateData.map(element => +element.ageMoe)
  var income = stateData.map(element => +element.income)
  var incomeMoe = stateData.map(element => +element.incomeMoe)
  var healthcare = stateData.map(element => +element.healthcare)
  var healthcareLow = stateData.map(element => +element.healthcareLow)
  var healthcareHigh = stateData.map(element => +element.healthcareHigh)
  var obesity = stateData.map(element => +element.obesity)
  var obesityLow = stateData.map(element => +element.obesityLow)
  var obesityHigh = stateData.map(element => +element.obesityHigh)
  var smokes = stateData.map(element => +element.smokes)
  var smokesLow = stateData.map(element => +element.smokesLow)
  var smokesHigh = stateData.map(element => +element.smokesHigh)
  // console.log(obesity)
  // console.log(income)

  // Step 2: Create Scale functions
  // will be using income vs obesity
  var xLinearScale = d3.scaleLinear()
    .domain([35000, d3.max(income)])
    .range([0, width]) // may need to modify

  var yLinearScale = d3.scaleLinear()
    .domain([19, d3.max(obesity)])
    .range([height,0]) // may need to modify

  // Step 3: Create Axis functions
  var bottomAxis = d3.axisBottom(xLinearScale)
  var leftAxis = d3.axisLeft(yLinearScale)

  // Step 4: Append Axes to the chart
  chart.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(bottomAxis)

  chart.append('g')
    .call(leftAxis)

  // Step 5: Create Circles
  var circlesGroup = chart.selectAll('circle')
    .data(stateData)
    .enter()
    .append('circle')
    .attr('cx', d => xLinearScale(d.income))
    .attr('cy', d => yLinearScale(d.obesity))
    .attr('r', 15)
    .attr('fill', 'red')
    .attr('opacity','0.5')

  // Step 6: initialize tool tip
  var toolTip = d3.tip()
    .attr('class', 'tooltip')
    .offset([80,-60])
    .html(function(d) {
      return (`${d.abbr}<br>Income: ${d.income}<br>Obesity: ${d.obesity}`)
    })

  // Step 7: Create tooltip in the chart
  chart.call(toolTip)

  // Step 8: Create event listeners to display and hide the tooltip
  circlesGroup.on('click', function(data) {
    toolTip.show(data,this)
  })
    .on('mouseout', function(data,index) {
      toolTip.hide(data,this)
    })
    .on('mouseover', function(data,index){
      toolTip.show(data,this)
    })

  // Step 9: Create Axes Labels
  chart.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0-margin.left + 40)
    .attr('x', 0-(height/2))
    .attr('dy', '2em')
    .attr('class','axisText')
    .text('Obesity (in BMI)')

  chart.append('text')
    .attr('transform', `translate(${width / 2}, ${height - 20})`)
    .attr('class', 'axisText')
    .text('Income (in thousands)')

  // Step 10: Create State Labels
  // could not get all points to show!
  chart.selectAll('text')
    .data(stateData)
    .enter()
    .append('text')
    .text(d => d.abbr)
    .attr('x', d => xLinearScale(d.income))
    .attr('y', d => yLinearScale(d.obesity))
    .attr('font-size', '12px')
    .attr('text-anchor', 'middle')
    .attr('class','stateText')
  // console.log(incomeMoe)

})
