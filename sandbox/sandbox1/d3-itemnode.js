/**
 * ItemNode representasi satu tahapan klasifikasi
 * memiliki sub-simpul input dan sub-simpul output
 * 
 * @param {GraphsEditor} graphsEditor - digunakan untuk memanipulasi GraphsEditor  
 * @param {*} nodeConfig - konfigurasi untuk tiap simpul
 * @param {*} initialPosition - posisi awal penempatan simpul tahapan
 */
function ItemNode(graphsEditor, nodeConfig, initialPosition) {

    /**
     * Beda antara <<posisi awal simpul tahapan>> dengan <<posisi mouse ketika mendrag>>
     */
    this.xDifference, this.yDifference;

    /**
     * Group utama dari GraphsEditor
     * untuk manipulasi elemen-elemen di dalamnya
     */
    this.svgG = graphsEditor.svgG;

    /**
     * Konfigurasi simpul tahapan
     */
    this.nodeConfig = nodeConfig;

    this.nodeG;

    /**
     * Posisi awal simpul tahapan
     */
    this.initialPosition = initialPosition;

    /**
     * Variabel penunjuk objek kelas ini
     */
    var self = this;

    /**
     * nodeG group dari simpul tahapan 
     * elemen-elemen bagian dari simpul tahapan seperti 
     * sub-simpul input output, judul simpul tahapan, deskripsi simpul tahapan ditambahkan kesini
     */

    self.nodeG = self.svgG.append("g")
        .attr("class", "node")
        .attr("transform", "translate(300, 30)");

    /**
     * Event listener ketika simpul tahapan didrag
     */

    self.dragstarted = function (d) {
        d3.select(this).raise().classed("active", true);

        let gCurrentPosition = self.getTranslation(d3.select(this).attr("transform"));

        let gPositionX = gCurrentPosition[0];
        self.xDifference = (d3.event.x - gPositionX);

        let gPositionY = gCurrentPosition[1];
        self.yDifference = (d3.event.y - gPositionY);
    };

    self.dragged = function (d) {
        d3.select(this)
            .attr("transform", "translate(" + (d3.event.x - self.xDifference) + ", " + (d3.event.y - self.yDifference) +
                ")");
    };

    self.dragend = function (d) {
        d3.select(this).classed("active", false);
        console.log("dragend");
    };

    /**
     * Event listener ketika sub-simpul input output tahapan didrag
     */

    self.ioDragListener = function (selection, eventType) {

        if (eventType == "dragstart") {

            console.log("ioDragstarted 22");

            graphsEditor.isDraggingIOLine = true;

            graphsEditor.ioStartDragPositionX = d3.event.x;
            graphsEditor.ioStartDragPositionY = d3.event.y;

            graphsEditor.svgG.append("path")
                .attr("id", "io-connect-nodes-path")
                .attr("d", "M " + graphsEditor.ioStartDragPositionX +
                    "," + graphsEditor.ioStartDragPositionY +
                    " L " + graphsEditor.ioStartDragPositionX +
                    ", " + graphsEditor.ioStartDragPositionY + " ")
                .attr("stroke", "#333");

        } else if (eventType == "mouseenter") {
            console.log("ioMouseenter 22");
            selection.classed("node-io-mouseenter", true);
            let gPosition = self.getTranslation(self.nodeG.attr("transform"));
            let tooltipCx = gPosition[0] + parseInt(selection.attr("cx"));
            let tooltipCy = gPosition[1] + parseInt(selection.attr("cy"));

            let ioTooltipTextBox = graphsEditor.svgG.append("rect")
                .attr("class", "node-io-tooltip")
                .attr("x", tooltipCx)
                .attr("y", tooltipCy - 12)
                .attr("stroke", "#ddd")
                .attr("fill", "#fff")
                .attr("height", 24);

            let ioTooltipText = graphsEditor.svgG.append("text")
                .attr("class", "node-io-tooltip")
                .attr("x", tooltipCx + 20)
                .attr("y", tooltipCy + 4)
                .text("Contoh keterangan teks");

            ioTooltipTextBox.attr("width", ioTooltipText.node().getBBox().width + 40)

            graphsEditor.svgG.append("circle")
                .attr("class", "node-io-tooltip")
                .attr("fill", "#fff")
                .attr("r", 13)
                .attr("stroke", "#999")
                .attr("stroke-width", 2)
                .attr("cx", tooltipCx)
                .attr("cy", tooltipCy);

            graphsEditor.svgG.selectAll("circle.node-io-tooltip")
                .call(d3.drag()
                    .on("start", function () {
                        self.ioDragListener(selection, 'dragstart');
                    })
                    .on("drag", function () {
                        self.ioDragListener(d3.event, 'dragon');
                    })
                    .on("end", function () {
                        self.ioDragListener(selection, 'dragend');
                    })
                ).on('mouseleave', function () {
                    self.ioDragListener(selection, 'mouseleave');
                });


        } else if (eventType == "mouseleave") {
            console.log("ioMouseleave 22");
            selection.classed("node-io-mouseleave", false);

            graphsEditor.svgG.selectAll(".node-io-tooltip").remove();

        } else if (eventType == "dragend") {
            console.log("ioDragend 22");
            
            graphsEditor.svgG.select("#io-connect-nodes-path").remove();
        
            graphsEditor.isDraggingIOLine = false;
        
        } else if (eventType == "dragon") {

            console.log("ioDragon 22");
            graphsEditor.svgG.select("#io-connect-nodes-path")
                .attr("d", "M " + graphsEditor.ioStartDragPositionX +
                    "," + graphsEditor.ioStartDragPositionY +
                    " L " + d3.event.x +
                    ", " + d3.event.y + " ");
            
            
        }

    };

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



    /**
     * Listener ketika area simpul tahapan dimasuki mouse
     */

    self.rectMouseEnterHandler = function (e) {
        d3.select(this)
            .attr("stroke", "#777")
            .attr("stroke-width", 2);
    }

    /**
     * Listener ketika area simpul tahapan ditinggalkan mouse
     */

    self.rectMouseLeaveHandler = function (e) {
        d3.select(this)
            .attr("stroke", "#bbb")
            .attr("stroke-width", 1);
    }

    /**
     * Judul dan deskripsi dari simpul tahapan
     */

    self.nodeDescFO = self.nodeG.append("foreignObject")
        .attr("x", 40)
        .attr("y", 40)
        .attr("width", 230)
        .attr("height", 40);

    self.nodeDescFO.append("xhtml:div")
        .html(nodeConfig.desc);

    let nodeRect = self.nodeG.append("rect")
        .attr("width", 280)
        .attr("height", function () {
            return self.nodeDescFO.select("div").node().offsetHeight + 60;
        })
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("fill", "#fff")
        .attr("stroke", "#bbb")
        .attr("stroke-width", "1");


    let nodeTitle = self.nodeG.append("text")
        .attr("class", "node-title")
        .attr("x", 40)
        .attr("y", 30)
        .text(nodeConfig.title);


    /**
     * Event ketika group simpul tahapan diklik
     */

    self.nodeG.on("click", function () {
        if (graphsEditor.selectedNode != null) {
            graphsEditor.selectedNode.classed("node-selected", false);

            graphsEditor.selectedNode.select("rect")
                .attr("stroke", "#bbb")
                .attr("stroke-width", 1);
            graphsEditor.selectedNode.selectAll("text.node-io-output-number")
                .attr("display", "none");
            graphsEditor.selectedNode.selectAll("circle.node-io-output")
                .attr("r", 5)
                .attr("stroke-width", 1);
        }

        graphsEditor.selectedNode = d3.select(this);
        graphsEditor.selectedNode.classed("node-selected", true);

        graphsEditor.selectedNode.select("rect")
            .attr("stroke", "#2086BF")
            .attr("stroke-width", 3);
        graphsEditor.selectedNode.selectAll("text.node-io-output-number")
            .attr("display", "block");
        graphsEditor.selectedNode.selectAll("circle.node-io-output")
            .attr("r", 13)
            .attr("stroke-width", 2);
        graphsEditor.selectedNode.selectAll("circle.node-io-mousearea")
            .attr("opacity", 0)
            .attr("r", 13)
            .attr("stroke-width", 2);

    });

    /**
     * Event ketika group simpul tahapan didrag
     */

    self.nodeG.call(d3.drag()
        .on("start", self.dragstarted)
        .on("drag", self.dragged)
        .on("end", self.dragend)
    );

    /**
     * Inisiasi dan pendaftaran event untuk tiap sub-simpul input output tahapan
     */

    for (let i = 0; i < self.nodeConfig.inputs.length; i++) {

        let distanceBetweenNodeInputs = nodeRect.attr("width") / (self.nodeConfig.inputs.length + 1) * (i + 1);

        self.nodeG.append("circle")
            .attr("class", "node-io-unconnected node-io-input")
            .attr("r", 5)
            .attr("stroke-width", 1)
            .attr("stroke", "#777")
            .attr("fill", "#fff")
            .attr("cx", distanceBetweenNodeInputs)
            .attr("cy", 0)
            .call(d3.drag()
                .on("start", function () {
                    self.ioDragListener(d3.select(this), 'dragstart');
                })
                .on("drag", function () {
                    self.ioDragListener(d3.event, 'dragon');
                })
                .on("end", function () {
                    self.ioDragListener(d3.select(this), 'dragend');
                })
            ).on('mouseenter', function () {
                self.ioDragListener(d3.select(this), 'mouseenter');
            });
    }

    for (let i = 0; i < self.nodeConfig.outputs.length; i++) {

        let distanceBetweenNodeOutputs = nodeRect.attr("width") / (self.nodeConfig.outputs.length + 1) * (i + 1);

        self.nodeG.append("circle")
            .attr("class", "node-io-unconnected node-io-output")
            .attr("r", 5)
            .attr("stroke-width", 1)
            .attr("stroke", "#777")
            .attr("fill", "#fff")
            .attr("cx", distanceBetweenNodeOutputs)
            .attr("cy", nodeRect.attr("height"));

        self.nodeG.append("text")
            .attr("class", "node-io-output-number")
            .attr("dx", distanceBetweenNodeOutputs - 4)
            .attr("dy", parseInt(nodeRect.attr("height")) + 4)
            .attr("font-size", 16)
            .attr("display", "none")
            .text((i + 1));

        self.nodeG.append("circle")
            .attr("class", "node-io-mousearea node-io-output")
            .attr("r", 5)
            .attr("fill", "#fff")
            .attr("opacity", 0)
            .attr("cx", distanceBetweenNodeOutputs)
            .attr("cy", nodeRect.attr("height"))
            .call(d3.drag()
                .on("start", function () {
                    self.ioDragListener(d3.select(this), 'dragstart');
                })
                .on("drag", function () {
                    self.ioDragListener(d3.event, 'dragon');
                })
                .on("end", function () {
                    self.ioDragListener(d3.select(this), 'dragend');
                })
            ).on('mouseenter', function () {
                self.ioDragListener(d3.select(this), 'mouseenter');
            });
    }


}