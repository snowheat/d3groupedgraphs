/**
 * GraphsEditor mengelola tahapan-tahapan klasifikasi dalam bentuk graf 
 * 
 * @param {svg} svg - Container utama SVG untuk GraphsEditor
 */
function GraphsEditor(svg) {
    
    /**
     * Menyimpan data hubungan antar simpul dan sub-simpul GraphsEditor
     */
    this.graphsData = {};

    /**
     * Menyimpan setiap simpul yang dibuat
     */
    this.itemNodes = [];

    /**
     * Simpul tahapan yang sedang diklik
     */
    this.selectedNode;

    var svgDefs = svg.append("svg:defs");

    /**
     * Komponen untuk digunakan berkali-kali
     */
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
     * Posisi awal sub-simpul IO ketika mulai mendrag garis tahapan
     */
    this.ioStartDragPositionX, this.ioStartDragPositionY;

    /**
     * Posisi mouse mendrag garis tahapan
     */
    this.ioCurrentDragPosition;
    
    /**
     * Apakah sedang mendrag garis tahapan
     */
    this.ioIsDraggingLine = false;
    
    /**
     * Apakah mouse masuk area sub-simpul IO
     */
    this.ioIsMouseEnter = false;

    /**
     * Sub-simpul IO asal
     */
    this.ioSource = null;

    /**
     * Sub-simpul IO tujuan
     */
    this.ioDestination = null;
    
    /**
     * Representasi GraphsEditor
     */
    var graphsEditor = this;

    /**
     * Group SVG utama untuk menampung simpul-simpul tahapan
     */
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
        })
        .on("mousemove", function(){
            if(self.isDragNewItemFromMenu == null){
                console.log(d3.event.x);
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