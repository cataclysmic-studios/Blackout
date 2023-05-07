import { OnStart, Service } from "@flamework/core";
import {
  CollectionService,
  ReplicatedStorage,
  Workspace,
} from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";
import { Events } from "server/network";
import {
  OnPlayerAdded,
  OnPlayerRemoving,
} from "shared/meta/player-lifecycle-hooks";
import { WeaponData } from "shared/interfaces/game-types";
import { Tag } from "shared/enums";
import FastCast, { ActiveCast, Caster } from "@rbxts/fastcast";

type Bullet = typeof ReplicatedStorage.VFX.Bullet;

const bulletFolder = new Instance("Folder");
bulletFolder.Name = "Bullets";
bulletFolder.Parent = Workspace;

const fastCastBehavior = FastCast.newBehavior();
fastCastBehavior.Acceleration = new Vector3(0, -Workspace.Gravity, 0);
fastCastBehavior.CosmeticBulletTemplate = ReplicatedStorage.VFX.Bullet;
fastCastBehavior.CosmeticBulletContainer = bulletFolder;
fastCastBehavior.AutoIgnoreContainer = true;
fastCastBehavior.CanPierceFunction = (cast, result, segmentVelocity) => {
  const part = result.Instance;
  if (part === undefined) return false;

  return CollectionService.HasTag(part, Tag.Penetratable);
};

@Service({})
export class BulletService implements OnStart, OnPlayerAdded, OnPlayerRemoving {
  private playerCasters = new Map<Player, Caster>();
  private playerCasterJanitors = new Map<Player, Janitor>();
  private playerJanitors = new Map<Player, Janitor>();

  public onStart(): void {
    Events.createBullet.connect((player, origin, direction, weaponData) => {
      this.createBullet(player, origin, direction, weaponData);
    });
  }

  public onPlayerAdded(player: Player): void {
    const caster = new FastCast();
    const playerJanitor = new Janitor();
    const casterJanitor = new Janitor(); // Janitor to cleanup caster's stuff on CastTerminating

    playerJanitor.Add(casterJanitor);
    playerJanitor.Add(
      caster.LengthChanged.Connect(
        (
          caster,
          lastPoint,
          rayDir,
          displacement,
          segmentVelocity,
          cosmeticBulletObject
        ) =>
          this.playerRayLengthChanged(
            player,
            caster,
            lastPoint,
            rayDir,
            displacement,
            segmentVelocity,
            cosmeticBulletObject
          )
      ),
      "Disconnect"
    );

    playerJanitor.Add(
      caster.RayHit.Connect(
        (caster, result, segmentVelocity, cosmeticBulletObject) =>
          this.playerRayHit(
            player,
            caster,
            result,
            segmentVelocity,
            cosmeticBulletObject
          )
      ),
      "Disconnect"
    );

    playerJanitor.Add(
      caster.RayPierced.Connect(
        (caster, result, segmentVelocity, cosmeticBulletObject) =>
          this.playerRayPierced(
            player,
            caster,
            result,
            segmentVelocity,
            cosmeticBulletObject
          )
      ),
      "Disconnect"
    );

    playerJanitor.Add(
      caster.CastTerminating.Connect(() => {
        casterJanitor.Cleanup();
      }),
      "Disconnect"
    );

    this.playerCasters.set(player, caster);
    this.playerCasterJanitors.set(player, casterJanitor);
    this.playerJanitors.set(player, playerJanitor);
  }

  public onPlayerRemoving(player: Player): void {
    const janitor = this.playerJanitors.get(player);
    if (janitor === undefined) return;

    janitor.Destroy();
  }

  private createBullet(
    player: Player,
    origin: Vector3,
    direction: Vector3,
    weaponData: WeaponData
  ): Maybe<ActiveCast> {
    const caster = this.playerCasters.get(player);
    if (caster === undefined) return undefined;

    const raycastParams = new RaycastParams();
    raycastParams.FilterDescendantsInstances = [player.Character!];
    raycastParams.FilterType = Enum.RaycastFilterType.Exclude;

    fastCastBehavior.RaycastParams = raycastParams;

    return caster.Fire(
      origin,
      direction,
      weaponData.stats.muzzleVelocity,
      fastCastBehavior
    );
  }

  private playerRayLengthChanged(
    player: Player,
    casterThatFired: ActiveCast,
    lastPoint: Vector3,
    rayDir: Vector3,
    displacement: number,
    segmentVelocity: Vector3,
    cosmeticBulletObject?: Instance
  ): void {
    if (
      cosmeticBulletObject === undefined ||
      !cosmeticBulletObject.IsA("BasePart")
    )
      return;

    const currentPoint = lastPoint.add(rayDir.mul(displacement));
    cosmeticBulletObject.Position = currentPoint;
  }

  private playerRayHit(
    player: Player,
    casterThatFired: ActiveCast,
    result: RaycastResult,
    segmentVelocity: Vector3,
    cosmeticBulletObject?: Instance
  ): void {
    if (
      cosmeticBulletObject === undefined ||
      !cosmeticBulletObject.IsA("BasePart")
    )
      return;

    const characterModel = result.Instance.FindFirstAncestorOfClass("Model");
    if (characterModel === undefined) return;

    const humanoid = characterModel.FindFirstChildOfClass("Humanoid");
    if (humanoid === undefined) return; // TODO: Add effect to non-humanoid characters

    humanoid.Health -= 10; // TODO: Calculate damage
  }

  private playerRayPierced(
    player: Player,
    casterThatFired: ActiveCast,
    result: RaycastResult,
    segmentVelocity: Vector3,
    cosmeticBulletObject?: Instance
  ): void {}
}
