/**
 * GraphsEditor mengelola tahapan-tahapan klasifikasi dalam bentuk graf 
 * 
 * @param {svg} svg - Container utama SVG untuk GraphsEditor
 */
function GraphsEditor(svg) {

    this.itemNodes = [];
    this.selectedNode;
    this.ioTooltip;

    var svgDefs = svg.append("svg:defs");

    svgDefs.append('svg:marker')
        .attr('id', 'mark-end-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 7)
        .attr('markerHeight', 3.5)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M 0,-5 L10,0 L 0,5');

    svgDefs.append('svg:circle')
        .attr('id', 'defs-node-io-unconnected')
        .attr("r", 4)
        .attr("fill", "#fff")
        .attr("stroke", "#ddd")
        .attr("stroke-width", "1");

    
    /**
     * Posisi awal sub-simpul input output mulai didrag
     */
    this.ioStartDragPositionX, this.ioStartDragPositionY;
    this.ioCurrentDragPosition;
    this.isDraggingIOLine = false;

    var graphsEditor = this;

    graphsEditor.svgG = svg.append("g")
        .attr("id", "svg-g");

    graphsEditor.backgroundRect = graphsEditor.svgG.append("rect")
        .attr("id", "graphic-editor-background-rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "#eee")
        .on("click", function () {
            if (graphsEditor.selectedNode != null) {

                graphsEditor.selectedNode.select("rect")
                    .attr("stroke", "#bbb")
                    .attr("stroke-width", 1);
                graphsEditor.selectedNode.selectAll("text.node-io-output-number")
                    .attr("display", "none");
                graphsEditor.selectedNode.selectAll("circle.node-io-output")
                    .attr("r", 5)
                    .attr("stroke-width", 1);

                graphsEditor.selectedNode.classed("node-selected", false);
                graphsEditor.selectedNode = null;
            }
        });

    let nodeConfig = {
        title: "Impor gambar dari url",
        desc: "File atau folder ekstensi JPG, PNG, ZIP, atau RAR.",
        inputs: [{
            ioTypeID: 2
        }, {
            ioTypeID: 3
        }],
        outputs: [{
            ioTypeID: 1
        }, {
            ioTypeID: 2
        }, {
            ioTypeID: 3
        }]

    };


    this.itemNodes.push(new ItemNode(graphsEditor, nodeConfig, {}));
    this.itemNodes.push(new ItemNode(graphsEditor, nodeConfig, {}));


}