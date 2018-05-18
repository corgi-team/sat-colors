import React, { Component } from 'react';
import { Modal, FormGroup, FormControl, Button } from 'react-bootstrap';


export default class ModalSat extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            colors: 0
        }

        this.getValidationStateNumberColor = this.getValidationStateNumberColor.bind(this);
        this.handleChangeColor = this.handleChangeColor.bind(this);
    }

    getValidationStateNumberColor() {
        if (this.state.colors == 0) {
            return 'warning';
        }
        if (!isNaN(parseFloat(this.state.colors)) && isFinite(this.state.colors)) {
            return 'success';
        }
        return 'error';
    }

    handleChangeColor(e) {
        this.setState({
            colors: e.target.value
        })
    }

    render() {
        return (
            <Modal show={this.props.showModal} onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Test sat</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Choose number of colors:</h4>
                    <FormGroup controlId="formColorNumber" validationState={this.getValidationStateNumberColor()}>
                        <FormControl
                            type="text"
                            value={this.state.colors}
                            placeholder="default: 3"
                            onChange={this.handleChangeColor}
                        />
                    </FormGroup>
                    <Button type="submit" onClick={() => this.props.handleSat(this.state.colors)}>Sat solver</Button>
                </Modal.Body>
            </Modal>
        );
    }
}
