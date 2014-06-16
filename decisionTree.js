var DecisionTree = function (rootBoard) {
  this.width = document.body.clientWidth*(3/4);
  this.height = document.body.clientHeight;
  this.tree = d3.layout.tree()
      .size([this.width - 20, this.height - 20]);
  this.root = { board: rootBoard, i: 0 };
  this.nodes = this.tree.nodes(this.root);

  this.root.parent = this.root;
  this.root.px = this.root.x;
  this.root.py = this.root.y;

  this.diagonal = d3.svg.diagonal();

  // Use a g inside the svg in order to set a padding using "transform".
  this.svg = d3.select("body").append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", "translate(10,10)");

  this.node = this.svg.selectAll(".node");
  this.link = this.svg.selectAll(".link");

  this.duration = 500;
};

DecisionTree.prototype.update = function (board) {
  // Create new node.
  var n = { board: board, i: this.nodes.length };

  // Find parent for board.
  // Determine parent.
  var parentBoard = board.slice();
  var indexOfLastNumber = 0;
  for (var k = 0; k < board.length; k++) {
    if (board[k] !== null) {
      indexOfLastNumber = k;
    }
  }
  parentBoard[indexOfLastNumber] = null;

  var p;

  for (var i = 0; i < this.nodes.length; i++) {
    if (JSON.stringify(this.nodes[i].board) === JSON.stringify(parentBoard)) {
      p = this.nodes[i];
    }
  }

  if (!p.children) {
    p.children = [];
  }

  p.children.push(n);
  this.nodes.push(n);

  // Recompute the layout and data join.
  this.node = this.node.data(this.tree.nodes(this.root), function(d) { return d.board; });
  this.link = this.link.data(this.tree.links(this.nodes), function(d) { return d.source.board + "-" + d.target.board; });

  this.node.on("mouseover", function (d) {
    pause = true;
    console.log(d.board);
  });

  this.node.on("mouseleave", function () {
    pause = false;
  });

  // Add entering nodes in the parent’s old position.
  this.node.enter().append("circle")
      .attr("class", "node")
      .attr("fill", "#fff")
      .attr("r", 1)
      .attr("cx", function (d) { return d.parent.px; })
      .attr("cy", function (d) { return d.parent.py; });

  // Add entering links in the parent’s old position.
  this.link.enter().insert("path", ".node")
      .attr("class", "link")
      .attr("d", function (d) {
        var o = {x: d.source.px, y: d.source.py};
        return this.diagonal({source: o, target: o});
      }.bind(this));

  // Transition nodes and links to their new positions.
  var t = this.svg.transition()
      .duration(this.duration);

  t.selectAll(".link")
      .attr("d", this.diagonal)
      .ease("bounce");

  t.selectAll(".node")
      .attr("r", 7)
      .attr("cx", function (d) {
        d.px = d.x;
        return d.x;
      })
      .attr("cy", function (d) {
        d.py = d.y;
        return d.y;
      })
      .ease("bounce");
};


DecisionTree.prototype.colorNode = function (i, color) {
  this.svg.transition().duration(this.duration)
      .selectAll(".node")
      .filter(function (d) {
        return (d.i === i);
      })
      .attr("fill", color);
};

DecisionTree.prototype.colorLastNode = function (color) {
  this.colorNode(this.nodes.length-1, color);
};
