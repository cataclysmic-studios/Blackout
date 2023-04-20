import { TweenService } from "@rbxts/services";

/**
 * Create a tween
 * 
 * @param o Instance to tween
 * @param i TweenInfo
 * @param g Property table
 * @returns Tween
 */
export default function <T extends Instance = Instance>(o: T, i: TweenInfo, g: Partial<ExtractMembers<T, Tweenable>>): Tween {
    const t = TweenService.Create(o, i, g);
    t.Play();
    return t;
}