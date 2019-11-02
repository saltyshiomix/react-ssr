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

export const getCurrentMarkupComponent = () => {
  if (root) {
    return parse(markup);
  }

  const $ = cheerio.load(markup);
  const title = $('head > title').html();
  const metas = [];
  $('head meta').each((i, el) => {
    const $el = $(el);
    metas.push({
      attr: $el.attr(),
    });
  });
  const styles = [];
  $('head style').each((i, el) => {
    const $el = $(el);
    styles.push({
      html: $el.html(),
      attr: $el.attr(),
    });
  });
  const body = $('body').html();

  console.log(title);
  console.log(metas);
  console.log(styles);

  return (
    <html {...convertAttrToJsxStyle($('html').attr())}>
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
      <body {...convertAttrToJsxStyle($('body').attr())}>
        {body ? parse(body) : null}
      </body>
    </html>
  );
};
