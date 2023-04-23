import { Dependency } from "@flamework/core";
import { ViewModelController } from "client/controllers/view-model";
import StatefulText from "./stateful-text";

interface AmmoTextProps {
  Type: "Mag" | "Reserve";
}

export default class AmmoText extends StatefulText<AmmoTextProps> {
  protected override didMount(): void {
    const vm = Dependency<ViewModelController>();
    this.janitor.Add(vm.events.ammoChanged.Connect(
      ammo => this.props.Type === "Mag" ? this.update(tostring(ammo.mag)) : this.update(tostring(ammo.reserve))
    ));
    super.didMount();
  }
}