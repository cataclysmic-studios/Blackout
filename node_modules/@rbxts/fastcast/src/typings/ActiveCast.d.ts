import Caster from "./Caster";
import CastStateInfo from "./CastStateInfo";
import CastRayInfo from "./CastRayInfo";

/**
 * An ActiveCast represents a bullet fired by a parent Caster.
 * It contains methods of accessing the physics data of this specific bullet at any given time,
 * as well as methods to alter its trajectory during runtime.
 */
declare interface ActiveCast {
    //Properties

    /**
     * A reference to the Caster that created this ActiveCast from its Fire method.
     */
    readonly Caster: Caster

    /**
     * A container storing information about the caster's state.
     */
    readonly StateInfo: CastStateInfo

    /**
     * A container storing information pertaining to actual raycasting.
     */
    RayInfo: CastRayInfo;

    /**
     * An object where the user can store arbitrary information pertaining to this ActiveCast.
     * This is a generic object, so you can populate it with whatever data you want.
     */
    UserData: object;

    //Methods

    /**
     * Updates the caster and increments its internal timer forward by deltaTime seconds.
     * 
     * @param deltaTime amount of seconds to increment the internal timer by
     * @internal Manually calling this method will cause simulation faults and inaccuracies in the cast.
     */
    Update(
        deltaTime: number
    ): void

    /**
     * Returns the velocity of the cast at this point in time.
     */
    GetVelocity(): Vector3

    /**
     * Returns the acceleration of the cast at this point in time.
     */
    GetAcceleration(): Vector3

    /**
     * Returns the position of the cast at this point in time.
     */
    GetPosition(): Vector3

    /**
     * Sets the velocity of this cast at this point in time to velocity.
     * 
     * @param velocity The new velocity 
     */
    SetVelocity(velocity: Vector3): void

    /**
     * Sets the acceleration of this cast at this point in time to acceleration.
     * 
     * @param acceleration The new acceleration
     */
    SetAcceleration(acceleration: Vector3): void

    /**
     * Sets the position of this cast at this point in time to position.
     * 
     * @param position The new position
     */
    SetPosition(position: Vector3): void

    /**
     * Adds velocity onto the current velocity of the cast.
     * 
     * @param velocity The velocity to add
     */
    AddVelocity(velocity: Vector3): void

    /**
     * Adds acceleration onto the current acceleration of the cast.
     * 
     * @param acceleration The acceleration to add
     */
    AddAcceleration(acceleration: Vector3): void

    /**
     * Adds position onto the current position of the cast.
     * 
     * @param position The position to add
     */
    AddPosition(position: Vector3): void

    /**
     * Pause this ActiveCast, preventing it from simulating.
     */
    Pause(): void

    /**
     * Resume this ActiveCast, causing it to simulate again.
     */
    Resume(): void

    /**
     * Terminate this ActiveCast, disconnecting its update event and disposing of all of the data stored inside. Fires the Terminated event.
     * 
     * Do not call this method manually inside of any event handlers! This will cause an error to occur.
     * 
     * This method disposes of the ActiveCast! Attempting to access any information in the ActiveCast after calling this method will fail.
     */
    Terminate(): void

}

export = ActiveCast;