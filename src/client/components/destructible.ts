import { Component, BaseComponent } from "@flamework/components";

interface Attributes { }

@Component({ tag: "Destructible" })
export class Destructible extends BaseComponent<Attributes, BasePart> {
  public replicateBulletHole(): void {

  }
}