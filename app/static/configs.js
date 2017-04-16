var about = {
    About: "Visualization of hackernews",
    Features: "Connection between posts written by the same user",
    Search: "Possible for a specific story (by id)",
    Endpoint: ["/new", "/hot", "/best"],
    Author: "Itiel Shwartz",
    Legend: {
        circle: "story",
        triangle: "comment",
        line: "comment on a story/post",
        "dotted-line": "same user"
    },
    Technologies: {
        server: "sanic (python)",
        NGINX: "ngnix",
        front: "vis.js",
        "fetching-stories": "asyncio-hn",
        "container": "docker",
        "cloud": "Digital ocean"
    },
};

var options = {
    nodes: {
        shape: "dot",
        scaling: {
            min: 10,
            max: 150
        },
        size: 10,
        font: {
            size: 12,
            face: 'Tahoma',
            color: 'black'
        },
        borderWidthSelected: 4
    },
    edges: {
        width: 0.15,
        color: {
            inherit: 'from'
        },
        smooth: {
            type: 'continuous'
        },
        arrows: {
            to: {
                enabled: true
            },
        }
    },
    layout: {
        randomSeed: 1492,
    },
    physics: {
        maxVelocity: 50,
        minVelocity: 0.1,
        solver: 'forceAtlas2Based',
        stabilization: {
            iterations: 500,
            updateInterval: 25,
            fit: true
        },
        barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.6,
            springLength: 95,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0
        },
        forceAtlas2Based: {
            gravitationalConstant: -50,
            centralGravity: 0.01,
            springConstant: 0.08,
            springLength: 100,
            damping: 0.4,
            avoidOverlap: 0
        },
    },
    interaction: {
        tooltipDelay: 200,
        hideEdgesOnDrag: false,
        multiselect: true,
        hover: false,
        keyboard: {
            enabled: false
        }
    }
};
