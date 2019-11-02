import React from 'react';

const isDOMReady = () => typeof window !== 'undefined' && typeof document !== 'undefined';

const useTitle = (title: string) => {
  if (isDOMReady()) {
    document.title = title;
  }
  // React.useEffect(() => {
  //   document.title = title;
  // }, []);
};

const useMeta = (attr: any) => {
  const keys = Object.keys(attr);
  let selector = 'meta';
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    selector += `[${key}=${attr[key]}]`;
  }

  React.useEffect(() => {
    const meta: HTMLMetaElement = document.querySelector(selector) || document.createElement('meta');
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      meta.setAttribute(key, attr[key]);
    }
    document.getElementsByTagName('head')[0].appendChild(meta);
  }, []);
};

export default function Head({ children }: { children: React.ReactNode }) {
  const elements = React.Children.toArray(children) as React.ReactElement[];
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
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
