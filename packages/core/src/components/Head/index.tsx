import React from 'react';
import HeadManager from './manager';
import withSideEffect from './with-side-effect';

const defaultHead = [
  <meta key="charSet" charSet="utf-8" />,
  <meta
    key="viewport"
    name="viewport"
    content="width=device-width,minimum-scale=1,initial-scale=1"
  />,
];

function onlyReactElement(list: Array<React.ReactElement<any>>, child: React.ReactChild): Array<React.ReactElement<any>> {
  if (typeof child === 'string' || typeof child === 'number') {
    return list;
  }
  if (child.type === React.Fragment) {
    return list.concat(
      React.Children.toArray(child.props.children).reduce(
        (
          fragmentList: Array<React.ReactElement<any>>,
          fragmentChild: React.ReactChild
        ): Array<React.ReactElement<any>> => {
          if (typeof fragmentChild === 'string' || typeof fragmentChild === 'number') {
            return fragmentList;
          }
          return fragmentList.concat(fragmentChild);
        },
        [],
      ),
    );
  }
  return list.concat(child);
}

const METATYPES = [
  'name',
  'httpEquiv',
  'charSet',
  'itemProp',
];

function unique() {
  const keys = new Set();
  const tags = new Set();
  const metaTypes = new Set();
  const metaCategories: { [metatype: string]: Set<string> } = {};

  return (h: React.ReactElement<any>) => {
    if (h.key && typeof h.key !== 'number' && h.key.indexOf('.$') === 0) {
      if (keys.has(h.key)) {
        return false;
      }
      keys.add(h.key);
      return true;
    }

    if (keys.has(`.$${h.key}`)) {
      return false;
    }

    switch (h.type) {
      case 'title':
      case 'base':
        if (tags.has(h.type)) {
          return false;
        }
        tags.add(h.type);
        break;

      case 'meta':
        for (let i = 0, len = METATYPES.length; i < len; i++) {
          const metatype = METATYPES[i];
          if (!h.props.hasOwnProperty(metatype)) {
            continue;
          }
          if (metatype === 'charSet') {
            if (metaTypes.has(metatype)) {
              return false;
            }
            metaTypes.add(metatype);
          } else {
            const category = h.props[metatype];
            const categories = metaCategories[metatype] || new Set();
            if (categories.has(category)) {
              return false;
            }
            categories.add(category);
            metaCategories[metatype] = categories;
          }
        }
        break;
    }
    return true;
  }
}

function reduceComponents(headElements: Array<React.ReactElement<any>>) {
  return headElements
    .reduce(
      (list: React.ReactChild[], headElement: React.ReactElement<any>) => {
        const headElementChildren = React.Children.toArray(headElement.props.children)
        return list.concat(headElementChildren);
      },
      [],
    )
    .reduce(onlyReactElement, [])
    .reverse()
    .concat(defaultHead)
    .filter(unique())
    .reverse()
    .map((c: React.ReactElement<any>, i: number) => {
      const key = c.key || i;
      return React.cloneElement(c, { key });
    });
}

const Effect = withSideEffect();

class Head extends React.Component {
  render() {
    return (
      <Effect
        reduceComponentsToState={reduceComponents}
        handleStateChange={new HeadManager().updateHead}
      >
        {this.props.children}
      </Effect>
    );
  }
}

export default Head;
