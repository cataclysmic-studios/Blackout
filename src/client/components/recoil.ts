import { BaseComponent, Component } from "@flamework/components";
import { WeaponData } from "shared/modules/types";
import { Spring } from "shared/modules/utility";
import ViewModel from "client/components/view-model";

const springDefaults = {
  camera: [20, 40, 4, 4],
  cameraTorque: [70, 1, 4, 15],
  model: [25, 75, 4, 5.5],
  modelTorque: [40, 110, 4, 4]
};

@Component()
export class Recoil extends BaseComponent<{}> {
  private readonly springs = {
    camera: new Spring(...springDefaults.camera),
    cameraTorque: new Spring(...springDefaults.cameraTorque),
    model: new Spring(...springDefaults.model),
    modelTorque: new Spring(...springDefaults.modelTorque)
  };

  public constructor(
    private readonly toAttach: ViewModel | Camera
  ) {
    super();
    this.instance = (<ViewModel>toAttach).instance ?? toAttach;
  }

  /**
   * Update the recoil
   * 
   * @param dt Delta time
   * @param aimed Whether or not the player is aiming
   */
  public update(dt: number, aimed: boolean): void {
    const torqueMult = 12;
    const springDamp = 80;
    const ocf = this.springs.camera.update(dt).div(springDamp);
    const tcf = this.springs.cameraTorque.update(dt).div(springDamp);
    const coffset = new CFrame(0, 0, ocf.Z * 2.5);
    const cvertClimb = CFrame.Angles(ocf.X, 0, 0);
    const ctorque = CFrame.Angles(0, tcf.Y, tcf.Y * torqueMult)
    const crecoil = coffset.mul(cvertClimb).mul(ctorque);

    const omf = this.springs.model.update(dt).div(springDamp);
    const tmf = this.springs.modelTorque.update(dt).div(springDamp);
    const moffset = new CFrame(0, 0, omf.Z);
    const mvertClimb = new CFrame(0, -omf.X * 4, 0).mul(CFrame.Angles(omf.X * 2, 0, 0));
    const mtorque = CFrame.Angles(0, tmf.Y, tmf.Y * torqueMult); // * (aimed ? 1.25 : 1)
    const mrecoil = moffset.mul(mvertClimb).mul(mtorque);

    if (typeOf(this.instance) === "Instance") {
      const cam = <Camera>this.toAttach;
      cam.CFrame = cam.CFrame.mul(crecoil);
    } else {
      const vm = <ViewModel>this.toAttach;
      vm.syncCameraBone();
      vm.setCFrame(vm.getCFrame(dt, aimed).mul(mrecoil));
      if (vm.weapon) {
        const lv = vm.weapon!.Trigger.AssemblyLinearVelocity;
        vm.weapon!.Trigger.AssemblyLinearVelocity = new Vector3(lv.X, 0, lv.Y);
      }
    }
  }

  /**
   * Shove recoil springs according to recoil type (camera/model)
   * 
   * @param {WeaponData} weaponData Weapon data
   * @param force The recoil force to apply
   * @param recoilType The recoil type (camera or model)
   * @param stabilization The stabilization value
   * @param torqueDir Torque direction
   */
  public kick({ recoilSpringModifiers: modifiers }: WeaponData, force: Vector3, recoilType: "Camera" | "Model", stabilization: number, torqueDir: number): void {
    if (recoilType === "Camera") {
      const [mainDefaultMass, mainDefaultForce, mainDefaultDamper, mainDefaultSpeed] = springDefaults.camera;
      this.springs.camera.mass = mainDefaultMass / modifiers.camRecoverSpeed;
      this.springs.camera.force = mainDefaultForce / modifiers.camKickMult;
      this.springs.camera.damping = mainDefaultDamper * modifiers.camKickDamper;
      this.springs.camera.speed = mainDefaultSpeed * modifiers.camKickSpeed;
      this.springs.camera.shove(force.div(stabilization));

      const [torqueDefaultMass, torqueDefaultForce, torqueDefaultDamper, torqueDefaultSpeed] = springDefaults.cameraTorque;
      this.springs.cameraTorque.mass = torqueDefaultMass / modifiers.camRecoverSpeed;
      this.springs.cameraTorque.force = torqueDefaultForce / modifiers.camKickMult;
      this.springs.cameraTorque.damping = torqueDefaultDamper * modifiers.camKickDamper;
      this.springs.cameraTorque.speed = torqueDefaultSpeed * modifiers.camKickSpeed;

      const torque = force.div(stabilization);
      this.springs.cameraTorque.shove(torque.mul(torqueDir));
      task.delay(.1, () => this.springs.cameraTorque.shove(torque.mul(-torqueDir)));
    } else if (recoilType === "Model") {
      const [mainDefaultMass, mainDefaultForce, mainDefaultDamper, mainDefaultSpeed] = springDefaults.model;
      this.springs.model.mass = mainDefaultMass / modifiers.modelRecoverSpeed;
      this.springs.model.force = mainDefaultForce / modifiers.modelKickMult;
      this.springs.model.damping = mainDefaultDamper * modifiers.modelKickDamper;
      this.springs.model.speed = mainDefaultSpeed * modifiers.modelKickSpeed;
      this.springs.model.shove(force.div(stabilization));

      const [torqueDefaultMass, torqueDefaultForce, torqueDefaultDamper, torqueDefaultSpeed] = springDefaults.modelTorque;
      this.springs.modelTorque.mass = torqueDefaultMass / modifiers.modelRecoverSpeed;
      this.springs.modelTorque.force = torqueDefaultForce / modifiers.modelKickMult;
      this.springs.modelTorque.damping = torqueDefaultDamper * modifiers.modelKickDamper;
      this.springs.modelTorque.speed = torqueDefaultSpeed * modifiers.modelKickSpeed;

      const torque = force.div(stabilization);
      this.springs.modelTorque.shove(torque.mul(torqueDir));
      task.delay(.1, () => this.springs.modelTorque.shove(torque.mul(-torqueDir)));
    }
  }
}
