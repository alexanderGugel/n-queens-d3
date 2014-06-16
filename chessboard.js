
// Chessboard visualization.
var Chessboard = function () {
  this.width = document.body.clientWidth*(1/4);
  this.height = document.body.clientHeight;

  // Use a g inside the svg in order to set a padding using "transform".
  this.svg = d3.select("body").append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", "translate(10,10)");

  this.svg.append("rect")
      .attr("width", 12*n)
      .attr("height", 12*n)
      .attr("fill", "red");

  this.queen = this.svg.selectAll(".queen");
};

Chessboard.prototype.update = function (board) {
  this.queen = this.queen.data([1, 2, 3, 0, 3]);

  var x = 6;

  this.queen.enter().append("circle")
      .attr("class", "queen")
      .attr("r", 6)
      .attr("cx", function (d) { x += 12; return x-12; })
      .attr("cy", function (d) { return d*n + 12; });
};
