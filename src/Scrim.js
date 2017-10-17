import React from 'react';
import styled from 'styled-components';

const Scrim = ({ onClick, className }) => (
  <div className={className} onClick={onClick} />
);

const StyledScrim = styled(Scrim)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
`;

export default StyledScrim;
