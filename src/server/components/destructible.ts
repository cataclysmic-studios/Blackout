import { Component, BaseComponent } from "@flamework/components";
import { Events } from "server/network";

interface Attributes { }

@Component({ tag: "Destructible" })
export class Destructible extends BaseComponent<Attributes, BasePart> {
  public addBulletHole(hit: CFrame, bulletSize: Vector3): void {
    const negative = new Instance("NegateOperation");
    negative.CFrame = hit;
    negative.Size = bulletSize.mul(2);
    this.instance.UnionAsync([negative], Enum.CollisionFidelity.Hull);
  }
}