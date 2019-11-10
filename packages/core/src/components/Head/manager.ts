const DOMAttributeNames: any = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv',
}

const isServer = typeof window === 'undefined';

export default class HeadManager {
  private updatePromise: Promise<any> | undefined;

  constructor () {
    this.updatePromise = undefined;
  }

  updateHead = (head: any) => {
    const promise = (this.updatePromise = Promise.resolve().then(() => {
      if (isServer || promise !== this.updatePromise) {
        return;
      }
      this.updatePromise = undefined;
      this.doUpdateHead(head);
    }));
  }

  doUpdateHead(head: any) {
    const tags: any = {};
    head.forEach((h: any) => {
      const components = tags[h.type] || [];
      components.push(h);
      tags[h.type] = components;
    });

    this.updateTitle(tags.title ? tags.title[0] : null);

    const types = ['meta', 'base', 'link', 'style', 'script'];
    types.forEach(type => {
      this.updateElements(type, tags[type] || []);
    });
  }

  updateTitle(component: any) {
    let title = '';
    if (component) {
      const { children } = component.props;
      title = typeof children === 'string' ? children : children.join('');
    }
    if (title !== document.title) {
      document.title = title;
    }
  }

  updateElements(type: string, components: any[]) {
    const headEl = document.getElementsByTagName('head')[0];
    const childNodes = Array.from(headEl.childNodes);

    const oldNodes: ChildNode[] = [];
    for (let i = 0; i < childNodes.length; i++) {
      const n = childNodes[i];
      if (n.nodeName.toLowerCase() === type) {
        oldNodes.push(n);
      }
    }

    const newNodes = components.map(reactElementToDOM).filter(newNode => {
      for (let i = 0, len = oldNodes.length; i < len; i++) {
        const oldNode = oldNodes[i];
        if (oldNode.isEqualNode(newNode)) {
          oldNodes.splice(i, 1);
          return false;
        }
      }
      return true;
    });

    oldNodes.forEach(n => n.parentNode!.removeChild(n));
    newNodes.forEach(n => headEl.appendChild(n));
  }
}

function reactElementToDOM({ type, props }: { type: string, props: any }) {
  const el = document.createElement(type);
  for (const p in props) {
    if (!props.hasOwnProperty(p)) {
      continue;
    }
    if (p === 'children' || p === 'dangerouslySetInnerHTML') {
      continue;
    }
    const attr = DOMAttributeNames[p] || p.toLowerCase();
    el.setAttribute(attr, props[p]);
  }

  const { children, dangerouslySetInnerHTML } = props;
  if (dangerouslySetInnerHTML) {
    el.innerHTML = dangerouslySetInnerHTML.__html || '';
  } else if (children) {
    el.textContent = typeof children === 'string' ? children : children.join('');
  }
  return el;
}
