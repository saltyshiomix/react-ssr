import React from 'react';

const useTitle = (title: string) => {
  React.useEffect(() => {
    document.title = title;
  }, []);
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

const useWhat = (elements: React.ReactElement[]) => {
  let title = undefined;
  let meta = undefined;
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    Head.elements.push(element);

    switch (element.type) {
      case 'title':
        title = element;
        break;

      case 'meta':
        meta = element;
        break;

      default:
        break;
    }
  }
  return [title, meta];
};

export default function Head({ children }: { children: React.ReactNode }) {
  const elements = React.Children.toArray(children) as React.ReactElement[];
  const [title, meta] = useWhat(elements);
  title && useTitle(title.props.children);
  meta && useMeta(meta.props);
  return null;
}

Head.elements = [] as React.ReactElement[];
