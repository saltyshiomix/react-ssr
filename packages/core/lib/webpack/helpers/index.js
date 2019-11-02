import cheerio from 'cheerio';
import parse from 'html-react-parser';

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
        {styles.map((style, i) => (
          <style
            key={i}
            dangerouslySetInnerHTML={{ __html: style.html }}
            {...convertAttrToJsxStyle(style.attr)}
          ></style>
        ))}
      </head>
      <body {...convertAttrToJsxStyle(body.attr)}>
        {body.html ? parse(body.html) : null}
      </body>
    </html>
  );
};
