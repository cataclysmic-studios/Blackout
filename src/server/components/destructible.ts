import { Component, BaseComponent } from "@flamework/components";
import { Events } from "server/network";

interface Attributes { }

@Component({ tag: "Destructible" })
export class Destructible extends BaseComponent<Attributes, BasePart> {
  public addBulletHole(hit: CFrame, bulletSize: Vector3): void {
    Events.replicateBulletHole.broadcast(hit, this.instance.Material, this.instance.Color, bulletSize);
  }
}