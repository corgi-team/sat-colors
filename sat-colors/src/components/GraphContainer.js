import React, { Component } from 'react';
import '../../node_modules/vis/dist/vis.css';
let vis = require('vis');

var nodes = new vis.DataSet([
    {id: 1, label: 'Node 1'},
    {id: 2, label: 'Node 2'},
    {id: 3, label: 'Node 3'},
    {id: 4, label: 'Node 4'},
    {id: 5, label: 'Node 5'}
]);

// create an array with edges
var edges = new vis.DataSet([
    {from: 1, to: 3},
    {from: 1, to: 2},
    {from: 2, to: 4},
    {from: 2, to: 5}
]);

var data = {
    nodes: nodes,
    edges: edges
};

var options = {};

export default class GraphContainer extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        var container = document.getElementById('container');
        var network = new vis.Network(container, data, options);
    }

    render() {
        return (
            <div id="container">
            </div>
        );
    }
}
