export const enum Firemode {
  Auto,
  Semi,
  Burst,
  Bolt
}

export const enum BanReason {
  Unbanned,
  Exploiting
}

export const enum KickReason {
  // Player entity related
  PlayerEntityInstantiationError,

  // Player data related
  PlayerProfileUndefined,

  Banned
}

export const enum AppScene {
  Menu,
  Loading,
  Game
}

export const enum Tag {
  Penetratable = "Penetratable",
}

export const enum MenuPage {
  Main = "Main",
  Loadout = "Loadout",
  EditLoadout = "EditLoadout",
  Gunsmith = "Gunsmith",
  Operators = "Operators",
  Settings = "Settings",
  GraphicsSettings = "GraphicsSettings",
  AudioSettings = "AudioSettings",
  Controls = "Controls"
}