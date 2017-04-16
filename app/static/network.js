var network;
var allNodes;
var highlightActive = false;
var allEdges;


function redrawAll() {
    var container = document.getElementById('mynetwork');
    var data = {nodes: graph.nodesDataset, edges: graph.edgesDataset} // Note: data is coming from ./datasources/WorldCup2014.js


    NProgress.configure({
        showSpinner: false
    });
    NProgress.start();
    network = new vis.Network(container, data, options);
    network.on("stabilizationProgress", function (params) {
        var maxWidth = 496;
        var minWidth = 20;
        var widthFactor = params.iterations / params.total;
        var width = Math.max(minWidth, maxWidth * widthFactor);
        NProgress.set(widthFactor);
    });
    network.once("stabilizationIterationsDone", function () {
        network.fit();
        NProgress.done()
    });

    // get a JSON object
    allNodes = graph.nodesDataset.get({returnType: "Object"});
    allEdges = graph.edgesDataset.get({returnType: "Object"});
    network.on("click", neighbourhoodHighlight);
}

function makeNodesHardToRead() {
// mark all nodes as hard to read.
    for (var nodeId in allNodes) {
        allNodes[nodeId].color = 'rgba(200,200,200,0.5)';
        if (allNodes[nodeId].hiddenLabel === undefined) {
            allNodes[nodeId].hiddenLabel = allNodes[nodeId].label;
            allNodes[nodeId].label = undefined;
        }
    }
}

function make_node_normal(selectedNode) {
    allNodes[selectedNode].color = undefined;
    if (allNodes[selectedNode].hiddenLabel !== undefined) {
        allNodes[selectedNode].label = allNodes[selectedNode].hiddenLabel;
        allNodes[selectedNode].hiddenLabel = undefined;
    }
}

function neighbourhoodHighlight(params) {
    // if something is selected:
    if (params.nodes.length > 0 && params.nodes[0] > 1100) {

        highlightActive = true;
        var i, j;
        var selectedNode = params.nodes[0];
        var degrees = 2;
        makeNodesHardToRead();
        var connectedNodes = network.getConnectedNodes(selectedNode);
        var allConnectedNodes = connectedNodes.slice(0);
        var allConnectedNodesTemp = connectedNodes.slice(0);
        network.setOptions({physics: false});
        // get the n degree nodes
        for (i = 1; i < degrees; i++) {
            for (j = 0; j < allConnectedNodes.length; j++) {
                allConnectedNodesTemp = allConnectedNodesTemp.concat(network.getConnectedNodes(allConnectedNodesTemp[j]));
            }
            allConnectedNodes = allConnectedNodesTemp.filter(function (item, i, ar) {
                return ar.indexOf(item) === i;
            }); //Remove duplication
            allConnectedNodesTemp = allConnectedNodes.slice(0);
        }

        // all n degree nodes get a different color and their label back
        for (i = 0; i < allConnectedNodes.length; i++) {
            allNodes[allConnectedNodes[i]].color = 'rgba(150,150,150,0.75)';
            if (allNodes[allConnectedNodes[i]].hiddenLabel !== undefined) {
                allNodes[allConnectedNodes[i]].label = allNodes[allConnectedNodes[i]].hiddenLabel;
                allNodes[allConnectedNodes[i]].hiddenLabel = undefined;
            }
        }

        // all first degree     nodes get their own color and their label back
        for (i = 0; i < connectedNodes.length; i++) {
            allNodes[connectedNodes[i]].color = undefined;
            if (allNodes[connectedNodes[i]].hiddenLabel !== undefined) {
                allNodes[connectedNodes[i]].label = allNodes[connectedNodes[i]].hiddenLabel;
                allNodes[connectedNodes[i]].hiddenLabel = undefined;
            }
        }

        // the main node gets its own color and its label back.
        make_node_normal(selectedNode);
        prettyPrintJson(_objectWithoutProperties(allNodes[selectedNode], ["color", "hiddenLabel", "label"]), 1);
    }
    else if (params.edges.length > 0) {
        var selectedEdge = allEdges[params.edges[0]];
        prettyPrintJson(_objectWithoutProperties(selectedEdge.user, ["color", "hiddenLabel", "label"]), 1);
        makeNodesHardToRead()
        highlightActive = true;
        make_node_normal(selectedEdge.from);
        make_node_normal(selectedEdge.to);
    }
    else {
        if (highlightActive === true) {
            // reset all nodes
            for (var nodeId in allNodes) {
                allNodes[nodeId].color = undefined;
                if (allNodes[nodeId].hiddenLabel !== undefined) {
                    allNodes[nodeId].label = allNodes[nodeId].hiddenLabel;
                    allNodes[nodeId].hiddenLabel = undefined;
                }
            }
            highlightActive = false
        }
        network.setOptions({physics: true});
        hidden('jsonSideBar');
    }

// transform the object into an array
    var updateArray = [];
    for (nodeId in allNodes) {
        if (allNodes.hasOwnProperty(nodeId)) {
            updateArray.push(allNodes[nodeId]);
        }
    }
    graph.nodesDataset.update(updateArray);
}


show('popup2')
