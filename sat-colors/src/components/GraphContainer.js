import React, { Component } from 'react';
import '../../node_modules/vis/dist/vis.css';
let vis = require('vis');

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
