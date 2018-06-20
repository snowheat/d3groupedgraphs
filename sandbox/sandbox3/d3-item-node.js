/**
 * ItemNode representasi satu tahapan klasifikasi
 * memiliki simpul input dan simpul output
 * 
 * @param  {} graphsEditor
 * @param  {} itemNodeData
 */
function ItemNode(graphsEditor, itemNodeData) {

    /**
     * Variabel kelas ItemNode
     */

    let self = this;

    self.itemTypeID = itemNodeData['itemTypeID'];

    self.title = itemNodeData['title'];

    self.description = itemNodeData['description'];

    self.position = itemNodeData['position'];

    self.inputNodes = itemNodeData['inputNodes'];

    self.outputNodes = itemNodeData['outputNodes'];

    /**
     * Mengambil posisi x dan y dari atribut transform pada group
     */

    self.getTranslation = function (transform) {

        // Create a dummy g for calculation purposes only. This will never
        // be appended to the DOM and will be discarded once this function 
        // returns.
        let g = document.createElementNS("http://www.w3.org/2000/svg", "g");

        // Set the transform attribute to the provided string value.
        g.setAttributeNS(null, "transform", transform);

        // consolidate the SVGTransformList containing all transformations
        // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
        // its SVGMatrix. 
        let matrix = g.transform.baseVal.consolidate().matrix;

        // As per definition values e and f are the ones for the translation.
        return [matrix.e, matrix.f];
    };

    self.getGlobalPosition = function(g, ioNode) {
        
        let translation = self.getTranslation(g.attr("transform"));
        return [
            parseInt(ioNode.attr("cx"), 10) + parseInt(translation[0], 10), 
            parseInt(ioNode.attr("cy"), 10) + parseInt(translation[1], 10)
        ];
    }

    /** 
     * Html visualization
     */

    self.g = graphsEditor.svgG.append("g")
        .classed("item-node", true)
        .attr("transform", "translate(" + self.position[0] + ", " + self.position[1] + ")");

    /**
     * Event listener : itemNode
     */

    self.itemNodeEventListener = function (selection, eventType) {
        switch (eventType) {
            case "dragstart":

                selection.raise().classed("active", true);

                let initialPosition = self.getTranslation(selection.attr("transform"));

                let itemNodeCenterX = initialPosition[0];
                self.xDistanceToItemNodeCenter = (d3.event.x - itemNodeCenterX);

                let itemNodeCenterY = initialPosition[1];
                self.yDistanceToItemNodeCenter = (d3.event.y - itemNodeCenterY);

                break;

            case "dragon":
                selection.attr("transform", "translate(" + (d3.event.x - self.xDistanceToItemNodeCenter) +
                    ", " + (d3.event.y - self.yDistanceToItemNodeCenter) + ")");
                break;
            case "dragend":
                selection.classed("active", false);
                self.position = [(d3.event.x - self.xDistanceToItemNodeCenter), (d3.event.y - self.yDistanceToItemNodeCenter)];

                break;
            case "mouseenter":

                break;
            case "mouseleave":

                break;
            case "click":
                if (graphsEditor.selectedNode != null) {
                    graphsEditor.selectedNode.classed("node-selected", false);

                    graphsEditor.selectedNode.select("rect")
                        .attr("stroke", "#bbb")
                        .attr("stroke-width", 1);
                    graphsEditor.selectedNode.selectAll("text.io-node-output-number")
                        .attr("display", "none");
                    graphsEditor.selectedNode.selectAll("circle.output-node")
                        .attr("r", 5)
                        .attr("stroke-width", 1);
                }

                graphsEditor.selectedNode = selection;
                graphsEditor.selectedNode.classed("node-selected", true);

                graphsEditor.selectedNode.select("rect")
                    .attr("stroke", "#2086BF")
                    .attr("stroke-width", 3);
                graphsEditor.selectedNode.selectAll("text.io-node-output-number")
                    .attr("display", "block");
                graphsEditor.selectedNode.selectAll("circle.output-node")
                    .attr("r", 13)
                    .attr("stroke-width", 2);
                graphsEditor.selectedNode.selectAll("circle.io-node-mousearea")
                    .attr("opacity", 0)
                    .attr("r", 13)
                    .attr("stroke-width", 2);
                break;
        }
    }

    /**
     * Event listener : ioNode
     */

    self.ioNodeEventListener = function (selection, eventType) {
        switch (eventType) {

            case "dragstart":
                graphsEditor.isDraggingNewConnectingLine = true;
                graphsEditor.sourceNodeGlobalPosition = self.getGlobalPosition(self.g, selection);
                graphsEditor.sourceNode = selection;
                graphsEditor.sourceNode.itemNode = self;

                graphsEditor.svgG.append("path")
                .attr("id", "temp-connecting-line")
                .attr("d", "M " + graphsEditor.sourceNodeGlobalPosition[0] +
                    "," + graphsEditor.sourceNodeGlobalPosition[1] +
                    " L " + d3.event.x +
                    ", " + d3.event.y + " ")
                .attr("stroke", "#333");
                
                break;

            case "dragon":
                graphsEditor.svgG.select("#temp-connecting-line")
                .attr("d", "M " + graphsEditor.sourceNodeGlobalPosition[0] +
                    "," + graphsEditor.sourceNodeGlobalPosition[1] +
                    " L " + d3.event.x +
                    ", " + d3.event.y + " ");
                break;

            case "dragend":
                graphsEditor.svgG.select("#temp-connecting-line").remove();
                
                if(graphsEditor.isIoNodeMouseEnter == true){
                    console.log("connect");
                    console.log(self.getGlobalPosition(graphsEditor.sourceNode.itemNode.g, graphsEditor.sourceNode));
                    console.log(self);
                    
                    console.log(graphsEditor.sourceNode);
                    console.log(graphsEditor.destinationNode);
                }

                graphsEditor.isDraggingNewConnectingLine = false;
                graphsEditor.sourceNode = null;
                
                break;

            case "mouseenter":
                graphsEditor.isIoNodeMouseEnter = true;
                if(graphsEditor.isDraggingNewConnectingLine){
                    graphsEditor.destinationNode = selection;
                    graphsEditor.destinationNode.itemNode = self;
                }
                
                selection.classed("io-node-mouseenter", true);
                let gPosition = self.getTranslation(self.g.attr("transform"));
                let tooltipCx = gPosition[0] + parseInt(selection.attr("cx"));
                let tooltipCy = gPosition[1] + parseInt(selection.attr("cy"));

                let ioTooltipTextBox = graphsEditor.svgG.append("rect")
                    .attr("class", "io-node-tooltip")
                    .attr("x", tooltipCx)
                    .attr("y", tooltipCy - 12)
                    .attr("stroke", "#ddd")
                    .attr("fill", "#fff")
                    .attr("height", 24);

                let ioTooltipText = graphsEditor.svgG.append("text")
                    .attr("class", "io-node-tooltip")
                    .attr("x", tooltipCx + 20)
                    .attr("y", tooltipCy + 4)
                    .text("Contoh keterangan teks");

                ioTooltipTextBox.attr("width", ioTooltipText.node().getBBox().width + 40)

                graphsEditor.svgG.append("circle")
                    .attr("class", "io-node-tooltip")
                    .attr("fill", "#fff")
                    .attr("r", 13)
                    .attr("stroke", "#999")
                    .attr("stroke-width", 2)
                    .attr("cx", tooltipCx)
                    .attr("cy", tooltipCy);

                graphsEditor.svgG.selectAll("circle.io-node-tooltip")
                    .call(d3.drag()
                        .on("start", function () {
                            self.ioNodeEventListener(selection, 'dragstart');
                        })
                        .on("drag", function () {
                            self.ioNodeEventListener(d3.event, 'dragon');
                        })
                        .on("end", function () {
                            self.ioNodeEventListener(selection, 'dragend');
                        })
                    ).on('mouseleave', function () {
                        self.ioNodeEventListener(selection, 'mouseleave');
                    });

                break;

            case "mouseleave":
                graphsEditor.isIoNodeMouseEnter = false;
                selection.classed("io-node-mouseleave", false);

                if(graphsEditor.isDraggingNewConnectingLine){
                    graphsEditor.destinationNode = null;
                }

                graphsEditor.svgG.selectAll(".io-node-tooltip").remove();
                break;

        }
    }

    /** 
     * Event registrations
     */

    self.g
        .call(d3.drag()
            .on("start", function () {
                self.itemNodeEventListener(d3.select(this), "dragstart");
            })
            .on("drag", function () {
                self.itemNodeEventListener(d3.select(this), "dragon");
            })
            .on("end", function () {
                self.itemNodeEventListener(d3.select(this), "dragend");
            })
        )
        .on("mouseenter", function () {
            self.itemNodeEventListener(d3.select(this), "mouseenter");
        })
        .on("mouseleave", function () {
            self.itemNodeEventListener(d3.select(this), "mouseleave");
        })
        .on("click", function () {
            self.itemNodeEventListener(d3.select(this), "click");
        });

    self.g.foreignObject = self.g.append("foreignObject")
        .attr("x", 40)
        .attr("y", 40)
        .attr("width", 230);

    self.g.foreignObject.append("xhtml:div")
        .html(self.description);

    self.g.foreignObject.attr("height", function () {
        return self.g.foreignObject.select("div").node().offsetHeight;
    });

    self.g.rect = self.g.append("rect")
        .attr("width", 280)
        .attr("height", function () {
            return parseInt(self.g.foreignObject.attr("height"), 10) + 60;
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

    self.inputNodes.forEach(function (inputNode, i) {
        let distanceBetweenInputNodes = self.g.rect.attr("width") / (self.inputNodes.length + 1) * (i + 1);

        self.g.append("circle")
            .attr("class", "unconnected-node input-node")
            .attr("r", 5)
            .attr("stroke-width", 1)
            .attr("stroke", "#777")
            .attr("fill", "#fff")
            .attr("cx", distanceBetweenInputNodes)
            .attr("cy", 0)
            .call(d3.drag()
                .on("start", function () {
                    self.ioNodeEventListener(d3.select(this), "dragstart");
                })
                .on("drag", function () {
                    self.ioNodeEventListener(d3.select(this), "dragon");
                })
                .on("end", function () {
                    self.ioNodeEventListener(d3.select(this), "dragend");
                })
            )
            .on("mouseenter", function () {
                self.ioNodeEventListener(d3.select(this), "mouseenter");
            });
    });

    self.outputNodes.forEach(function (outputNode, i) {
        let distanceBetweenOutputNodes = self.g.rect.attr("width") / (self.outputNodes.length + 1) * (i + 1);

        self.g.append("circle")
            .attr("class", "unconnected-node output-node")
            .attr("r", 5)
            .attr("stroke-width", 1)
            .attr("stroke", "#777")
            .attr("fill", "#fff")
            .attr("cx", distanceBetweenOutputNodes)
            .attr("cy", self.g.rect.attr("height"));

        self.g.append("text")
            .attr("class", "io-node-output-number")
            .attr("dx", distanceBetweenOutputNodes - 4)
            .attr("dy", parseInt(self.g.rect.attr("height")) + 4)
            .attr("font-size", 16)
            .attr("display", "none")
            .text((i + 1));

        self.g.append("circle")
            .attr("class", "io-node-mousearea io-node-output")
            .attr("r", 5)
            .attr("fill", "#fff")
            .attr("opacity", 0)
            .attr("cx", distanceBetweenOutputNodes)
            .attr("cy", self.g.rect.attr("height"))
            .call(d3.drag()
                .on("start", function () {
                    self.ioNodeEventListener(d3.select(this), "dragstart");
                })
                .on("drag", function () {
                    self.ioNodeEventListener(d3.select(this), "dragon");
                })
                .on("end", function () {
                    self.ioNodeEventListener(d3.select(this), "dragend");
                })
            )
            .on("mouseenter", function () {
                self.ioNodeEventListener(d3.select(this), "mouseenter");
            });
    });

}