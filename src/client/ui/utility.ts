import { Children, Element, PropsWithChildren } from "@rbxts/roact";

export function getChildren<P = {}>(props: PropsWithChildren<P>): Element[] {
  const childrenMap = props[Children];
  const children: Element[] = [];
  childrenMap?.forEach(e => children.push(e));
  return children;
}