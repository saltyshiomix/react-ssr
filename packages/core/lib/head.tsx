import React from 'react';
import {
  useTitle,
  useMeta,
} from './helpers';

export default function Head({ children }: { children: React.ReactNode }) {
  const elements = React.Children.toArray(children) as React.ReactElement[];
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    Head.elements.push(element);

    switch (element.type) {
      case 'title':
        useTitle(element.props.children);
        break;

      case 'meta':
        useMeta(element.props);
        break;

      default:
        break;
    }
  }
  return null;
}

Head.elements = [] as React.ReactElement[];
