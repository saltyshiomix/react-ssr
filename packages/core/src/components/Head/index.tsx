import React from 'react';
import withSideEffect from './with-side-effect';

const defaultHead = [
  <meta charSet="utf-8" />,
  <meta name="viewport" content="width=device-width" />,
];

function onlyReactElement(list: React.ReactElement<any>[], child: React.ReactChild): React.ReactElement<any>[] {
  if (typeof child === 'string' || typeof child === 'number') {
    return list;
  }
  if (child.type === React.Fragment) {
    return list.concat(
      (React.Children.toArray(child.props.children) as React.ReactChild[]).reduce(
        (
          fragmentList: React.ReactElement<any>[],
          fragmentChild: React.ReactChild,
        ): React.ReactElement<any>[] => {
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

const METATYPES = ['name', 'httpEquiv', 'charSet', 'itemProp'];

function unique() {
  const keys = new Set();
  const tags = new Set();
  const metaTypes = new Set();
  const metaCategories: { [metatype: string]: Set<string> } = {};

  return (h: React.ReactElement<any>) => {
    let unique = true;

    if (h.key && typeof h.key !== 'number' && h.key.indexOf('$') > 0) {
      const key = h.key.slice(h.key.indexOf('$') + 1);
      if (keys.has(key)) {
        unique = false;
      } else {
        keys.add(key);
      }
    }

    switch (h.type) {
      case 'title':
      case 'base':
        if (tags.has(h.type)) {
          unique = false;
        } else {
          tags.add(h.type);
        }
        break;

      case 'meta':
        for (let i = 0, len = METATYPES.length; i < len; i++) {
          const metatype = METATYPES[i];
          if (!h.props.hasOwnProperty(metatype)) continue;

          if (metatype === 'charSet') {
            if (metaTypes.has(metatype)) {
              unique = false;
            } else {
              metaTypes.add(metatype);
            }
          } else {
            const category = h.props[metatype];
            const categories = metaCategories[metatype] || new Set();
            if (categories.has(category)) {
              unique = false;
            } else {
              categories.add(category);
              metaCategories[metatype] = categories;
            }
          }
        }
        break;
    }

    return unique;
  }
}

function reduceComponents(headElements: Array<React.ReactElement<any>>) {
  return headElements
    .reduce(
      (list: React.ReactChild[], headElement: React.ReactElement<any>) => {
        const headElementChildren = React.Children.toArray(headElement.props.children) as React.ReactChild[];
        return list.concat(headElementChildren)
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

function Head({ children }: { children: React.ReactNode }) {
  return (
    <Effect reduceComponentsToState={reduceComponents}>
      {children}
    </Effect>
  );
}

Head.rewind = Effect.rewind;

export default Head;
