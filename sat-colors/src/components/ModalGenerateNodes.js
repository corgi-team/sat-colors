import React, { Component } from 'react';
import { Modal, FormGroup, FormControl, Button } from 'react-bootstrap';


export default class ModalGenerateNodes extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            nodes: 0
        }

        this.getValidationStateNumberNode = this.getValidationStateNumberNode.bind(this);
        this.handleChangeNode = this.handleChangeNode.bind(this);
    }

    getValidationStateNumberNode() {
        if (this.state.nodes == 0) {
            return 'warning';
        }
        if (!isNaN(parseFloat(this.state.nodes)) && isFinite(this.state.nodes)) {
            return 'success';
        }
        return 'error';
    }

    handleChangeNode(e) {
        this.setState({
            nodes: e.target.value
        })
    }

    render() {
        return (
            <Modal show={this.props.showModal} onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Choose number of nodes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup controlId="formNodesNumber" validationState={this.getValidationStateNumberNode()}>
                        <FormControl
                            type="text"
                            value={this.state.nodes}
                            placeholder="default: 0"
                            onChange={this.handleChangeNode}
                        />
                    </FormGroup>
                    <Button type="submit" onClick={() => this.props.handleGenerateNodes(this.state.nodes)}>Generate</Button>
                </Modal.Body>
            </Modal>
        );
    }
}
