import React from 'react';

const createComponent = (elements: React.ReactElement[], condition: (el: React.ReactElement) => boolean) => {
  let component = undefined;
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (condition(element)) {
      component = () => React.createElement(element.type, element.props);
      break;
    }
  }
  return component;
};

export const createTitleComponent = (elements: React.ReactElement[]) => {
  return createComponent(elements, el => el.type === 'title');
};

export const createMetaDescriptionComponent = (elements: React.ReactElement[]) => {
  return createComponent(elements, el => el.type === 'meta' && el.props.name === 'description');
};
