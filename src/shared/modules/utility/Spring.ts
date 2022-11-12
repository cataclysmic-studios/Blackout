import isNaN from "./IsNaN";

export default class Spring {
    static readonly iterations = 8;
    public target = new Vector3();
    public position = new Vector3();
    public velocity = new Vector3();

    public constructor(
        public mass = 5, 
        public force = 50, 
        public damping = 4, 
        public speed = 4
    ) {}

    public shove(force: Vector3): void {
        let { X: x, Y: y, Z: z } = force;
        if (isNaN(x) || x === math.huge || x === -math.huge)
            x = 0;
        if (isNaN(y) || y === math.huge || y === -math.huge)
            y = 0;
        if (isNaN(z) || z === math.huge || z === -math.huge)
            z = 0;

        this.velocity = this.velocity.add(new Vector3(x, y, z));
    }

    public update(dt: number): Vector3 {
        const scaledDt: number = math.min(dt, 1) * this.speed / Spring.iterations;

        for (let i = 0; i < Spring.iterations; i++) {
            const force: Vector3 = this.target.sub(this.position);
            let accel: Vector3 = force
                .mul(this.force)
                .div(this.mass);
            
            accel = accel.sub(this.velocity.mul(this.damping));
            this.velocity = this.velocity.add(accel.mul(scaledDt));
            this.position = this.position.add(this.velocity.mul(scaledDt));
        }

        return this.position
    }
}