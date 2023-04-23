import { OnStart, Service } from "@flamework/core";
import { Debris, Players, ReplicatedStorage as Replicated, Workspace as World } from "@rbxts/services";
import { WeaponData } from "shared/types";
import { Events } from "server/network";
import PartCacheModule from "@rbxts/partcache";
import FastCast, { ActiveCast, Caster } from "@rbxts/fastcast";

const { floor, clamp } = math;

type Bullet = typeof Replicated.VFX.Bullet;

@Service({})
export class BulletService implements OnStart {
  private readonly playerCasters = new Map<number, Caster>();
  private readonly bulletCache = new PartCacheModule<Bullet>(Replicated.VFX.Bullet, 50);

  public onStart(): void {
    Events.createBullet.connect((plr, origin, dir, weaponData) => this.create(plr, origin, dir, weaponData));

    // FastCast.VisualizeCasts = true;
    this.bulletCache.SetCacheParent(World.Debris);
    Players.PlayerAdded.Connect(plr => this.playerCasters.set(plr.UserId, new FastCast()));
    Players.PlayerRemoving.Connect(plr => this.playerCasters.delete(plr.UserId));
  }

  /**
   * Returns a bullet in use by the part cache back into the cache
   */
  private resetBullet(bullet: Instance): void {
    if (bullet === undefined || !bullet.IsA("BasePart")) return;
    if (!bullet.GetAttribute("InUse")) return;

    bullet.SetAttribute("InUse", false);
    bullet.SetAttribute("LastHit", undefined);
    bullet.AssemblyLinearVelocity = new Vector3;
    this.bulletCache.ReturnPart(bullet as Bullet);
  }

  /**
   * Create container part
   * 
   * @returns Container
   */
  private createContainer(): Part {
    const container = new Instance("Part");
    container.Transparency = 1;
    container.Size = new Vector3(.1, .1, .1);
    container.CanCollide = false;
    container.Anchored = true;
    container.Parent = World.Debris;
    return container;
  }

  /**
   * Get bullet hole texture ID based on material
   * 
   * @param material Material
   * @returns Texture ID
   */
  private getBulletHoleTexture(material: Enum.Material): string {
    switch (material.Name) {
      case "Wood":
      case "WoodPlanks":
        return "6552016340";

      case "Metal":
      case "CorrodedMetal":
      case "DiamondPlate":
        return "9827740725";

      default:
        return "1844445084";
    }
  }

  /**
   * Dampen bullet velocity
   * 
   * @param cast Active cast
   * @param material Material
   * @param segVelocity Segment velocity
   * @param depth Depth of hit part
   */
  private dampenVelocity(cast: ActiveCast, material: Enum.Material, segVelocity: Vector3, depth: number): void {
    let velocityDamp: number;
    switch (material.Name) {
      case "Metal":
      case "DiamondPlate":
        velocityDamp = 1.55;
        break;

      case "CorrodedMetal":
      case "Concrete":
      case "Basalt":
      case "Brick":
      case "Cobblestone":
      case "Marble":
      case "Slate":
      case "Rock":
      case "Salt":
      case "Pebble":
      case "Pavement":
        velocityDamp = 1.4;
        break;

      case "Glass":
      case "ForceField":
      case "Ice":
        velocityDamp = 1.05;
        break;

      default:
        velocityDamp = 1.15;
        break;
    }
    cast.SetVelocity(segVelocity.div(velocityDamp * (depth / 1.25)));
  }

  /**
   * Create blood effect
   * 
   * @param origin Position
   * @param normal Normal direction
   */
  private createBloodVFX(origin: Vector3, normal: Vector3): void {
    const fixedNormal = new Vector3(clamp(normal.X, 0, 1), clamp(normal.Y, 0, 1), clamp(normal.Z, 0, 1));
    const bloodContainer = this.createContainer();
    bloodContainer.Name = "Blood"
    bloodContainer.CFrame = new CFrame(origin, origin.add(fixedNormal));

    const attachment = new Instance("Attachment");
    const blood = Replicated.VFX.Blood.Clone();
    blood.Parent = attachment;
    attachment.Parent = bloodContainer;

    task.delay(.2, () => {
      blood.Enabled = false;
      Debris.AddItem(blood, 1);
    });
  }

  /**
   * Create bullet impact VFX
   * 
   * @param origin Position
   * @param normal Normal direction
   * @param material Material
   * @param color Color
   */
  private createImpactVFX(origin: Vector3, normal: Vector3, material: Enum.Material, color: Color3): void {
    const fixedNormal = new Vector3(clamp(normal.X, 0, 1), clamp(normal.Y, 0, 1), clamp(normal.Z, 0, 1));
    const dustContainer = this.createContainer();
    dustContainer.Name = "Dust"
    dustContainer.CFrame = new CFrame(origin, origin.add(fixedNormal));

    const dust = <Folder>Replicated.VFX.BulletImpacts.FindFirstChild(material.Name) ?? Replicated.VFX.BulletImpacts.Default;
    for (let particle of <ParticleEmitter[]>dust.GetChildren()) {
      particle = particle.Clone()
      if (particle.Name === "Smoke") {
        const damp = 1.1;
        const dampenedColor = new Color3(color.R / damp, color.G / damp, color.B / damp);
        particle.Color = new ColorSequence(dampenedColor);
      }

      particle.Parent = dustContainer;
      task.delay(.2, () => particle.Enabled = false);
    }

    const holeContainer = this.createContainer();
    holeContainer.Name = "BulletHole";

    const z = .5, size = .35;
    if (fixedNormal.X !== 0)
      holeContainer.Size = new Vector3(z, size, size);
    else if (fixedNormal.Y !== 0)
      holeContainer.Size = new Vector3(size, size, z);
    else
      holeContainer.Size = new Vector3(size, z, size);

    holeContainer.CFrame = new CFrame(origin, origin.add(fixedNormal));

    const holeFront = new Instance("Decal");
    holeFront.Face = Enum.NormalId.Front;
    holeFront.Texture = "rbxassetid://" + this.getBulletHoleTexture(material);
    holeFront.Color3 = color;
    holeFront.Parent = holeContainer;

    const holeBack = holeFront.Clone();
    holeBack.Face = Enum.NormalId.Back;
    holeBack.Parent = holeContainer;

    const cleanup = () => {
      dustContainer.Destroy();
      holeContainer.Destroy();
    }

    task.delay(5, cleanup);
  }

  /**
   * Check whether an instance has a humanoid
   * 
   * @param instance Instance to check
   * @returns Whether or not the instance has a humanoid
   */
  private hasHumanoid(instance: Instance): boolean {
    return instance.FindFirstAncestorOfClass("Model")?.FindFirstChildOfClass("Humanoid") !== undefined;
  }

  /**
   * Get the victim character (hitPart's first ancestor that is a model)
   * 
   * @param hitPart The part that was hit
   * @returns The first ancestor that is a Model
   */
  private getVictim(hitPart: Instance): Model | undefined {
    return hitPart.FindFirstAncestorOfClass("Model");
  }

  /**
   * Calculate the damage to deal to the player based on bullet position
   * 
   * @param origin Position
   * @param bulletPos Bullet position
   * @param damageThreshold Damage thresholds 
   * @param rangeThreshold Range thresholds
   * @returns Damage to deal
   */
  private calculateDamage(origin: Vector3, bulletPos: Vector3, [dmg1, dmg2]: [number, number], [range1, range2]: [number, number]) {
    const dist = origin.sub(bulletPos).Magnitude;
    const distDiff = math.min(dist - range1, 0);
    const damp = 1 + (distDiff / 100);
    let damage = dmg1;
    if (dist > range1)
      damage = dmg1 / damp;
    if (dist > range2)
      damage = dmg2 / damp;

    return math.round(damage);
  }

  /**
   * Process the hits on the player
   * 
   * @param attacker Attacking player
   * @param victimCharacter Victim character model
   * @param hitPart Hit part
   * @param bullet Bullet
   * @param origin Position
   * @param weaponData Weapon data
   */
  private renderHit(attacker: Player, victimCharacter: Model, hitPart: BasePart, bullet: Bullet, origin: Vector3, weaponData: WeaponData): void {
    const victimHumanoid = victimCharacter?.FindFirstChildOfClass("Humanoid");
    if (victimHumanoid && victimHumanoid.Health > 0) {
      let bodyMult = 1;
      switch (hitPart.Name) {
        case "Head":
          bodyMult = weaponData.stats.bodyMultiplier.head;
          break;

        case "UpperTorso":
        case "LowerTorso":
        case "HumanoidRootPart":
          bodyMult = weaponData.stats.bodyMultiplier.torso;
          break;

        default:
          bodyMult = weaponData.stats.bodyMultiplier.limbs;
          break;
      }

      if (bullet.GetAttribute("LastHit") === victimCharacter.Name) return;
      bullet.SetAttribute("LastHit", victimCharacter.Name);

      const damage = this.calculateDamage(origin, bullet.Position, weaponData.stats.damage, weaponData.stats.range);
      victimHumanoid.TakeDamage(damage * bodyMult);
    }
  }

  /**
   * Create bullet
   * 
   * @param player Player
   * @param origin Position
   * @param dir Direction
   * @param weaponData Weapon data
   * @returns Bullet cast
   */
  private create(player: Player, origin: Vector3, dir: Vector3, weaponData: WeaponData): ActiveCast | undefined {
    const caster = this.playerCasters.get(player.UserId)!;
    const lengthChange = caster.LengthChanged.Connect((_, lastPoint, dir, displacement, segVelocity, bullet) => {
      if (bullet === undefined || !bullet.IsA("BasePart")) return;

      const currentPoint = lastPoint.add(dir.mul(displacement));
      bullet.Position = currentPoint;
    });

    const rayParams = new RaycastParams;
    rayParams.FilterDescendantsInstances = [World.CurrentCamera!, player.Character!, player.Character!.PrimaryPart!];
    rayParams.FilterType = Enum.RaycastFilterType.Blacklist;

    const behavior = FastCast.newBehavior();
    behavior.Acceleration = new Vector3(0, -World.Gravity, 0);
    behavior.CosmeticBulletProvider = this.bulletCache;
    behavior.CosmeticBulletContainer = World.Debris;
    behavior.RaycastParams = rayParams;
    behavior.AutoIgnoreContainer = true;
    behavior.MaxDistance = 1000;
    behavior.CanPierceFunction = (_, rayResult, segVelocity) => {
      if (rayResult.Instance.Transparency === 1 && !rayResult.Instance.FindFirstAncestorOfClass("Model")?.FindFirstChildOfClass("Humanoid")) return false;
      if (rayResult.Instance.GetAttribute("Impenetrable")) return false;
      if (segVelocity.Magnitude < 300) return false;
      return true;
    }

    const cast = caster.Fire(origin.add(new Vector3(0, .05, 0)), dir, weaponData.stats.muzzleVelocity, behavior);
    const bullet = cast.RayInfo.CosmeticBulletObject!;
    bullet.SetAttribute("InUse", true);
    const hit = caster.RayHit.Connect((_, { Instance, Position, Normal, Material }) => {
      if (!bullet.GetAttribute("InUse")) return;
      if (this.hasHumanoid(Instance)) {
        this.renderHit(player, this.getVictim(Instance)!, Instance, bullet as Bullet, origin, weaponData);
        this.createBloodVFX(Position, Normal);
      } else
        this.createImpactVFX(Position, Normal, Material, Instance.Color);

      this.resetBullet(bullet);
    });
    const pierced = caster.RayPierced.Connect((cast, { Instance, Position, Normal, Material }, segVelocity, _) => {
      if (!bullet.GetAttribute("InUse")) return;
      if (this.hasHumanoid(Instance)) {
        this.renderHit(player, this.getVictim(Instance)!, Instance, bullet as Bullet, origin, weaponData);
        this.createBloodVFX(Position, Normal);
        this.createBloodVFX(Position, Normal.mul(-1));
      } else {
        this.createImpactVFX(Position, Normal, Material, Instance.Color);
        this.createImpactVFX(Position, Normal.mul(-1), Material, Instance.Color);
      }

      let size: number;
      if (floor(Normal.X) !== 0)
        size = Instance.Size.X;
      else if (floor(Normal.Y) !== 0)
        size = Instance.Size.Y;
      else
        size = Instance.Size.Z;

      this.dampenVelocity(cast, Material, segVelocity, size);
    });
    task.delay(6, () => {
      hit.Disconnect();
      pierced.Disconnect();
      lengthChange.Disconnect();
      if (bullet.GetAttribute("InUse"))
        this.resetBullet(bullet);
    });
    return cast;
  }
}
