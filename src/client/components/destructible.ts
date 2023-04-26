import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Events } from "client/network";

interface Attributes { }

@Component({ tag: "Destructible" })
export class Destructible extends BaseComponent<Attributes, BasePart> implements OnStart {
  public onStart(): void {
    Events.replicateBulletHole.connect((hit, bulletSize) => this.replicateBulletHole(hit, bulletSize));
  }

  private replicateBulletHole(hit: CFrame, bulletSize: Vector3): void {
    const negative = new Instance("NegateOperation");
    negative.CFrame = hit;
    negative.Size = bulletSize.mul(2);
    this.instance.UnionAsync([negative], Enum.CollisionFidelity.Hull);
  }
}