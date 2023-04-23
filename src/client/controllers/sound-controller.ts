import { Controller } from "@flamework/core";
import { SoundService } from "@rbxts/services";

const soundIDs = {
	MetalShell: [7836829426, 7836830697, 7836831993, 7836831369, 7836831778, 7836831025]
};

@Controller()
export class SoundController {
	/**
	 * Clone a sound, play it, then destroy it
	 * @param sound Sound
	 * @param chosenParent Instance to parent the sound to
	 */
	public clone(sound: Sound, chosenParent?: Instance): void {
		const parent = sound.Parent;
		sound = sound.Clone();
		sound.Parent = chosenParent ?? parent;
		sound.Stopped.Once(() => sound.Destroy());
		sound.Play();
	}

	/**
	 * Play a sound from the sound library
	 * 
	 * @param name Sound name
	 * @param parent Instance to parent the sound to
	 * @param onFinished Callback function to run when the sound ends
	 */
	public play(name: keyof typeof soundIDs, parent: Instance = SoundService, onFinished: Callback): void {
		const ids = soundIDs[name];
		assert(ids, `"${name}" is not a valid sound.`);

		const sound = new Instance("Sound");
		sound.SoundId = "rbxassetid://" + tostring(ids[(new Random).NextInteger(0, ids.size() - 1)]);
		switch (name) {
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
