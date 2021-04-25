// @TODO: YOUR CODE HERE!

var svgWidth = 800
var svgHeight = 500

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100,
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("/assets/data/data.csv").then(function(stateInfo) {
    stateInfo.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
});
    var xLinearScale = d3.scaleLinear()
        .domain([9, d3.max(stateInfo, d => d.poverty)])
        .range([height, 0]);
    var yLinearScale = d3.scaleLinear()
        .domain([4, d3.max(stateInfo, d => d.healthcare)])
    
        var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    chartGroup.append("g")
    .call(leftAxis)
    
    chartGroup.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(bottomAxis);
    
    var circlesGroup = chartGroup.selectAll("circle")
    .data(stateInfo)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 10)
    .attr("fill", "lightblue")
    .attr("opacity", ".5")
    .attr("stroke", "white");

    chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-family", "sans-serif")
        .style("font-size", "8px")
        .selectAll("tspan")
        .data(stateInfo)
        .enter()
        .append("tspan")
        .attr("x", function(data) {
            return xLinearScale(data.poverty);
        })
        .attr("y", function(data) {
            return yLinearScale(data.healthcare -.02);
        })
        .text(function(data) {
            return data.abbr
        });

        var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -70])
        .style("position", "absolute")
        .style("background", "lightsteelblue")
        .style("pointer-events", "none")
        .html(function(d) {
            return (`${d.state}<br>Population In Poverty (%): ${d.poverty}<br>Lacks Healthcare (%): ${d.healthcare}`)
        });    
        
        chartGroup.call(toolTip); 
        
        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 5)
        .attr("x", 0 - (height / 1.30))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

        chartGroup.append("text")
        .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
});