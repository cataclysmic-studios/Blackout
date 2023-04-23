/**
 * A CastTrajectory is an object that represents a segment of an ActiveCast's trajectory.
 * ActiveCasts are graphed as Piecewise Functions, and a CastTrajectory represents one of its pieces.
 * 
 * @internal This is an internal class intended to be used by FastCast itself, and should not be edited by you in any way. Changing any of these properties will cause ray simulation to completely break. If you need to change your ActiveCast's trajectory, use the methods provided by the ActiveCast object instead.
 */
declare interface CastTrajectory {
    //Properties

    /**
     * The relative time that this CastTrajectory started at in seconds.
     * This value is always relative to its parent ActiveCast.
     */
    StartTime: number;

    /**
     * The relative time that this CastTrajectory ended at in seconds, or -1 if it has not ended yet.
     * This value is always relative to its parent ActiveCast's start time.
     */
    EndTime: number;

    /**
     * The position of the ActiveCast when this trajectory was created.
     */
    Origin: Vector3;

    /**
     * The velocity of the ActiveCast when this trajectory was created.
     */
    InitialVelocity: Vector3;

    /**
     * The acceleration of the ActiveCast when this trajectory was created.
     */
    Acceleration: Vector3;
}

export = CastTrajectory;