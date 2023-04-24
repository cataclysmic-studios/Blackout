import { Modding, Service, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";

export interface OnPlayerAdded {
  onPlayerAdded(player: Player): void;
}

export interface OnPlayerRemoving {
  onPlayerRemoving(player: Player): void;
}

@Service()
export class PlayerJoinService implements OnStart {
  public onStart(): void {
    const addListeners = new Set<OnPlayerAdded>;
    Modding.onListenerAdded<OnPlayerAdded>(object => addListeners.add(object));
    Modding.onListenerRemoved<OnPlayerAdded>(object => addListeners.delete(object));

    const removeListeners = new Set<OnPlayerRemoving>;
    Modding.onListenerAdded<OnPlayerRemoving>(object => removeListeners.add(object));
    Modding.onListenerRemoved<OnPlayerRemoving>(object => removeListeners.delete(object));

    Players.PlayerAdded.Connect(player => {
      for (const listener of addListeners)
        task.spawn(() => listener.onPlayerAdded(player));
    });
    Players.PlayerRemoving.Connect(player => {
      for (const listener of removeListeners)
        task.spawn(() => listener.onPlayerRemoving(player));
    });

    for (const player of Players.GetPlayers())
      for (const listener of addListeners)
        task.spawn(() => listener.onPlayerAdded(player));
  }
}