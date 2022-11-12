import { Controller, OnInit } from "@flamework/core";
import { SoundService } from "@rbxts/services";

@Controller({})
export class SoundController implements OnInit {
    private readonly registered = new Map<string, number[]>();

    public onInit(): void {
        this.register("SmallShell", []);
    }

    public register(name: string, ids: number[]): void {
        this.registered.set(name, ids);
    }

    public clone(sound: Sound): void {
        const parent = sound.Parent;
        sound = sound.Clone();
        sound.Parent = parent;
        sound.Stopped.Once(() => sound.Destroy());
        sound.Play();
    }

    public play(name: string, parent: Instance = SoundService): void {
        const id = this.registered.get(name);
        assert(id, `"${name}" is not a valid sound.`);

        const sound = new Instance("Sound");
        sound.SoundId = tostring(id[(new Random).NextInteger(0, id.size() - 1)]);
        sound.Parent = parent;

        sound.Stopped.Once(() => sound.Destroy());
        sound.Play();
    }
}