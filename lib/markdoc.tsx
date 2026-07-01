import * as React from 'react';
import Markdoc, {
  type Node,
  type RenderableTreeNode,
  type Config,
} from '@markdoc/markdoc';

export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function textContent(children: RenderableTreeNode[]): string {
  let out = '';
  for (const child of children) {
    if (typeof child === 'string') out += child;
    else if (child && typeof child === 'object' && 'children' in child) {
      out += textContent((child.children ?? []) as RenderableTreeNode[]);
    }
  }
  return out;
}

const headingNode = {
  ...Markdoc.nodes.heading,
  transform(node: Node, config: Config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);
    const level = (node.attributes.level as number) || 2;
    const id = slugify(textContent(children));
    return new Markdoc.Tag(`h${level}`, { ...attributes, id }, children);
  },
};

const markdocConfig: Config = {
  nodes: {
    heading: headingNode,
  },
};

export function renderMarkdoc(node: Node): React.ReactNode {
  const tree = Markdoc.transform(node, markdocConfig);
  return Markdoc.renderers.react(tree, React);
}

export type TocItem = { id: string; text: string };

/** Extract level-2 headings from a Markdoc document node for a table of contents. */
export function extractToc(node: Node): TocItem[] {
  const items: TocItem[] = [];
  function walk(n: Node) {
    if (n.type === 'heading' && n.attributes.level === 2) {
      const text = collectAstText(n);
      items.push({ id: slugify(text), text });
    }
    for (const child of n.children ?? []) walk(child);
  }
  walk(node);
  return items;
}

function collectAstText(node: Node): string {
  let out = '';
  if (node.type === 'text' && typeof node.attributes?.content === 'string') {
    out += node.attributes.content;
  }
  for (const child of node.children ?? []) out += collectAstText(child);
  return out;
}
