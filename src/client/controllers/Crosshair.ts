import { Controller } from "@flamework/core";
import { UserInputService as UIS } from "@rbxts/services";
import { UI } from "./UI";
import { WaitFor } from "shared/modules/utility/WaitFor";
import { WeaponData } from "client/classes/WeaponData";
import Tween from "shared/modules/utility/Tween";

@Controller({})
export class Crosshair {
    private enabled = false;
    private size = 1;
    private tweenSpeed = .1;

    public maxSize = 10;

    public constructor(
        private readonly ui: UI
    ) {}

    // Add onto current size
    public addSize(value: number): Tween {
        this.size += value;
        return this.update();
    }

    // Set size
    public setSize(value: number): Tween {
        this.size = value;
        return this.update();
    }

    // Increase size for a short period of time
    public pulse({ crossExpansion }: WeaponData): void {
        const inc = crossExpansion.shoot;
        this.addSize(inc);
        task.delay(this.tweenSpeed * 1.3, () => this.addSize(-inc));
    }

    // Tween crosshair size
    public update(): Tween {
        this.size = math.clamp(this.size, 0, this.maxSize);

        const hud = this.ui.getScreen("HUD");
        const frame = WaitFor<Frame>(hud, "Crosshair");
        const info = new TweenInfo(this.tweenSpeed, Enum.EasingStyle.Quad);
        const sizeTween = Tween(frame, info, {
            Size: UDim2.fromScale(this.size / 10, this.size / 10)
        });

        for (const line of <Frame[]>frame.GetChildren().filter(c => c.IsA("Frame")))
            Tween(line, info, {
                BackgroundTransparency: this.size === 0 ? 1 : 0
            });

        return sizeTween;
    }
    
    public toggleMouseIcon(): void {
        this.enabled = !this.enabled;
        UIS.MouseIconEnabled = !this.enabled;
    }
}