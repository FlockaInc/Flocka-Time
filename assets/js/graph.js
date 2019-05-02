  //D3 bar graph
  var dataset = [80, 100, 56, 120, 180, 30, 40];
  var svgWidth = 900;
  var svgHeight = 250;
  var barPadding = 5;
  var barWidth = (svgWidth / dataset.length);
  var svg = d3.select('svg').attr("width", svgWidth).attr("height", svgHeight).attr("class", "bar-chart");
  $(function () {
      var barChart = svg.selectAll("rect")
          .data(dataset)
          .enter()
          .append("rect")
          .attr("y", function (d) {
              return svgHeight - d
          })
          .attr("height", function (d) {
              return d;
          })
          .attr("fill", "#282828")
          .attr("width", barWidth - barPadding)
          .attr("transform", function (d, i) {
              var translate = [barWidth * i, 0];
              return "translate(" + translate + ")";
          });
        //   debugger;
      var text = svg.selectAll("text")
          .data(dataset)
          .enter()
          .append("text")
          .text(function (d, i) {
              return d;
          })
          .attr("y", function (d, i) {
              return svgHeight - d - 2;
          })
          .attr("x", function (d, i) {
              return barWidth * i;
          })
          .attr("fill", "white");

  })