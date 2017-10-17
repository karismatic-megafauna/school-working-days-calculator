import React from 'react';
import styled from 'styled-components';

const Button = ({ onClick, className, children }) => (
  <button
    onClick={onClick}
    className={className}
  >
    {children}
  </button>
);

const StyledButton = styled(Button)`
  background: none;
  border: 2px solid;
  color: inherit;
  display: block;
  font-weight: 600;
  max-width: 250px;
  min-width: 150px;
  padding: 1em 2em;
  position: relative;
  transition: border-color 0.4s, color 0.4s;
  z-index: 1;
  border-radius: 2px;

  &:hover {
    color: #fff;
    border-color: #37474f;

    &:before {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #37474f;
    z-index: -1;
    opacity: 0;
    transform: scale3d(0.7, 1, 1);
    transition: transform 0.4s, opacity 0.4s;
    transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
  }

  &:focus {
    outline: none;
  }
`;

export default StyledButton;
