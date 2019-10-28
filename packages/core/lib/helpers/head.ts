import React from 'react';

export const getSsrId = (html: string): string => {
  let ssrId: string = 'default';
  0 <= html.indexOf('"mui') && (ssrId = 'material-ui');
  0 <= html.indexOf('data-emotion-css') && (ssrId = 'emotion');
  0 <= html.indexOf('"views__') && (ssrId = 'styled-components');
  return ssrId;
}

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

export const useTitle = (title: string) => {
  React.useEffect(() => {
    document.title = title;
  }, [title]);
};

export const useMeta = (attr: any) => {
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
  }, [attr]);
};
