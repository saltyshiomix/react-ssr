import React from 'react';

export const convertAttrToJsxStyle = (attr: any) => {
  const jsxAttr: any = {};
  const keys = Object.keys(attr);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (key === 'class') {
      key = 'className';
    }
    if (0 <= key.indexOf('-')) {
      if (!key.startsWith('data-')) {
        key = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
      }
    }
    jsxAttr[key] = attr[keys[i]];
  }
  return jsxAttr;
}

let _headElement: any = undefined;

const getHeadElement = (child: any): any => {
  if (typeof child === 'string' || child.type === 'script') {
    return undefined;
  }
  if (typeof child.type === 'function') {
    if (child.type.name.toLowerCase() === 'script') {
      return undefined;
    }
    if (child.type.name.toLowerCase() === 'head') {
      return child;
    }
    return getHeadElement(child.type(child.props));
  }
  React.Children.forEach(child.props.children, child => {
    if (_headElement) {
      return;
    }
    const __headElement = getHeadElement(child);
    if (__headElement) {
      _headElement = __headElement;
      return;
    }
    if (typeof child.type === 'function' && child.type.name.toLowerCase() === 'head') {
      _headElement = child;
      return;
    }
  });
  return _headElement;
};

export const extractHeadElements = (element: React.ReactElement): any => {
  const headElement = getHeadElement(element);
  if (!headElement.props.children) {
    return {
      Title: undefined,
      MetaDescription: undefined,
    };
  }
  let Title = undefined;
  let MetaDescription = undefined;
  React.Children.forEach(headElement.props.children, (child: React.ReactElement) => {
    if (child.type === 'title') {
      Title = (props: any) => React.cloneElement(child, props);
    }
    if (child.type === 'meta' && child.props.name === 'description') {
      MetaDescription = (props: any) => React.cloneElement(child, props);
    }
  });
  return {
    Title,
    MetaDescription,
  }
};

// const createComponent = (elements: React.ReactElement[], condition: (el: React.ReactElement) => boolean) => {
//   let component = undefined;
//   for (let i = 0; i < elements.length; i++) {
//     const element = elements[i];
//     if (condition(element)) {
//       component = () => React.createElement(element.type, element.props);
//       break;
//     }
//   }
//   return component;
// };

// export const createTitleComponent = (elements: React.ReactElement[]) => {
//   return createComponent(elements, el => el.type === 'title');
// };

// export const createMetaDescriptionComponent = (elements: React.ReactElement[]) => {
//   return createComponent(elements, el => el.type === 'meta' && el.props.name === 'description');
// };
