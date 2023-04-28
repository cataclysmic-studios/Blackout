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
  Game,
}

export const enum Tag {
  Penetratable = "Penetratable",
}