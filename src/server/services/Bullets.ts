import { OnStart, Service } from "@flamework/core";
import { Players, ReplicatedStorage as Replicated, Workspace, Workspace as World } from "@rbxts/services";
import { Events } from "server/network";
import FastCast, { ActiveCast, Caster } from "@rbxts/fastcast";
import PartCacheModule from "@rbxts/partcache";
import { PartCache } from "@rbxts/partcache/out/class";

@Service({})
export class Bullets implements OnStart {
    private readonly playerCasters = new Map<number, Caster>();
    private bulletCache?: PartCache;

    public onStart(): void {
        Events.createBullet.connect((plr, origin, dir, velocity) => this.create(plr, origin, dir, velocity));

        this.bulletCache = new PartCacheModule(Replicated.VFX.Bullet, 10);
        this.bulletCache.SetCacheParent(World.Debris);

        // FastCast.VisualizeCasts = true;
        Players.PlayerAdded.Connect(plr => this.playerCasters.set(plr.UserId, new FastCast));
        Players.PlayerRemoving.Connect(plr => this.playerCasters.delete(plr.UserId));
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

    private createImpactVFX(origin: Vector3, normal: Vector3, material: Enum.Material): void {
        const dustContainer = this.createContainer();
        dustContainer.CFrame = new CFrame(origin, normal);

        let dust = <Folder>Replicated.VFX.BulletImpacts.FindFirstChild(material.Name);
        if (!dust)
            dust = Replicated.VFX.BulletImpacts.Default;
            
        for (let particle of <ParticleEmitter[]>dust.GetChildren()) {
            particle = particle.Clone()
            particle.Parent = dustContainer;
            task.delay(.2, () => particle.Enabled = false);
        }

        task.delay(4, () => dustContainer.Destroy());
    }

    private dampenVelocity(cast: ActiveCast, material: Enum.Material, bullet: Part): void {
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

        cast.AddVelocity((<Part>bullet).CFrame.LookVector.div(velocityDamp));
    }

    private create(player: Player, origin: Vector3, dir: Vector3, velocity: number): ActiveCast | undefined {
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

            const timesPierced = <number>bulletInstance?.GetAttribute("TimesPierced") ?? 0;
            if (timesPierced > 8) return false;

            bulletInstance?.SetAttribute("TimesPierced", timesPierced + 1);
            return true;
        }

        const cast = caster.Fire(origin.add(new Vector3(0, .05, 0)), dir, velocity, behavior);
        let hit: RBXScriptConnection;
        hit = caster.RayHit.Connect((cast, { Instance, Position, Normal, Material }, segVelocity, bullet) => {
            print(Instance)
            hit.Disconnect();

            if (!bullet?.GetAttribute("InUse")) return;
            this.createImpactVFX(Position, Normal, Material);
            this.bulletCache?.ReturnPart(<Part>bullet);
        });
        const pierced = caster.RayPierced.Connect((cast, { Position, Normal, Material }, segVelocity, bullet) => {
            if (!bullet?.GetAttribute("InUse")) return;
            this.createImpactVFX(Position, Normal.mul(-1), Material);
            this.dampenVelocity(cast, Material, <Part>bullet);
        });
        task.delay(6, () => {
            if (bulletInstance?.GetAttribute("InUse")) {
                bulletInstance.SetAttribute("TimesPierced", undefined);
                this.bulletCache?.ReturnPart(<Part>bulletInstance);
            }
            pierced.Disconnect();
            lengthChange.Disconnect();
        })
        return cast;
    }
}