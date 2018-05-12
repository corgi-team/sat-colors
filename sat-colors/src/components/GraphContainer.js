import React, { Component } from 'react';
import '../../node_modules/vis/dist/vis.css';
let vis = require('vis');
var network;

var options = {
    manipulation: {
        enabled: true,
        initiallyActive: true,
        deleteNode: true,
        deleteEdge: true,
    },
    physics: {
        enabled: false,
    },
    nodes: {
        borderWidth: 1,
        borderWidthSelected: 2,
        color: {
            border: '#000',
            background: '#fff',
            highlight: {
                border: '#000',
                background: '#e3e3e3'
            }
        },
        font : {
            color: '#000',
        },
        shape: 'circle'
    }
};


export default class GraphContainer extends Component {
    constructor() {
        super();

        this.state = {
            values : []
        }

        this.exportNetwork = this.exportNetwork.bind(this);
        this.objectToArray = this.objectToArray.bind(this);
        this.addConnections = this.addConnections.bind(this);
    }

    componentDidMount() {
        // Initialize the graph
        let nodes = new vis.DataSet([]);
        let edges = new vis.DataSet([]);

        let data = {
            nodes: nodes,
            edges: edges
        }

        var graphContainer = document.getElementById('graph');
        network = new vis.Network(graphContainer, data, options);
    }

    exportNetwork() {
        var nodes = this.objectToArray(network.getPositions());
        nodes.forEach(this.addConnections);

        this.setState({
            values : nodes
        })
    }

    // Create the object with x, y and id
    objectToArray(object) {
        return Object.keys(object).map((key) => {
            object[key].id = key;
            return object[key];
        });
    }

    // Find the connections for each node
    addConnections(node) {
        node.connections = network.getConnectedNodes(node.id);
    }

    render() {
        return (
            <div className="GraphContainer--container">
                <div id="graph">
                </div>

                <button onClick={this.exportNetwork}>Save</button>
            </div>
        );
    }
}
