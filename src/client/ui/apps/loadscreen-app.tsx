import { AppScene } from "shared/enums";
import { App } from "client/controllers/apps";
import Roact from "@rbxts/roact";

const { FontWeight, FontStyle } = Enum;
const ubuntu = new Font("rbxasset://fonts/families/Ubuntu.json", FontWeight.Medium, FontStyle.Normal);

@App({
	name: "LoadScreen",
	requiredScene: AppScene.Loading,
	ignoreGuiInset: true,
	zIndex: 2
})
export class LoadScreenApp extends Roact.Component {
	public render() {
		return (
			<>
				<frame Key="Background" BackgroundColor3={Color3.fromRGB(54, 54, 54)} Size={new UDim2(1, 0, 1, 0)}>
				<frame
					Key="Line"
					AnchorPoint={new Vector2(0.5, 1)}
					BackgroundColor3={Color3.fromRGB(232, 232, 232)}
					BackgroundTransparency={0.3}
					BorderSizePixel={0}
					Position={new UDim2(0.5, 0, 0.69, 0)}
					Size={new UDim2(0.55, 0, 0, 5)}
				>
					<uigradient
						Transparency={new NumberSequence([new NumberSequenceKeypoint(0, 1, 0), new NumberSequenceKeypoint(0.5, 0, 0), new NumberSequenceKeypoint(1, 1, 0)])}
					/>
				</frame>
				<imagelabel
					Key="Logo"
					AnchorPoint={new Vector2(0.5, 0)}
					BackgroundTransparency={1}
					Image="http://www.roblox.com/asset/?id=11532300155"
					Position={new UDim2(0.5, 0, 0.2, 0)}
					ScaleType={Enum.ScaleType.Crop}
					Size={new UDim2(0.25, 0, 0.35, 0)}
				>
					<uicorner CornerRadius={new UDim(0, 20)} />
					<uistroke Color={Color3.fromRGB(102, 102, 102)} Thickness={1.8} Transparency={0.3} />
				</imagelabel>
				<imagelabel
					Key="Title"
					AnchorPoint={new Vector2(0.5, 0)}
					BackgroundTransparency={1}
					Image="http://www.roblox.com/asset/?id=11531960984"
					Position={new UDim2(0.5, 0, 0.55, 0)}
					ScaleType={Enum.ScaleType.Fit}
					Size={new UDim2(0.445, 0, 0.137, 0)}
				/>
				<textlabel
					Key="Completion"
					AnchorPoint={new Vector2(0.5, 0)}
					BackgroundTransparency={1}
					FontFace={ubuntu}
					Position={new UDim2(0.5, 0, 0.75, 0)}
					RichText={true}
					Size={new UDim2(0.137, 0, 0.027, 0)}
					Text="1/2000"
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					TextSize={14}
					TextWrapped={true}
					ZIndex={5}
				/>
				<textlabel
					Key="Tip"
					AnchorPoint={new Vector2(0.5, 0)}
					BackgroundTransparency={1}
					FontFace={ubuntu}
					Position={new UDim2(0.5, 0, 0.7, 0)}
					RichText={true}
					Size={new UDim2(0.211, 0, 0.048, 0)}
					Text="LOADING ASSETS"
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					TextSize={14}
					TextWrapped={true}
					ZIndex={5}
				/>
				<uigradient
					Color={new ColorSequence([new ColorSequenceKeypoint(0, Color3.fromRGB(255, 255, 255)), new ColorSequenceKeypoint(1, Color3.fromRGB(191, 191, 191))])}
					Rotation={90}
				/>
			</frame>
			</>
		);
	}
}
