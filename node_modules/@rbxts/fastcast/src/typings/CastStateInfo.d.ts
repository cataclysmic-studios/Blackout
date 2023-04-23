import CastTrajectory from "./CastTrajectory";

/**
 * A CastStateInfo contains the information that the ActiveCast uses to keep track of where it is.
 * 
 * @internal This is an internal class intended to be used by FastCast itself, and should not be edited by you in any way. Changing any of these properties will cause ray simulation to completely break.
 */
declare interface CastStateInfo {
    /**
     * The underlying RBXScriptSignal that is connected to one of RunService's update methods to update this ActiveCast.
     */
    UpdateConnection: RBXScriptSignal

    /**
     * Represents whether or not this ActiveCast should be simulating. If true, the cast will freeze and not simulate any physics data.
     */
    Paused: boolean

    /**
     * The amount of time that this cast has been running for in seconds.
     */
    TotalRuntime: number

    /**
     * The amount of distance that this cast has traveled.
     */
    DistanceCovered: number

    /**
     * An internal value intended to determine whether or not the system is calculating a pierce.
     */
    IsActivelySimulatingPierce: boolean

    /**
     * An array of CastTrajectory objects that represent a specific section in time of simulation.
     * A new instance of this object will be added to this list whenever a method that can change the behavior or motion of the projectile is called.
     */
    readonly Trajectories: CastTrajectory[]
}

export = CastStateInfo;