import React from 'react';

let _htmlElement;

const getHtmlElement = child => {
  console.log(child);

  if (typeof child === 'string' || child.type === 'script') {
    return undefined;
  }
  if (typeof child.ref === 'function') {
    return getHtmlElement(child.ref(child._self));
  }
  if (typeof child.type === 'function') {
    return getHtmlElement(child.type(child.props));
  }
  if (child.type === 'html') {
    return child;
  }
  React.Children.forEach(child.props.children, child => {
    if (_htmlElement) {
      return;
    }
    const __htmlElement = getHtmlElement(child);
    if (__htmlElement) {
      _htmlElement = __htmlElement;
      return;
    }
    if (child.type === 'html') {
      _htmlElement = child;
      return;
    }
  });
  return _htmlElement;
};

export const hasHtml = (element) => {
  return typeof getHtmlElement(element) !== 'undefined';
};
