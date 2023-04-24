import { Janitor } from '@rbxts/janitor';
import Roact, { PropsWithChildren, Ref } from '@rbxts/roact';

export interface StatefulTextProps {
	InitialText?: string;
	LabelProperties: Partial<WritableInstanceProperties<TextLabel>>;
	Ref?: Ref<TextLabel>;
}

interface State {
	LinkedText: string;
}

export default class StatefulText<P = {}> extends Roact.Component<
	PropsWithChildren<StatefulTextProps & P>,
	State
> {
	protected readonly janitor = new Janitor();

	public update(text: string): void {
		this.setState({ LinkedText: text });
	}

	protected willUnmount(): void {
		this.janitor.Destroy();
	}

	protected didMount(): void {
		this.update(this.props.InitialText ?? '...');
	}

	public render() {
		return (
			<textlabel
				{...this.props.LabelProperties}
				Ref={this.props.Ref}
				Text={this.state.LinkedText}
			>
				{this.props[Roact.Children]}
			</textlabel>
		);
	}
}
