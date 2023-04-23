export const enum Firemode {
	Auto,
	Semi,
	Burst,
	Bolt
}

export const enum BanReason {
	Exploiting
}

export const enum KickReason {
	// Player entity related
	PlayerEntityInstantiationError,

	// Player data related
	PlayerProfileUndefined,
	PlayerProfileReleased,
}

export const enum Scene {
	Menu,
	Game,
}