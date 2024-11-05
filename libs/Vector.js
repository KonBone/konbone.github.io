class Vector {
    constructor(x, y, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    dot(vector) {
        return this.x * vector.x + this.y * vector.y + this.z * vector.y;
    }

    length() {
        return Math.sqrt(this.dot(this));
    }
}