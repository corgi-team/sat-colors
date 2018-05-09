import React, { Component } from 'react';
import { Graph } from '@vx/network'

// const nodes =
//   [{x: 50, y: 20}, {x: 200, y: 300}, {x: 300, y: 40}];

//   const dataSample = {
//     nodes,
//     links: [
//     //   {source: nodes[0], target: nodes[1]},
//     //   {source: nodes[1], target: nodes[2]},
//     //   {source: nodes[2], target: nodes[0]}
//     ]
//   };


export default class GraphContainer extends Component {
    constructor() {
        super();

        this.state = {
            nodes : [],
            links : []
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.x;
        let y = e.clientY - rect.y;

        let node = {
            x : x,
            y : y
        }

        let nodes = this.state.nodes;
        nodes.push(node);

        this.setState({
            nodes : nodes
        })

        // let evt = e;
        // let x = evt.clientX;
        // let y = evt.clientY;
        // console.log(evt.x)
        // alert("x: "+x+" y:"+y);
    }
    
    render() {
        let width = 800;
        let height = 800;

        let data = {
            nodes : this.state.nodes,
            links : this.state.links
        }

        return (
            <div className="GraphContainer--container">
                <svg 
                    width={width}
                    height={height}
                    onClick={this.handleClick}>
                    <rect
                        width={width}
                        height={height}
                        rx={14}
                        fill='#272b4d'/>
                    <Graph graph={data}/>
                </svg>
            </div>
        );
    }
}

