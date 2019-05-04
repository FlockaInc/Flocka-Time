// var flockaDataset = [];

function barGraphDisplay() {
  var data = [{
    "food": "Hotdogs",
    "quantity": 24
  }, {
    "food": "Tacos",
    "quantity": 15
  }, {
    "food": "Pizza",
    "quantity": 3
  }, {
    "food": "Double Quarter Pounders with Cheese",
    "quantity": 2
  }, {
    "food": "Omelets",
    "quantity": 30
  }, {
    "food": "Falafel and Hummus",
    "quantity": 21
  }, {
    "food": "Soylent",
    "quantity": 13
  }];
  var margin = {
    top: 10,
    right: 10,
    bottom: 90,
    left: 10
  };

  var width = 960 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;
  var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .03)
  var yScale = d3.scale.linear()
    .range([height, 0]);
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");
  var svgContainer = d3.select("#barGraph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g").attr("class", "container")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  xScale.domain(dataset.map(function (d) {
    return d.food;
  }));
  yScale.domain([0, d3.max(dataset, function (d) {
    return d.quantity;
  })]);

  var xAxis_g = svgContainer.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height) + ")")
    .call(xAxis)
    .selectAll("text");

  svgContainer.selectAll(".bar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return xScale(d.food);
    })
    .attr("width", xScale.rangeBand())
    .attr("y", function (d) {
      return yScale(d.quantity);
    })
    .attr("height", function (d) {
      return height - yScale(d.quantity);
    });

  svgContainer.selectAll(".text")
    .data(dataset)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", (function (d) {
      return xScale(d.food) + xScale.rangeBand() / 2;
    }))
    .attr("y", function (d) {
      return yScale(d.quantity) + 1;
    })
    .attr("dy", ".75em")
    .text(function (d) {
      return d.quantity;
    });
};