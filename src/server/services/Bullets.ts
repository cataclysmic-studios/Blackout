import { OnStart, Service } from "@flamework/core";
import { Debris, Players, ReplicatedStorage as Replicated, Workspace as World } from "@rbxts/services";
import { Events } from "server/network";
import { PartCache } from "@rbxts/partcache/out/class";
import PartCacheModule from "@rbxts/partcache";
import FastCast, { ActiveCast, Caster } from "@rbxts/fastcast";
import { WeaponData } from "shared/modules/Types";

const { floor, clamp } = math;

@Service({})
export class Bullets implements OnStart {
    private readonly playerCasters = new Map<number, Caster>();
    private bulletCache?: PartCache;

    public onStart(): void {
        Events.createBullet.connect((plr, origin, dir, weaponData) => this.create(plr, origin, dir, weaponData));

        this.bulletCache = new PartCacheModule(Replicated.VFX.Bullet, 30);
        this.bulletCache.SetCacheParent(World.Debris);

        // FastCast.VisualizeCasts = true;
        Players.PlayerAdded.Connect(plr => this.playerCasters.set(plr.UserId, new FastCast));
        Players.PlayerRemoving.Connect(plr => this.playerCasters.delete(plr.UserId));
    }

    private resetBullet(bullet: Part): void {
        bullet.SetAttribute("LastHit", undefined);
        bullet.AssemblyLinearVelocity = new Vector3;
        this.bulletCache?.ReturnPart(bullet);
    }

    private createContainer(): Part {
        const container = new Instance("Part");
        container.Transparency = 1;
        container.Size = new Vector3(.1, .1, .1);
        container.CanCollide = false;
        container.Anchored = true;
        container.Parent = World.Debris;
        return container;
    }

    private getBulletHoleTexture(material: Enum.Material): string {
        switch(material.Name) {
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

    private dampenVelocity(cast: ActiveCast, material: Enum.Material, segVelocity: Vector3, size: number): void {
        let velocityDamp: number;
        switch(material.Name) {
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
                velocityDamp = 1.3;
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

        cast.SetVelocity(segVelocity.div(velocityDamp * (size / 1.25)));
    }

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

    private hasHumanoid(instance: Instance): boolean {
        return instance.FindFirstAncestorOfClass("Model")?.FindFirstChildOfClass("Humanoid") !== undefined;
    }

    private getVictim(hitPart: Instance): Model | undefined {
        return hitPart.FindFirstAncestorOfClass("Model");
    }

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

    private renderHit(attacker: Player, victimCharacter: Model, hitPart: Instance, bullet: Instance, origin: Vector3, weaponData: WeaponData): void {
        const victimHumanoid = victimCharacter?.FindFirstChildOfClass("Humanoid");
        if (victimHumanoid && victimHumanoid.Health > 0) {
            let bodyMult = 1;
            switch(hitPart.Name) {
                case "Head":
                    bodyMult = weaponData.stats.bodyMultiplier.head;
                    break;

                case "UpperTorso":
                case "LowerTorso":
                    bodyMult = weaponData.stats.bodyMultiplier.torso;
                    break;

                default:
                    bodyMult = weaponData.stats.bodyMultiplier.limbs;
                    break;
            }

            if (bullet.GetAttribute("LastHit") === victimCharacter.Name) return;
            bullet.SetAttribute("LastHit", victimCharacter.Name);

            const damage = this.calculateDamage(origin, (<Part>bullet).Position, weaponData.stats.damage, weaponData.stats.range);
            print(damage);
            victimHumanoid.TakeDamage(damage);
        }
    }

    private create(player: Player, origin: Vector3, dir: Vector3, weaponData: WeaponData): ActiveCast | undefined {
        if (!this.bulletCache) return;

        const caster = this.playerCasters.get(player.UserId)!;
        let bulletInstance: Instance | undefined;

        const lengthChange = caster.LengthChanged.Connect((cast, lastPoint, dir, displacement, segVelocity, bullet) => {
            bulletInstance = bullet;
            const currentPoint = lastPoint.add(dir.mul(displacement));
            (<Part>bullet).Position = currentPoint;
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
        behavior.CanPierceFunction = function(cast, rayResult, segVelocity): boolean {
            if (rayResult.Instance.Transparency === 1 && !rayResult.Instance.FindFirstAncestorOfClass("Model")?.FindFirstChildOfClass("Humanoid")) return false;
            if (rayResult.Instance.GetAttribute("Impenetrable")) return false;
            if (segVelocity.Magnitude < 300) return false;

            return true;
        }

        const cast = caster.Fire(origin.add(new Vector3(0, .05, 0)), dir, weaponData.stats.muzzleVelocity, behavior);
        let hit: RBXScriptConnection;
        hit = caster.RayHit.Connect((cast, { Instance, Position, Normal, Material }, segVelocity, bullet) => {
            hit.Disconnect();

            if (!bullet?.GetAttribute("InUse")) return;
            if (this.hasHumanoid(Instance)) {
                this.renderHit(player, this.getVictim(Instance)!, bulletInstance!, Instance, origin, weaponData);
                this.createBloodVFX(Position, Normal);
            } else
                this.createImpactVFX(Position, Normal, Material, Instance.Color);

            this.resetBullet(<Part>bullet);
        });
        const pierced = caster.RayPierced.Connect((cast, { Instance, Position, Normal, Material }, segVelocity, bullet) => {
            if (!bullet?.GetAttribute("InUse")) return;
            if (this.hasHumanoid(Instance)) {
                this.renderHit(player, this.getVictim(Instance)!, bulletInstance!, Instance, origin, weaponData);
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
            if (bulletInstance?.GetAttribute("InUse"))
                this.resetBullet(<Part>bulletInstance);

            pierced.Disconnect();
            lengthChange.Disconnect();
        })
        return cast;
    }
}