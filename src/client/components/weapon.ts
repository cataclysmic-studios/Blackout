import { Dependency, OnStart } from "@flamework/core";
import { Component, BaseComponent, Components } from "@flamework/components";
import { WeaponModel } from "shared/interfaces/game-types";
import GunEffects from "./gun-effects";

interface Attributes { }

@Component()
export class Weapon extends BaseComponent<Attributes, WeaponModel> implements OnStart {
  private vfx?: GunEffects;

  public onStart(): void {
    const components = Dependency<Components>();
    this.vfx = components.addComponent<GunEffects>(this.instance);
  }
}