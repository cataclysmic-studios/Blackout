import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Janitor } from "@rbxts/janitor";
import { FPS } from "client/controllers/FPS";

interface Attributes {}

interface AmmoUI extends Frame {
    Weapon: ImageLabel;
    Mag: TextLabel;
    Reserve: TextLabel;
}

@Component({ tag: "AmmoHUD" })
export class AmmoHUD extends BaseComponent<Attributes, AmmoUI> implements OnStart {
    private readonly janitor = new Janitor;

    public constructor(
        private readonly fps: FPS
    ) {
        super();
    }

    // Cleanup events
    public destroy(): void {
        this.janitor.Cleanup();
    }

    // Connect update events
    public onStart(): void {
        this.janitor.Add(this.fps.events.ammoChanged.Connect(ammo => {
            this.instance.Mag.Text = tostring(ammo.mag);
            this.instance.Reserve.Text = tostring(ammo.reserve);
        }));
    }
}