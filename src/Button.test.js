import React from 'react';
import { shallow } from 'enzyme';
import Button from './Button';

const setup = (propOverrides) => {
  const props = Object.assign({
    // default props
  }, propOverrides);

  const wrapper = shallow(<Button {...props} />);

  return {
    props,
    wrapper,
  };
};

describe('<Button />', () => {

  it('Render with correct class', () => {
    const button = setup({ className: 'test' });
    expect(button.wrapper.find('.test')).toHaveLength(1);
  });

  it('Component can be clickable', (done) => {
    const button = setup({ onClick: done() });
    button.wrapper.simulate('click');
  });

  it('Component render correct children', () => {
    const button = setup({ children: 'test' });
    expect(button.wrapper.children().text()).toBe('test');
  });
  
});