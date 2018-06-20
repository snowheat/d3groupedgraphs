function GraphsEditor(svgContainer, nodes = null, edges = null) {
    let self = this;

    self.newNodeID = nodes.length + 1;

    self.isDragNewItemFromMenu = false;

    self.itemNodeSelected = null;

    self.itemNodes = [];

    self.connectingLines = [];

    console.log(nodes);

    /**
     * Main
     */

    self.svgDefs = svgContainer.append("g")
        .attr("id", "svg-defs");

    self.svgG = svgContainer.append("g")
        .attr("id", "svg-g");

    self.backgroundRect = self.svgG.append("rect")
        .attr("id", "graphic-editor-background-rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "#eee")
        .on("click", function () {
            if (self.selectedNode != null) {

                self.selectedNode.classed("node-selected", false);

                self.selectedNode.select("rect")
                    .attr("stroke", "#bbb")
                    .attr("stroke-width", 1);
                self.selectedNode.selectAll("text.io-node-output-number")
                    .attr("display", "none");
                self.selectedNode.selectAll("circle.output-node")
                    .attr("r", 5)
                    .attr("stroke-width", 1);

                self.selectedNode = null;
            }
        })
        .on("mousemove", function () {
            if (self.isDragNewItemFromMenu == null) {
                console.log(d3.event.x);
            }
        });

    /*
    nodes.forEach(function (itemNodeData, i) {
        self.itemNodes.push(new ItemNode(self, itemNodeData));
    });
     */



}

//http://cs224d.stanford.edu/
//https://bl.ocks.org/cjrd/6863459
https://bl.ocks.org/cjrd/6863459