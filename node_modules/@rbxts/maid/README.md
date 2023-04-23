# rbxts-maid
Quenty's Maid class with types!

```TS
import Maid from "@rbxts/maid";

const maid = new Maid();
maid.GiveTask(() => print("Clean me!"));
maid.GiveTask(game.Workspace.ChildAdded.Connect(() => print("Child Added!")));
maid.GiveTask(new Maid());
maid.GiveTask({ Destroy() {} });
maid.DoCleaning();
```
