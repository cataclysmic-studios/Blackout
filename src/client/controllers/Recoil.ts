import { Controller } from "@flamework/core";
import { WeaponData } from "shared/modules/Types";
import Spring from "shared/modules/utility/Spring";
import ViewModel from "client/classes/ViewModel";

@Controller({})
export class Recoil {
  private readonly attached: (Camera | ViewModel)[] = [];
  private readonly springDefaults = {
    camera: [20, 40, 4, 4],
    cameraTorque: [70, 1, 4, 15],
    model: [25, 75, 4, 5.5],
    modelTorque: [40, 110, 4, 4]
  };
  private readonly springs = {
    camera: new Spring(...this.springDefaults.camera),
    cameraTorque: new Spring(...this.springDefaults.cameraTorque),
    model: new Spring(...this.springDefaults.model),
    modelTorque: new Spring(...this.springDefaults.modelTorque),
  };

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

    for (let obj of this.attached)
      if (obj)
        if (typeOf(obj) === "Instance") {
          obj = <Camera>obj;
          obj.CFrame = obj.CFrame.mul(crecoil);
        } else {
          obj = <ViewModel>obj;
          obj.syncCameraBone();
          obj.setCFrame(obj.getCFrame(dt, aimed).mul(mrecoil));
          if (obj.weapon) {
            const lv = obj.weapon!.Trigger.AssemblyLinearVelocity;
            obj.weapon!.Trigger.AssemblyLinearVelocity = new Vector3(lv.X, 0, lv.Y);
          }
        }
  }

  // Shove recoil springs according to recoil type (camera/model)
  public kick({ recoilSpringModifiers: modifiers }: WeaponData, force: Vector3, recoilType: "Camera" | "Model", stabilization: number, torqueDir: number): void {
    if (recoilType === "Camera") {
      const [mainDefaultMass, mainDefaultForce, mainDefaultDamper, mainDefaultSpeed] = this.springDefaults.camera;
      this.springs.camera.mass = mainDefaultMass / modifiers.camRecoverSpeed;
      this.springs.camera.force = mainDefaultForce / modifiers.camKickMult;
      this.springs.camera.damping = mainDefaultDamper * modifiers.camKickDamper;
      this.springs.camera.speed = mainDefaultSpeed * modifiers.camKickSpeed;
      this.springs.camera.shove(force.div(stabilization));

      const [torqueDefaultMass, torqueDefaultForce, torqueDefaultDamper, torqueDefaultSpeed] = this.springDefaults.cameraTorque;
      this.springs.cameraTorque.mass = torqueDefaultMass / modifiers.camRecoverSpeed;
      this.springs.cameraTorque.force = torqueDefaultForce / modifiers.camKickMult;
      this.springs.cameraTorque.damping = torqueDefaultDamper * modifiers.camKickDamper;
      this.springs.cameraTorque.speed = torqueDefaultSpeed * modifiers.camKickSpeed;

      const torque = force.div(stabilization);
      this.springs.cameraTorque.shove(torque.mul(torqueDir));
      task.delay(.1, () => this.springs.cameraTorque.shove(torque.mul(-torqueDir)));
    } else if (recoilType === "Model") {
      const [mainDefaultMass, mainDefaultForce, mainDefaultDamper, mainDefaultSpeed] = this.springDefaults.model;
      this.springs.model.mass = mainDefaultMass / modifiers.modelRecoverSpeed;
      this.springs.model.force = mainDefaultForce / modifiers.modelKickMult;
      this.springs.model.damping = mainDefaultDamper * modifiers.modelKickDamper;
      this.springs.model.speed = mainDefaultSpeed * modifiers.modelKickSpeed;
      this.springs.model.shove(force.div(stabilization));

      const [torqueDefaultMass, torqueDefaultForce, torqueDefaultDamper, torqueDefaultSpeed] = this.springDefaults.modelTorque;
      this.springs.modelTorque.mass = torqueDefaultMass / modifiers.modelRecoverSpeed;
      this.springs.modelTorque.force = torqueDefaultForce / modifiers.modelKickMult;
      this.springs.modelTorque.damping = torqueDefaultDamper * modifiers.modelKickDamper;
      this.springs.modelTorque.speed = torqueDefaultSpeed * modifiers.modelKickSpeed;

      const torque = force.div(stabilization);
      this.springs.modelTorque.shove(torque.mul(torqueDir));
      task.delay(.1, () => this.springs.modelTorque.shove(torque.mul(-torqueDir)));
    }
  }

  // Attach recoil updates to a ViewModel or camera
  public attach(instance: Camera | ViewModel): void {
    this.attached.push(instance);
  }

  // Clear attached instances
  public destroy(): void {
    this.attached.clear();
  }
}
