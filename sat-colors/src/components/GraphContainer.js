import React, { Component } from 'react';
import '../../node_modules/vis/dist/vis.css';
let vis = require('vis');

var options = {
    manipulation: {
        enabled: true,
        initiallyActive: true,
        deleteNode: true,
        deleteEdge: true,
    }
};


export default class GraphContainer extends Component {
    constructor() {
        super();
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
        var network = new vis.Network(graphContainer, data, options);
    }

    render() {
        return (
            <div className="GraphContainer--container">
                <div id="graph">
                </div>
            </div>
        );
    }
}
