interface ReplicatedStorage extends Instance {
	MenuCameras: Folder & {
		Main: CFrameValue;
		Loadout: CFrameValue;
	};
	TS: Folder & {
		modules: Folder & {
			Enums: ModuleScript;
			Types: ModuleScript;
			utility: Folder & {
				Tween: ModuleScript;
				WaitFor: ModuleScript;
				Spring: ModuleScript;
				IsNaN: ModuleScript;
				Wave: ModuleScript;
			};
		};
		components: Folder;
		network: ModuleScript;
	};
	Character: Folder & {
		ViewModel: Model & {
			AnimationController: AnimationController & {
				Animator: Animator;
			};
			Camera: Part & {
				["Camera>RootPart"]: Motor6D;
			};
			arms: MeshPart & {
				meshMotor6D: Motor6D;
				SurfaceAppearance: SurfaceAppearance;
			};
			RootPart: Part & {
				Root: Bone & {
					Arm_R: Bone & {
						UpArm_R: Bone & {
							Forearm_R: Bone & {
								["BoneTwist_03.R"]: Bone & {
									["BoneTwist_02.R"]: Bone & {
										["BoneTwist_01.R"]: Bone;
									};
								};
							};
						};
					};
					Arm_L: Bone & {
						UpArm_L: Bone & {
							Forearm_L: Bone & {
								["BoneTwist_03.L"]: Bone & {
									["BoneTwist_02.L"]: Bone & {
										["BoneTwist_01.L"]: Bone;
									};
								};
							};
						};
					};
				};
				IK_Hand_Cntrl_R: Bone & {
					Hand_R: Bone & {
						["Bone_R.008"]: Bone & {
							["Bone_R.009"]: Bone & {
								["Bone_R.010"]: Bone & {
									["Bone_R.011"]: Bone;
								};
							};
						};
						["Bone_R.012"]: Bone & {
							["Bone_R.013"]: Bone & {
								["Bone_R.014"]: Bone & {
									["Bone_R.015"]: Bone;
								};
							};
						};
						["Bone_R.020"]: Bone & {
							["Bone_R.021"]: Bone & {
								["Bone_R.022"]: Bone;
							};
						};
						["Bone_R.004"]: Bone & {
							["Bone_R.005"]: Bone & {
								["Bone_R.006"]: Bone & {
									["Bone_R.007"]: Bone;
								};
							};
						};
						["Bone_R.016"]: Bone & {
							["Bone_R.017"]: Bone & {
								["Bone_R.018"]: Bone & {
									["Bone_R.019"]: Bone;
								};
							};
						};
					};
				};
				Body: Bone & {
					Slide: Bone;
					Load: Bone;
					Trig: Bone;
				};
				IK_Hand_Cntrl_L: Bone & {
					Hand_L: Bone & {
						["Bone_L.016"]: Bone & {
							["Bone_L.017"]: Bone & {
								["Bone_L.018"]: Bone & {
									["Bone_L.019"]: Bone;
								};
							};
						};
						["Bone_L.004"]: Bone & {
							["Bone_L.005"]: Bone & {
								["Bone_L.006"]: Bone & {
									["Bone_L.007"]: Bone;
								};
							};
						};
						["Bone_L.020"]: Bone & {
							["Bone_L.021"]: Bone & {
								["Bone_L.022"]: Bone;
							};
						};
						["Bone_L.008"]: Bone & {
							["Bone_L.009"]: Bone & {
								["Bone_L.010"]: Bone & {
									["Bone_L.011"]: Bone;
								};
							};
						};
						["Bone_L.012"]: Bone & {
							["Bone_L.013"]: Bone & {
								["Bone_L.014"]: Bone & {
									["Bone_L.015"]: Bone;
								};
							};
						};
					};
				};
			};
			InitialPoses: Folder & {
				["Bone_R.015_end_Composited"]: CFrameValue;
				["12ge_low_end_Initial"]: CFrameValue;
				UpArm_R_Initial: CFrameValue;
				["12ge_low_end_Original"]: CFrameValue;
				["12ge_low_end_Composited"]: CFrameValue;
				["Bone_R.007_end_Initial"]: CFrameValue;
				["Bone_L.022_Composited"]: CFrameValue;
				["Bone_L.020_Composited"]: CFrameValue;
				main_Initial: CFrameValue;
				["BoneTwist_02.R_Original"]: CFrameValue;
				["BoneTwist_01.L_Initial"]: CFrameValue;
				["Bone_L.007_Original"]: CFrameValue;
				IK_PoleTrgt_L_end_Composited: CFrameValue;
				main_Original: CFrameValue;
				["Bone_R.006_Initial"]: CFrameValue;
				main_Composited: CFrameValue;
				mesh_Initial: CFrameValue;
				["Bone_L.009_Original"]: CFrameValue;
				["Bone_R.011_Initial"]: CFrameValue;
				mesh_Original: CFrameValue;
				Load_end_Composited: CFrameValue;
				["BoneTwist_03.L_Initial"]: CFrameValue;
				UpArm_R_Original: CFrameValue;
				["Bone_L.007_Initial"]: CFrameValue;
				["Bone_L.010_Original"]: CFrameValue;
				["Bone_L.009_Initial"]: CFrameValue;
				["Bone_L.011_Initial"]: CFrameValue;
				["12ge_low_Initial"]: CFrameValue;
				["12ge_low_Original"]: CFrameValue;
				["Bone_L.014_Composited"]: CFrameValue;
				["Bone_R.012_Composited"]: CFrameValue;
				["BoneTwist_01.L_end_Composited"]: CFrameValue;
				["Bone_R.006_Original"]: CFrameValue;
				["Bone_R.005_Initial"]: CFrameValue;
				["Bone_L.018_Initial"]: CFrameValue;
				Load_end_Initial: CFrameValue;
				["Bone_R.019_Initial"]: CFrameValue;
				Load_end_Original: CFrameValue;
				Hand_L_Initial: CFrameValue;
				Load_Initial: CFrameValue;
				["Bone_R.016_Original"]: CFrameValue;
				["BoneTwist_02.L_Initial"]: CFrameValue;
				["Bone_L.011_end_Composited"]: CFrameValue;
				["Bone_L.012_Original"]: CFrameValue;
				Load_Composited: CFrameValue;
				Armature_Composited: CFrameValue;
				Trig_end_Initial: CFrameValue;
				["Bone_L.013_Composited"]: CFrameValue;
				["Bone_R.009_Composited"]: CFrameValue;
				["Bone_R.017_Original"]: CFrameValue;
				mesh_Composited: CFrameValue;
				["Bone_L.020_Initial"]: CFrameValue;
				["Bone_R.015_Composited"]: CFrameValue;
				Trig_Initial: CFrameValue;
				Hand_R_Composited: CFrameValue;
				["Bone_R.011_Composited"]: CFrameValue;
				["Bone_L.013_Original"]: CFrameValue;
				["BoneTwist_01.R_Initial"]: CFrameValue;
				Head_Cam_end_Initial: CFrameValue;
				["Bone_R.019_end_Original"]: CFrameValue;
				Trig_Composited: CFrameValue;
				["Bone_L.004_Original"]: CFrameValue;
				["Bone_R.022_end_Original"]: CFrameValue;
				["BoneTwist_03.L_Composited"]: CFrameValue;
				IK_PoleTrgt_L_end_Initial: CFrameValue;
				["Bone_L.016_Original"]: CFrameValue;
				Slide_end_Initial: CFrameValue;
				Body_Original: CFrameValue;
				["Bone_R.004_Initial"]: CFrameValue;
				Armature_Initial: CFrameValue;
				Slide_end_Composited: CFrameValue;
				["Bone_L.005_Composited"]: CFrameValue;
				Body_Initial: CFrameValue;
				["Bone_R.007_Composited"]: CFrameValue;
				Arm_R_Original: CFrameValue;
				["Bone_L.017_Original"]: CFrameValue;
				["Bone_R.014_Composited"]: CFrameValue;
				Forearm_R_Initial: CFrameValue;
				["Bone_L.022_end_Original"]: CFrameValue;
				Slide_Original: CFrameValue;
				Head_Cam_end_Original: CFrameValue;
				Slide_Composited: CFrameValue;
				IK_Hand_Cntrl_R_Initial: CFrameValue;
				Slide_Initial: CFrameValue;
				["Bone_L.005_Initial"]: CFrameValue;
				Body_Composited: CFrameValue;
				Head_Cam_end_Composited: CFrameValue;
				IK_PoleTrgt_R_end_Original: CFrameValue;
				UpArm_L_Original: CFrameValue;
				["BoneTwist_02.L_Original"]: CFrameValue;
				["Bone_R.017_Initial"]: CFrameValue;
				["Bone_L.015_end_Original"]: CFrameValue;
				IK_PoleTrgt_R_end_Initial: CFrameValue;
				["Bone_R.020_Initial"]: CFrameValue;
				Head_Cam_Initial: CFrameValue;
				["Bone_L.022_end_Initial"]: CFrameValue;
				["Bone_L.009_Composited"]: CFrameValue;
				IK_PoleTrgt_R_Initial: CFrameValue;
				IK_PoleTrgt_R_Original: CFrameValue;
				["Bone_L.004_Initial"]: CFrameValue;
				IK_PoleTrgt_L_Composited: CFrameValue;
				["Bone_R.022_end_Initial"]: CFrameValue;
				["Bone_R.022_end_Composited"]: CFrameValue;
				IK_Hand_Cntrl_L_Composited: CFrameValue;
				["Bone_L.006_Composited"]: CFrameValue;
				["Bone_R.022_Initial"]: CFrameValue;
				["Bone_R.022_Original"]: CFrameValue;
				["Bone_R.022_Composited"]: CFrameValue;
				["Bone_R.021_Initial"]: CFrameValue;
				["Bone_R.005_Composited"]: CFrameValue;
				["Bone_L.013_Initial"]: CFrameValue;
				["BoneTwist_01.R_end_Original"]: CFrameValue;
				Head_Cam_Original: CFrameValue;
				["Bone_R.011_end_Original"]: CFrameValue;
				["BoneTwist_02.L_Composited"]: CFrameValue;
				["Bone_R.020_Original"]: CFrameValue;
				["Bone_R.013_Composited"]: CFrameValue;
				["Bone_R.020_Composited"]: CFrameValue;
				Arm_L_Composited: CFrameValue;
				Hand_R_Original: CFrameValue;
				Trig_Original: CFrameValue;
				["Bone_L.016_Initial"]: CFrameValue;
				["Bone_R.008_Initial"]: CFrameValue;
				["Bone_R.019_Original"]: CFrameValue;
				["Bone_L.006_Initial"]: CFrameValue;
				["Bone_L.015_Composited"]: CFrameValue;
				["Bone_R.018_Initial"]: CFrameValue;
				["Bone_L.004_Composited"]: CFrameValue;
				["Bone_R.019_Composited"]: CFrameValue;
				Hand_L_Original: CFrameValue;
				["Bone_R.018_Original"]: CFrameValue;
				["Bone_L.007_end_Initial"]: CFrameValue;
				["Bone_R.018_Composited"]: CFrameValue;
				IK_Hand_Cntrl_L_Initial: CFrameValue;
				["Bone_R.017_Composited"]: CFrameValue;
				["Bone_R.016_Initial"]: CFrameValue;
				Head_Cam_Composited: CFrameValue;
				Arm_L_Original: CFrameValue;
				["Bone_L.019_Composited"]: CFrameValue;
				["BoneTwist_01.L_Original"]: CFrameValue;
				Load_Original: CFrameValue;
				["Bone_R.010_Composited"]: CFrameValue;
				["Bone_L.014_Initial"]: CFrameValue;
				["Bone_L.011_Original"]: CFrameValue;
				["Bone_R.015_end_Initial"]: CFrameValue;
				["Bone_R.015_end_Original"]: CFrameValue;
				["BoneTwist_01.R_end_Composited"]: CFrameValue;
				["Bone_L.020_Original"]: CFrameValue;
				["Bone_L.016_Composited"]: CFrameValue;
				["BoneTwist_02.R_Composited"]: CFrameValue;
				Forearm_L_Original: CFrameValue;
				IK_PoleTrgt_L_Original: CFrameValue;
				["Bone_R.015_Initial"]: CFrameValue;
				["Bone_R.010_Initial"]: CFrameValue;
				["Bone_R.006_Composited"]: CFrameValue;
				Arm_R_Composited: CFrameValue;
				UpArm_L_Composited: CFrameValue;
				UpArm_R_Composited: CFrameValue;
				["Bone_R.014_Initial"]: CFrameValue;
				["Bone_L.005_Original"]: CFrameValue;
				IK_PoleTrgt_L_Initial: CFrameValue;
				["Bone_L.010_Initial"]: CFrameValue;
				["Bone_L.015_end_Composited"]: CFrameValue;
				["Bone_R.014_Original"]: CFrameValue;
				["Bone_R.012_Initial"]: CFrameValue;
				["Bone_L.007_end_Composited"]: CFrameValue;
				["Bone_R.007_end_Original"]: CFrameValue;
				Arm_L_Initial: CFrameValue;
				["Bone_R.013_Initial"]: CFrameValue;
				["Bone_L.021_Initial"]: CFrameValue;
				Forearm_L_Initial: CFrameValue;
				["Bone_R.013_Original"]: CFrameValue;
				["Bone_R.012_Original"]: CFrameValue;
				["Bone_R.011_end_Initial"]: CFrameValue;
				["Bone_R.021_Composited"]: CFrameValue;
				["Bone_R.011_end_Composited"]: CFrameValue;
				["Bone_L.012_Composited"]: CFrameValue;
				Root_Initial: CFrameValue;
				["Bone_R.011_Original"]: CFrameValue;
				["BoneTwist_03.R_Composited"]: CFrameValue;
				["BoneTwist_03.R_Initial"]: CFrameValue;
				Hand_L_Composited: CFrameValue;
				["Bone_R.010_Original"]: CFrameValue;
				["Bone_R.016_Composited"]: CFrameValue;
				["Bone_R.009_Initial"]: CFrameValue;
				["Bone_R.007_end_Composited"]: CFrameValue;
				["Bone_R.019_end_Composited"]: CFrameValue;
				["Bone_R.008_Original"]: CFrameValue;
				Root_Original: CFrameValue;
				["BoneTwist_03.R_Original"]: CFrameValue;
				["Bone_L.008_Initial"]: CFrameValue;
				["Bone_L.019_Initial"]: CFrameValue;
				Forearm_R_Original: CFrameValue;
				["Bone_R.008_Composited"]: CFrameValue;
				["Bone_L.019_Original"]: CFrameValue;
				UpArm_L_Initial: CFrameValue;
				["Bone_R.009_Original"]: CFrameValue;
				["Bone_R.007_Initial"]: CFrameValue;
				["Bone_R.007_Original"]: CFrameValue;
				["Bone_R.015_Original"]: CFrameValue;
				["Bone_L.011_end_Initial"]: CFrameValue;
				IK_PoleTrgt_L_end_Original: CFrameValue;
				["Bone_R.005_Original"]: CFrameValue;
				["Bone_L.007_end_Original"]: CFrameValue;
				["Bone_R.021_Original"]: CFrameValue;
				["Bone_R.004_Original"]: CFrameValue;
				Armature_Original: CFrameValue;
				Hand_R_Initial: CFrameValue;
				["Bone_R.019_end_Initial"]: CFrameValue;
				IK_Hand_Cntrl_R_Original: CFrameValue;
				IK_Hand_Cntrl_R_Composited: CFrameValue;
				IK_PoleTrgt_R_Composited: CFrameValue;
				["BoneTwist_02.R_Initial"]: CFrameValue;
				["Bone_L.022_Initial"]: CFrameValue;
				["Bone_L.022_end_Composited"]: CFrameValue;
				["12ge_low_Composited"]: CFrameValue;
				["Bone_L.015_Initial"]: CFrameValue;
				["Bone_L.022_Original"]: CFrameValue;
				["Bone_L.012_Initial"]: CFrameValue;
				["Bone_L.006_Original"]: CFrameValue;
				Slide_end_Original: CFrameValue;
				Trig_end_Original: CFrameValue;
				["Bone_L.011_end_Original"]: CFrameValue;
				["Bone_L.021_Composited"]: CFrameValue;
				["Bone_L.019_end_Composited"]: CFrameValue;
				["Bone_L.007_Composited"]: CFrameValue;
				["Bone_L.021_Original"]: CFrameValue;
				Forearm_L_Composited: CFrameValue;
				["Bone_R.004_Composited"]: CFrameValue;
				Trig_end_Composited: CFrameValue;
				["Bone_L.017_Initial"]: CFrameValue;
				["Bone_L.008_Original"]: CFrameValue;
				IK_PoleTrgt_R_end_Composited: CFrameValue;
				Forearm_R_Composited: CFrameValue;
				["Bone_L.019_end_Original"]: CFrameValue;
				["Bone_L.015_Original"]: CFrameValue;
				["Bone_L.011_Composited"]: CFrameValue;
				["Bone_L.018_Original"]: CFrameValue;
				["Bone_L.018_Composited"]: CFrameValue;
				["Bone_L.010_Composited"]: CFrameValue;
				["BoneTwist_01.L_end_Original"]: CFrameValue;
				["Bone_L.017_Composited"]: CFrameValue;
				["BoneTwist_01.R_Composited"]: CFrameValue;
				["BoneTwist_01.L_end_Initial"]: CFrameValue;
				["Bone_L.019_end_Initial"]: CFrameValue;
				IK_Hand_Cntrl_L_Original: CFrameValue;
				["BoneTwist_01.R_end_Initial"]: CFrameValue;
				["BoneTwist_03.L_Original"]: CFrameValue;
				["Bone_L.015_end_Initial"]: CFrameValue;
				["Bone_L.014_Original"]: CFrameValue;
				["Bone_L.008_Composited"]: CFrameValue;
				["BoneTwist_01.L_Composited"]: CFrameValue;
				Root_Composited: CFrameValue;
				Arm_R_Initial: CFrameValue;
				["BoneTwist_01.R_Original"]: CFrameValue;
			};
		};
	};
	Weapons: Folder & {
		HK416: Folder & {
			["Forward Assist"]: MeshPart;
			TriggerMesh: MeshPart & {
				TriggerMesh: Motor6D;
			};
			MagBullets: MeshPart;
			Animations: Folder & {
				Shoot: Animation;
				Idle: Animation;
				Trigger: Animation;
				Inspect: Animation;
				Equip: Animation;
				Reload: Animation;
			};
			Window: MeshPart;
			Data: ModuleScript;
			Grip: MeshPart;
			Sounds: Folder & {
				MagOut: Sound;
				EmptyClick: Sound;
				MagIn: Sound;
				Fire: Sound & {
					EqualizerSoundEffect: EqualizerSoundEffect;
				};
				SlidePull: Sound;
				AimUp: Sound;
				SlideRelease: Sound;
				ChangeFiremode: Sound;
				AimDown: Sound;
			};
			["Rear Sight"]: MeshPart;
			Trigger: Part & {
				["Forward Assist"]: Weld;
				TriggerMesh: Weld;
				Window: Weld;
				["Handguard Details"]: Weld;
				Muzzle: Attachment & {
					Shockwave: ParticleEmitter;
					BarrelSmoke: ParticleEmitter;
					Sparks: ParticleEmitter;
					SideGas: ParticleEmitter;
					ForwardGas: ParticleEmitter;
					Flash: ParticleEmitter;
				};
				["Rear Sight"]: Weld;
				ViewModel: Motor6D;
				["Catch Rig"]: Weld;
				Chamber: Attachment & {
					Smoke: ParticleEmitter;
				};
				Bolt: Weld;
				["Firemode Switch"]: Weld;
				Stock: Weld;
				Barrel: Weld;
				Mag: Weld;
				["Buffer Tube"]: Weld;
				ChargingHandle: Weld;
				Details: Weld;
				["Handguard Part2"]: Weld;
				Receiver: Weld;
				["Handguard Part1"]: Weld;
				["Release Rig"]: Weld;
				["Front Sight"]: Weld;
				["Gas Tube"]: Weld;
				Grip: Weld;
			};
			["Buffer Tube"]: MeshPart;
			["Catch Rig"]: MeshPart;
			Bolt: MeshPart & {
				Bolt: Motor6D;
			};
			["Firemode Switch"]: MeshPart & {
				["Firemode Switch"]: Motor6D;
			};
			["Handguard Details"]: MeshPart;
			Stock: MeshPart;
			Offsets: Folder & {
				Aim: CFrameValue;
			};
			Mag: MeshPart & {
				Mag: Motor6D;
				Bullets: Weld;
			};
			["Handguard Part1"]: MeshPart;
			CFrameManipulators: Folder;
			ChargingHandle: MeshPart & {
				ChargingHandle: Motor6D;
			};
			["Front Sight"]: MeshPart;
			["Handguard Part2"]: MeshPart;
			Receiver: MeshPart;
			["Gas Tube"]: MeshPart;
			["Release Rig"]: MeshPart;
			Barrel: MeshPart;
			Details: MeshPart;
			Bullets: MeshPart;
		};
	};
	VFX: Folder & {
		Bullet: Part & {
			PointLight: PointLight;
			BulletTrace: Beam;
		};
		Shells: Folder & {
			["5.56"]: MeshPart & {
				SurfaceAppearance: SurfaceAppearance;
			};
		};
		Blood: ParticleEmitter;
		BulletImpacts: Folder & {
			Grass: Folder & {
				Grass: ParticleEmitter;
				Smoke: ParticleEmitter;
			};
			Glass: Folder & {
				Smoke: ParticleEmitter;
			};
			Neon: Folder & {
				Smoke: ParticleEmitter;
			};
			Sand: Folder & {
				Smoke: ParticleEmitter;
			};
			Ice: Folder & {
				Smoke: ParticleEmitter;
			};
			WoodPlanks: Folder & {
				Smoke3: ParticleEmitter;
				Smoke: ParticleEmitter;
			};
			Brick: Folder & {
				Smoke: ParticleEmitter;
			};
			Water: Folder & {
				Water2: ParticleEmitter & {
					EmitCount: NumberValue;
				};
				Water1: ParticleEmitter;
			};
			DiamondPlate: Folder & {
				Spark3: ParticleEmitter;
				Spark1: ParticleEmitter;
				Smoke: ParticleEmitter;
				Spark2: ParticleEmitter;
			};
			Default: Folder & {
				Smoke: ParticleEmitter;
			};
			CorrodedMetal: Folder & {
				Spark3: ParticleEmitter;
				Spark1: ParticleEmitter;
				Smoke: ParticleEmitter;
				Spark2: ParticleEmitter;
			};
			Concrete: Folder & {
				Smoke: ParticleEmitter;
			};
			Human: Folder & {
				Hit2: ParticleEmitter;
				Hit1: ParticleEmitter;
			};
			Wood: Folder & {
				Smoke3: ParticleEmitter;
				Smoke: ParticleEmitter;
			};
			Metal: Folder & {
				Spark3: ParticleEmitter;
				Spark1: ParticleEmitter;
				Smoke: ParticleEmitter;
				Spark2: ParticleEmitter;
			};
		};
	};
	rbxts_include: Folder & {
		RuntimeLib: ModuleScript;
		Promise: ModuleScript;
		node_modules: Folder & {
			["@flamework"]: Folder & {
				core: Folder & {
					out: ModuleScript & {
						reflect: ModuleScript;
						modding: ModuleScript;
						flamework: ModuleScript;
					};
				};
				components: Folder & {
					out: ModuleScript;
				};
				networking: Folder & {
					out: ModuleScript & {
						events: Folder & {
							createClientHandler: ModuleScript;
							createServerHandler: ModuleScript;
							createNetworkingEvent: ModuleScript;
						};
						functions: Folder & {
							createClientHandler: ModuleScript;
							createNetworkingFunction: ModuleScript;
							createServerHandler: ModuleScript;
							errors: ModuleScript;
						};
						handlers: ModuleScript;
						middleware: Folder & {
							createMiddlewareProcessor: ModuleScript;
							skip: ModuleScript;
						};
						util: Folder & {
							populateInstanceMap: ModuleScript;
						};
					};
				};
			};
			["@rbxts"]: Folder & {
				fastcast: Folder & {
					node_modules: Folder & {
						["@rbxts"]: Folder & {
							["compiler-types"]: Folder & {
								types: Folder;
							};
						};
					};
					src: ModuleScript & {
						TypeMarshaller: ModuleScript;
						Table: ModuleScript;
						ActiveCast: ModuleScript;
						TypeDefinitions: ModuleScript;
						typings: Folder;
						Signal: ModuleScript;
					};
				};
				services: ModuleScript;
				t: Folder & {
					lib: Folder & {
						ts: ModuleScript;
					};
				};
				["compiler-types"]: Folder & {
					types: Folder;
				};
				["object-utils"]: ModuleScript;
				partcache: Folder & {
					out: ModuleScript & {
						Table: ModuleScript;
					};
				};
				janitor: Folder & {
					src: ModuleScript & {
						GetPromiseLibrary: ModuleScript;
						RbxScriptConnection: ModuleScript;
						Symbol: ModuleScript;
					};
				};
				signal: ModuleScript;
				maid: Folder & {
					Maid: ModuleScript;
				};
				types: Folder & {
					include: Folder & {
						generated: Folder;
					};
				};
			};
		};
	};
}
