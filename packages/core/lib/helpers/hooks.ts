import * as React from 'react';

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
