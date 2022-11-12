import { Controller, OnRender } from "@flamework/core";
import Spring from "shared/modules/utility/Spring";
// import ViewModel from "client/classes/ViewModel";

@Controller({})
export class RecoilController implements OnRender {
	private readonly attached: (Camera)[] = []; // | ViewModel
    private readonly springDefaults = {
        camera: [25, 75, 4, 5.5],
        cameraTorque: [50, 110, 4, 15],
        model: [25, 75, 4, 5.5],
        modelTorque: [40, 110, 4, 4]
    };
    private readonly springs = {
        camera: new Spring(...this.springDefaults.camera),
        cameraTorque: new Spring(...this.springDefaults.cameraTorque),
        model: new Spring(...this.springDefaults.model),
        modelTorque: new Spring(...this.springDefaults.modelTorque),
    };
    private readonly modifiers = {
        camRecoverSpeed: 1,
        camKickSpeed: 1,
        camKickMult: 1,
        camKickDamper: 1,
        modelRecoverSpeed: 1,
        modelKickSpeed: 1,
        modelKickMult: 1,
        modelKickDamper: 1,
    };

	public onRender(dt: number): void {
        const torqueMult = 14;
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
        const mvertClimb = CFrame.Angles(omf.X, 0, 0);
        const mtorque = CFrame.Angles(0, tmf.Y, tmf.Y * torqueMult)
        const mrecoil = moffset.mul(mvertClimb).mul(mtorque);
        
        for (let obj of this.attached)
            if (obj)
                if (typeOf(obj) === "Instance") {
                    obj = <Camera>obj;
                    obj.CFrame = obj.CFrame.mul(crecoil);
                } else {
                    // obj = <ViewModel>obj;
                    // obj.setCFrame(obj.getCFrame().mul(mrecoil));
                }
    }

    public kick(force: Vector3, recoilType: "Camera" | "Model"): void {
        if (recoilType === "Camera") {
            const [mainDefaultMass, mainDefaultForce, mainDefaultDamper, mainDefaultSpeed] = this.springDefaults.camera;
            this.springs.camera.mass = mainDefaultMass / this.modifiers.camRecoverSpeed;
            this.springs.camera.force = mainDefaultForce / this.modifiers.camKickMult;
            this.springs.camera.damping = mainDefaultDamper * this.modifiers.camKickDamper;
            this.springs.camera.speed = mainDefaultSpeed * this.modifiers.camKickSpeed;
            this.springs.camera.shove(force);

            const [torqueDefaultMass, torqueDefaultForce, torqueDefaultDamper, torqueDefaultSpeed] = this.springDefaults.cameraTorque;
            this.springs.cameraTorque.mass = torqueDefaultMass / this.modifiers.camRecoverSpeed;
            this.springs.cameraTorque.force = torqueDefaultForce / this.modifiers.camKickMult;
            this.springs.cameraTorque.damping = torqueDefaultDamper * this.modifiers.camKickDamper;
            this.springs.cameraTorque.speed = torqueDefaultSpeed * this.modifiers.camKickSpeed;
            this.springs.cameraTorque.shove(force);
        } else if (recoilType === "Model") {
            const [mainDefaultMass, mainDefaultForce, mainDefaultDamper, mainDefaultSpeed] = this.springDefaults.model;
            this.springs.model.mass = mainDefaultMass / this.modifiers.modelRecoverSpeed;
            this.springs.model.force = mainDefaultForce / this.modifiers.modelKickMult;
            this.springs.model.damping = mainDefaultDamper * this.modifiers.modelKickDamper;
            this.springs.model.speed = mainDefaultSpeed * this.modifiers.modelKickSpeed;
            this.springs.model.shove(force);

            const [torqueDefaultMass, torqueDefaultForce, torqueDefaultDamper, torqueDefaultSpeed] = this.springDefaults.modelTorque;
            this.springs.modelTorque.mass = torqueDefaultMass / this.modifiers.modelRecoverSpeed;
            this.springs.modelTorque.force = torqueDefaultForce / this.modifiers.modelKickMult;
            this.springs.modelTorque.damping = torqueDefaultDamper * this.modifiers.modelKickDamper;
            this.springs.modelTorque.speed = torqueDefaultSpeed * this.modifiers.modelKickSpeed;
            this.springs.modelTorque.shove(force);
        }
    }

    public attach(instance: Camera): void { // | ViewModel
        this.attached.push(instance);
    }

    public destroy(): void {
        this.attached.clear();
    }
}
