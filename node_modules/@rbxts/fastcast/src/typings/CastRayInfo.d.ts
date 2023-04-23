import ActiveCast from "./ActiveCast";

/**
 * A CastRayInfo stores information about how an ActiveCast should fire its rays. It is safe to alter this in real-time.
 */
declare interface CastRayInfo {
    //Properties

    /**
     * The RaycastParams used in all raycasts from this ActiveCast.
     * This can be freely edited.
     * When the ActiveCast is instantiated, the input parameters are cloned, and this property is set to the clone instance.
     * 
     * As per Roblox's standards, you should access this and change its properties instead of changing it to a new RaycastParams instance.
     */
    Parameters: RaycastParams;

    /**
     * The WorldRoot that this ActiveCast should simulate in.
     * By default, it is equal to whatever its parent Caster is set to, but can be changed at any time.
     */
    WorldRoot: WorldRoot;

    /**
     * The maximum distance that the ray can travel.
     * By default, it is the magnitude of the parent Caster's directionWithMagnitude parameter when the Fire method is called.
     */
    MaxDistance: number;

    /**
     * A reference to the input cosmetic bullet from the parent Caster's Fire method. See Caster for more information.
     */
    CosmeticBulletObject?: Instance

    /**
     * A reference to the input pierce function from the parent Caster's Fire method. See Caster for more information.
     */
    CanPierceCallback: (cast: ActiveCast, result: RaycastResult, segmentVelocity: Vector3) => boolean
}

export = CastRayInfo;