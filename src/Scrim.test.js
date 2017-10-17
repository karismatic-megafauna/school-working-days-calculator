import React from 'react';
import { shallow } from 'enzyme';
import Scrim from './Scrim';

const setup = (propOverrides) => {
  const props = Object.assign({
    // default props
  }, propOverrides);

  const wrapper = shallow(<Scrim {...props} />);

  return {
    props,
    wrapper,
  };
};

describe('<Scrim />', () => {

  it('Render with correct class', () => {
    const scrim = setup({ className: 'test' });
    expect(scrim.wrapper.find('.test')).toHaveLength(1);
  });

  it('Component can be clickable', (done) => {
    const scrim = setup({ onClick: done() });
    scrim.wrapper.simulate('click');
  });
  
});