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
  const style = $('head > style').html();
  const body = $('body').html();

  console.log(title);

  return (
    <html {...convertAttrToJsxStyle($('html').attr())}>
      <head>
        {parse($.html($('head meta')))}
        {title ? <title>{title}</title> : null}
        {style ? <style dangerouslySetInnerHTML={{ __html: style }}></style> : null}
      </head>
      <body {...convertAttrToJsxStyle($('body').attr())}>
        {body ? parse(body) : null}
      </body>
    </html>
  );
};
