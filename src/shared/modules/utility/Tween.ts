import { TweenService } from "@rbxts/services";

export default function<T extends Instance = Instance>(o: T, i: TweenInfo, g: Partial<ExtractMembers<T, Tweenable>>): Tween {
    const t = TweenService.Create(o, i, g);
    t.Play();
    return t;
}