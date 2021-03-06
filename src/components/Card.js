/* eslint-disable import/no-named-as-default */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { DragSource, DropTarget } from 'react-dnd';
import Modal from 'react-modal';
import CheckList from './CheckList';
import constants from '../constants';
import EditCard from './EditCard';

const cardDragSpec = {
  beginDrag(props) {
    return {
      id: props.id,
      status: props.status,
    };
  },
  endDrag(props) {
    props.cardCallbacks.persistCardDrag(props.id, props.status);
  },
};
const cardDropSpec = {
  hover(props, monitor) {
    const draggedId = monitor.getItem().id;
    props.cardCallbacks.updatePosition(draggedId, props.id);
  },
};
const collectDrop = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
});
const collectDrag = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
});

const titlePropType = (props, propName, componentName) => {
  if (props[propName]) {
    const value = props[propName];
    if (typeof value !== 'string' || value.length > 80) {
      return new Error(`${propName} in ${componentName} is longer than 80 characters`, );
    }
  }
};

export class Card extends Component {
  constructor() {
    super();
    this.state = {
      showDetails: false,
      isOpen: false,
    };
  }

  onToggleDetails = () => {
    this.setState((state, props) => ({ showDetails: !this.state.showDetails }));
  };

  handleModalOpen = () => {
    this.setState(() => ({
      isOpen: true,
    }));
  };
  handleModalClose = () => {
    this.setState(() => ({ isOpen: false }));
  };

  render() {
    const {
      id, title, description, status, color, tasks
    } = { ...this.props };
    const card = {
      id,
      title,
      description,
      status,
      color,
      tasks,
    };
    const {
      connectDragSource,
      connectDropTarget,
    } = this.props; /* eslint-disable react/no-danger */ // Var and conditional for toggling description of the card on and off
    /* eslint-disable jsx-a11y/no-static-element-interactions  */ let cardDetails;
    if (this.state.showDetails) {
      cardDetails = (
        <CSSTransition key={this.props.id} classNames="toggle" timeout={250}>
          <div className="card__details">
            <span
              dangerouslySetInnerHTML={{
                __html: marked(this.props.description),
              }}
            />
            <CheckList
              cardId={this.props.id}
              tasks={this.props.tasks}
            />
          </div>
        </CSSTransition>
      );
    }
    const sideColor = {
      position: 'absolute',
      zIndex: -1,
      top: 0,
      bottom: 0,
      left: 0,
      width: 7,
      backgroundColor: this.props.color,
    };
    return connectDropTarget(connectDragSource(<div>
      <div className="card">
        <div style={sideColor} />
        <div className="card__edit">
          <button key={this.props.id} onClick={this.handleModalOpen}>
                &#9998;
          </button>
        </div>
        <div
          className={
            this.state.showDetails
              ? 'card__title card__title--is-open'
              : 'card__title'
          }
          onClick={this.onToggleDetails}
          onKeyDown={this.onToggleDetails}
        >
          {this.props.title}
        </div>
        <TransitionGroup>{cardDetails}</TransitionGroup>
      </div>
      <Modal
        isOpen={!!this.state.isOpen}
        onRequestClose={this.handleModalClose}
        contentLabel="Add task"
        closeTimeoutMS={200}
        className="overlay"
        ariaHideApp={false}
      >
        <EditCard
          card={card}
          cardCallbacks={this.props.cardCallbacks}
          modalClose={this.handleModalClose}
        />
        <button className="button" onClick={this.handleModalClose}>
              &times;
        </button>
      </Modal>
    </div>, ), );
  }
}

Card.propTypes = {
  id: PropTypes.string.isRequired,
  title: titlePropType,
  description: PropTypes.string,
  color: PropTypes.string,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  cardCallbacks: PropTypes.shape({
    updateStatus: PropTypes.func.isRequired,
    updatePosition: PropTypes.func.isRequired,
  }).isRequired,
};

const dragHighOrderCard = DragSource(constants.CARD, cardDragSpec, collectDrag)(Card, );
const dragDropHighOrderCard = DropTarget(
  constants.CARD,
  cardDropSpec,
  collectDrop,
)(dragHighOrderCard);

export default dragDropHighOrderCard;
