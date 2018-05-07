import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';


export default class Banner extends Component {
    render() {
        return (
            <Navbar 
                bsStyle="inverse"
                fixedTop>
                <Navbar.Header>
                    <Navbar.Brand>
                        Colors
                    </Navbar.Brand>
                </Navbar.Header>
            </Navbar>
        )
    }
} 
