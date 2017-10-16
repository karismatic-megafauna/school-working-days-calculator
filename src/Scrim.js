import React from 'react';
import PropTypes from 'prop-types';
import './App.css';

const Scrim = ({ onClick, zIndex, style, componentClass: Component }) => (
  <Component
    onClick={onClick}
    style={{ zIndex, ...style }}
    className="Scrim"
  />
);

Scrim.propTypes = {
  onClick: PropTypes.func,
  style: PropTypes.object,
  componentClass: PropTypes.string,
  zIndex: PropTypes.number,
};

Scrim.defaultProps = {
  componentClass: 'div',
  zIndex: 10000,
  style: {},
};

export default Scrim;
