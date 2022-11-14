import { Controller } from "@flamework/core";
import { SoundService } from "@rbxts/services";

@Controller({})
export class SoundPlayer {
    private readonly registered = {
        MetalShell: [7836829426, 7836830697, 7836831993, 7836831369, 7836831778, 7836831025]
    };

    // Clone a sound, play it, then destroy it 
    public clone(sound: Sound, chosenParent?: Instance): void {
        const parent = sound.Parent;
        sound = sound.Clone();
        sound.Parent = chosenParent ?? parent;
        sound.Stopped.Once(() => sound.Destroy());
        sound.Play();
    }

    // Play a sound from the sound library
    public play(name: keyof typeof this.registered, parent: Instance = SoundService, onFinished: Callback): void {
        const ids = this.registered[name];
        assert(ids, `"${name}" is not a valid sound.`);

        const sound = new Instance("Sound");
        sound.SoundId = "rbxassetid://" + tostring(ids[(new Random).NextInteger(0, ids.size() - 1)]);
        switch(name) {
            case "MetalShell":
                sound.Volume = .25;
                break;
        }

        sound.Parent = parent;
        sound.Ended.Once(() => {
            sound.Destroy();
            onFinished();
        });
        sound.Play();
    }
}