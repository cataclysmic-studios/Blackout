import { Controller, OnInit } from "@flamework/core";
import { SoundService } from "@rbxts/services";

@Controller({})
export class SoundController implements OnInit {
    private readonly registered = new Map<string, number[]>();

    private register(name: string, ids: number[]): void {
        this.registered.set(name, ids);
    }

    // Register all library sounds
    public onInit(): void {
        this.register("SmallShell", []);
    }

    // Clone a sound, play it, then destroy it 
    public clone(sound: Sound, chosenParent?: Instance): void {
        const parent = sound.Parent;
        sound = sound.Clone();
        sound.Parent = chosenParent ?? parent;
        sound.Stopped.Once(() => sound.Destroy());
        sound.Play();
    }

    // Play a sound from the sound library
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