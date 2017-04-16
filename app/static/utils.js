var graph = {}
function prettyPrintJson(obj, levels) {
    var formatter = new JSONFormatter(obj, levels, {
        theme: 'dark'
    });
    var nmtNode = document.getElementById('jsonSideBar');
    visible('jsonSideBar')
    if (nmtNode.firstChild) {
        nmtNode.removeChild(nmtNode.firstChild)
    }
    nmtNode.appendChild(formatter.render())
}

function _objectWithoutProperties(obj, keys) {
    var target = {};
    for (var i in obj) {
        if (keys.indexOf(i) >= 0) continue;
        if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
        target[i] = obj[i];
    }
    return target;
}

function parse_graph(graphData) {
    NProgress.done();
    hide("loadBlock");
    var container = document.getElementById('mynetwork');
    var nodes = graphData["nodes"];
    var edges = graphData["edges"];
    about["Nodes"] = nodes.length;
    about["Edges"] = edges.length;
    about["Stories"] = graphData["number_of_stories"];
    graph.nodesDataset = new vis.DataSet(nodes); // these come from WorldCup2014.js
    graph.edgesDataset = new vis.DataSet(edges); // these come from WorldCup2014.js
    redrawAll();
}
function searchStory(story_id) {
    NProgress.configure({
        showSpinner: false
    });
    show("loadBlock");
    hidden('jsonSideBar')
    NProgress.start();
    jQuery.getJSON("/story/" + story_id, function (graphData) {
        parse_graph(graphData);
    });
}

function initGraph(storyType) {
    NProgress.configure({
        showSpinner: false
    });
    NProgress.start();
    show("loadBlock");
    hidden('jsonSideBar')
    console.log(storyType);
    storyType = storyType || "hot";
    console.log(storyType);
    jQuery.getJSON("/stories/" + storyType, function (graphData) {
        parse_graph(graphData);
    });
}