function ItemNode(graphsEditor, itemNodeData) {

    self = this;

    self.itemTypeID = itemNodeData['itemTypeID'];

    self.title = itemNodeData['title'];

    self.description = itemNodeData['description'];

    self.position = itemNodeData['position'];

    self.inputNodes = itemNodeData['inputNodes'];

    self.outputNodes = itemNodeData['outputNodes'];

    /** 
     * Html visualization
     */

    self.g = graphsEditor.svgG.append("g")
        .classed("item-node", true)
        .attr("transform", "translate(" + self.position[0] + ", " + self.position[1] + ")");

    self.g.foreignObject = self.g.append("foreignObject")
        .attr("x", 40)
        .attr("y", 40)
        .attr("width", 230)
        .attr("height", 40);

    self.g.foreignObject.append("xhtml:div")
        .html(self.description);

    self.g.rect = self.g.append("rect")
        .attr("width", 280)
        .attr("height", function () {
            return self.g.foreignObject.select("div").node().offsetHeight + 60;
        })
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("fill", "#fff")
        .attr("stroke", "#bbb")
        .attr("stroke-width", "1");

    self.g.title = self.g.append("text")
        .attr("class", "node-title")
        .attr("x", 40)
        .attr("y", 30)
        .text(self.title);
    
    

}