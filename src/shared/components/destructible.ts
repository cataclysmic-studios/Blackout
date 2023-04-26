import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

interface Attributes { }

@Component({ tag: "Destructible" })
export class Destructible extends BaseComponent<Attributes, BasePart> implements OnStart {
  public onStart(): void {

  }
}