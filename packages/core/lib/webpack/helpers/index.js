import React from 'react';
import cheerio from 'cheerio';
import parse from 'html-react-parser';

const appendStyle = (props) => {
  const { id, css, ...rest } = props;
  if (!document.head.querySelector('#' + id)) {
    const node = document.createElement('style');
    node.id = id;
    node.type = 'text/css';
    node.textContent = css;
    const keys = Object.keys(rest);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      node.setAttribute(key, rest[key]);
    }
    document.head.appendChild(node);
  }
}

const appendScript = (props) => {
  const { id, script, isHead, ...rest } = props;
  if (!document.head.querySelector('#' + id)) {
    const node = document.createElement('script');
    node.id = id;
    node.type = 'text/javascript';
    node.textContent = script;
    const keys = Object.keys(rest);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      node.setAttribute(key, rest[key]);
    }
    if (isHead) {
      document.head.appendChild(node);
    } else {
      document.body.appendChild(node);
    }
  }
}

const isDOMReady = () => typeof window !== 'undefined' && typeof document !== 'undefined';
const styleCache = {};
const scriptCache = {};

class InjectStyle extends React.Component {
  constructor(props) {
    super(props);

    const { css, ...rest } = props;

    if (!styleCache[css]) {
      const incrementalId = Object.keys(styleCache).length;
      styleCache[css] = 'react-ssr-style-' + incrementalId;
    }

    if (isDOMReady()) {
      appendStyle({
        id: styleCache[css],
        css,
        ...rest,
      });
      this.ready = true;
    }
  }

  componentDidMount() {
    const { css, ...rest } = this.props;

    if (!this.ready && isDOMReady()) {
      appendStyle({
        id: styleCache[css],
        css,
        ...rest,
      });
    }
  }

  render() {
    return null;
  }
}

class InjectScript extends React.Component {
  constructor(props) {
    super(props);

    const { script, isHead, ...rest } = props;

    if (!scriptCache[script]) {
      const incrementalId = Object.keys(scriptCache).length;
      scriptCache[script] = 'react-ssr-script-' + incrementalId;
    }

    if (isDOMReady()) {
      appendScript({
        id: scriptCache[script],
        script,
        isHead,
        ...rest,
      });
      this.ready = true;
    }
  }

  componentDidMount() {
    const { script, isHead, ...rest } = this.props;

    if (!this.ready && isDOMReady()) {
      appendScript({
        id: scriptCache[script],
        script,
        isHead,
        ...rest,
      });
    }
  }

  render() {
    return null;
  }
}

// const InjectStyle = (props) => {
//   const { css, ...rest } = props;
//   const [ready, setReady] = React.useState(false);

//   if (!styleCache[css]) {
//     const incrementalId = Object.keys(styleCache).length;
//     styleCache[css] = 'react-ssr-style-' + incrementalId;
//   }

//   if (isDOMReady()) {
//     appendStyle({
//       id: styleCache[css],
//       css,
//       ...rest,
//     });
//     setReady(true);
//   }

//   React.useEffect(() => {
//     if (!ready && isDOMReady()) {
//       appendStyle({
//         id: styleCache[css],
//         css,
//         ...rest,
//       });
//     }
//   }, []);

//   return null;
// };

// const InjectScript = (props) => {
//   const { script, isHead, ...rest } = props;
//   const [ready, setReady] = React.useState(false);

//   if (!scriptCache[script]) {
//     const incrementalId = Object.keys(scriptCache).length;
//     scriptCache[script] = 'react-ssr-script-' + incrementalId;
//   }

//   if (isDOMReady()) {
//     appendScript({
//       id: scriptCache[script],
//       script,
//       isHead,
//       ...rest,
//     });
//     setReady(true);
//   }

//   React.useEffect(() => {
//     if (!ready && isDOMReady()) {
//       appendScript({
//         id: scriptCache[script],
//         script,
//         isHead,
//         ...rest,
//       });
//     }
//   }, []);

//   return null;
// };

const convertAttrToJsxStyle = attr => {
  const jsxAttr = {};
  const keys = Object.keys(attr);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (key === 'class') {
      key = 'className';
    }
    if (key === 'charset') {
      key = 'charSet';
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

const root = document.getElementById('react-ssr-root');
const markup = root ? root.innerHTML : document.documentElement.outerHTML;

let $;
let html;
let title;
const metas = [];
const styles = [];
let body;
const scriptsInHead = [];
const scriptsInBody = [];

if (!root) {
  $ = cheerio.load(markup);
  const $html = $('html');
  html = {
    attr: $html.attr(),
  }
  title = $html.find('head > title').html();
  const $metas = $html.find('head > meta');
  $metas.each((i, el) => {
    const $el = $(el);
    metas.push({
      attr: $el.attr(),
    });
  });
  const $styles = $html.find('head > style');
  $styles.each((i, el) => {
    const $el = $(el);
    styles.push({
      html: $el.html(),
      attr: $el.attr(),
    });
  });
  const $body = $html.find('body')
  body = {
    html: $body.html(),
    attr: $body.attr(),
  }
  const $scriptsInHead = $html.find('head > script');
  $scriptsInHead.each((i, el) => {
    const $el = $(el);
    scriptsInHead.push({
      html: $el.html(),
      attr: $el.attr(),
    });
  });
  const $scriptsInBody = $html.find('body > script');
  $scriptsInBody.each((i, el) => {
    const $el = $(el);
    scriptsInBody.push({
      html: $el.html(),
      attr: $el.attr(),
    });
  });
}

export const getCurrentMarkupComponent = () => {
  if (root) {
    return parse(markup);
  }

  return (
    <html {...convertAttrToJsxStyle(html.attr)}>
      <head>
        {title ? <title>{title}</title> : null}
        {metas.map((meta, i) => (
          <meta
            key={i}
            {...convertAttrToJsxStyle(meta.attr)}
          />
        ))}
        {styles.map((style, i) => {
          console.log(style);
          return (
            <InjectStyle
              key={i}
              css={style.html}
              {...style.attr}
            />
          );
        })}
        {scriptsInHead.map((script, i) => (
          <InjectScript
            key={i}
            script={script.html}
            isHead={true}
            {...script.attr}
          />
        ))}
      </head>
      <body {...convertAttrToJsxStyle(body.attr)}>
        {body.html ? parse(body.html) : null}
        {scriptsInBody.map((script, i) => (
          <InjectScript
            key={i}
            script={script.html}
            isHead={false}
            {...script.attr}
          />
        ))}
      </body>
    </html>
  );
};
