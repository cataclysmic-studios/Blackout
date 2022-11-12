export default class Wave {
    public constructor(
        public amplitude: number = 1,
        public frequency: number = 1,
        public phaseShift: number = 0,
        public verticalShift: number = 0
    ) {}

    public update(dt: number): number {
        return (this.amplitude * math.sin(this.frequency * tick() + this.phaseShift) + this.verticalShift) * 60 * dt;
    }
}