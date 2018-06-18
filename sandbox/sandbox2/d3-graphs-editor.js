function GraphsEditor(svgContainer, initialData = null) {
    let self = this;

    self.isDragNewItemFromMenu = false;

    self.itemNodeSelected = null;

    self.itemNodes = [];

    self.connectingLines = [];

    /**
     * Main
     */

    self.svgDefs = svgContainer.append("g")
        .attr("id", "svg-defs");

    self.svgG = svgContainer.append("g")
        .attr("id", "svg-g");

    initialData.forEach(function (itemNodeData, i) {
        self.itemNodes.push(new ItemNode(self, itemNodeData));
    });

    console.log(self.itemNodes);


}