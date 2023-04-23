import ActiveCast from './ActiveCast';
import FastCastBehavior from './FastCastBehavior';

/**
 * A caster is an object that represents a type of ranged weapon (or whatever the module is representing).
 * It provides a means of firing projectiles as well as keeping track of these projectiles.
 *  It is analogous to a gun or other firing mechanism.
 */
declare interface Caster {
    //Properties

    /**
     * The target WorldRoot that this Caster runs in by default. Its default value is workspace.
     */
    WorldRoot: WorldRoot;

    //Methods

    /**
     * Fires a ray from this Caster. This actively simulated ray (or "bullet") is represented as an object referred to as an ActiveCast. The velocity parameter can either be a number or a Vector3. If it is a number, it will be in the same direction as direction and effectively represents a speed for your cast in studs/sec.

       All properties that define how this ray will behave are in the dataPacket parameter. See FastCastBehavior for more information.
     */
    Fire(
        origin: Vector3,
        direction: Vector3,
        velocity: Vector3 | number,
        dataPacket?: FastCastBehavior
    ): ActiveCast

    //Events


    /**
     * This event fires every time any ray fired by this Caster updates and moves.
     * 
     * To calculate the current point, use `lastPoint + (rayDir * displacement)`
     * 
     * @param lastPoint The point the ray was at before it was moved
     * @param rayDir The rays direction of movement
     * @param displacement How far the ray moved in the direction of rayDir
     * @param segmentVelocity The velocity of the bullet at the time this event fired
     * @param cosmeticBulletObject A reference to the cosmetic bullet passed into the Fire method
     */
    LengthChanged: RBXScriptSignal<
        (
            casterThatFired: ActiveCast,
            lastPoint: Vector3,
            rayDir: Vector3,
            displacement: number,
            segmentVelocity: Vector3,
            cosmeticBulletObject?: Instance
        ) => void
    >

    /**
     * This event fires when any ray fired by this Caster runs into something and is terminated.
     * This will not fire if the ray hits nothing and instead reaches its maximum distance.
     * 
     * @param casterThatFired A reference to the ActiveCast that fired this event
     * @param result The RaycastResult of the ray that caused this hit to occur
     * @param segmentVelocity The velocity of the bullet at the time of the hit
     * @param cosmeticBulletObject A reference to the passed in cosmetic bullet
     */
    RayHit: RBXScriptSignal<
        (
            casterThatFired: ActiveCast,
            result: RaycastResult,
            segmentVelocity: Vector3,
            cosmeticBulletObject?: Instance
        ) => void
    >

    /**
     * This event fires when any ray fired by this Caster pierces something.
     * This will never fire if canPierceFunction is undefined.
     * This will not fire if the ray hits nothing and instead reaches its maximum distance.
     * 
     * @param casterThatFired A reference to the ActiveCast that fired this event
     * @param result The RaycastResult of the ray that caused this hit to occur
     * @param segmentVelocity The velocity of the bullet at the time of the hit
     * @param cosmeticBulletObject A reference to the passed in cosmetic bullet
     */
    RayPierced: RBXScriptSignal<
        (
            casterThatFired: ActiveCast,
            result: RaycastResult,
            segmentVelocity: Vector3,
            cosmeticBulletObject?: Instance
        ) => void
    >

    /**
     * This event fires while a ray is terminating.
     * 
     * @param casterThatFired A reference to the ActiveCast that fired this event
     */
    CastTerminating: RBXScriptSignal<
        (
            casterThatFired: ActiveCast
        ) => void
    >
}

export = Caster;