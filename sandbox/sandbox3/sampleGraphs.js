var sampleGraphs = [{
    id: 2,
    inputNodes: [],
    outputNodes: [{
        itemID: 4,
        destinationID: 3
    }],
    position: [235, 100]
},
{
    id: 3,
    inputNodes: [{
        itemID: 2
    }, {
        itemID: 4,
        sourceID: 3
    }],
    outputNodes: [{
        itemID: 5
    }, {
        itemID: 6
    }, {
        itemID: 7
    }],
    position: [112, 10]
}
];

console.log(sampleGraphs);