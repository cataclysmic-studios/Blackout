import { TweenService } from "@rbxts/services";
import { $error } from "rbxts-transform-debug";
const { huge: inf, min, sin } = math;

/**
 * Spawn and play a tween quickly
 * 
 * @param object Instance to tween
 * @param info TweenInfo
 * @param props Property table
 * @returns Tween
 */
export function tween<T extends Instance = Instance>(object: T, info: TweenInfo, props: Partial<ExtractMembers<T, Tweenable>>): Tween {
  const t = TweenService.Create(object, info, props);
  t.Play();
  return t;
}

/**
 * Wait for child of name
 * 
 * @param instance Parent
 * @param instanceName Child name
 * @returns Child
 */
export function waitFor<T extends Instance>(instance: Instance, childName: string): T
export function waitFor<T extends Instance>(instance: Instance, childName: string, timeout?: number): Maybe<T> {
  if (!instance) throw $error("Instance is undefined", 2);
  if (!childName) throw $error("Child instance name is undefined", 2);
  return <T>instance.WaitForChild(childName, timeout ?? 6);
}

/**
 * Checks if a value is not a number
 * 
 * @param x Value
 * @returns True if value is not a number 
 */
export function isNaN(x: number) { return x !== x }

/**
 * Simple Hooke's spring implementation
 */
export class Spring {
  static readonly iterations = 8;
  public target = new Vector3();
  public position = new Vector3();
  public velocity = new Vector3();

  public constructor(
    public mass = 5,
    public force = 50,
    public damping = 4,
    public speed = 4
  ) { }

  /**
   * Shove the spring off equilibrium
   * 
   * @param force Force vector
   */
  public shove(force: Vector3): void {
    let { X, Y, Z } = force;
    if (isNaN(X) || X === inf || X === -inf)
      X = 0;
    if (isNaN(Y) || Y === inf || Y === -inf)
      Y = 0;
    if (isNaN(Z) || Z === inf || Z === -inf)
      Z = 0;

    this.velocity = this.velocity.add(new Vector3(X, Y, Z));
  }

  /**
   * Update the spring
   * 
   * @param dt Delta time
   * @returns New value
   */
  public update(dt: number): Vector3 {
    const scaledDt: number = min(dt, 1) * this.speed / Spring.iterations;
    for (let i = 0; i < Spring.iterations; i++) {
      const force: Vector3 = this.target.sub(this.position);
      let accel: Vector3 = force
        .mul(this.force)
        .div(this.mass);

      accel = accel.sub(this.velocity.mul(this.damping));
      this.velocity = this.velocity.add(accel.mul(scaledDt));
      this.position = this.position.add(this.velocity.mul(scaledDt));
    }
    return this.position;
  }
}

/**
 * Simple class for sinusoidal motion
 */
export class SineWave {
  public constructor(
    public readonly amplitude = 1,
    public readonly frequency = 1,
    public readonly phaseShift = 0,
    public readonly verticalShift = 0
  ) { }

  /**
   * Update wave
   * 
   * @param dt Delta time
   * @returns New value
   */
  public update(dt: number): number {
    return (this.amplitude * sin(this.frequency * tick() + this.phaseShift) + this.verticalShift) * 60 * dt;
  }
}