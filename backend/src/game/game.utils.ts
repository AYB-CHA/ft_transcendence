export type VecType = {
  x: number;
  y: number;
  z: number;
};

export function Vec(x = 0, y = 0, z = 0) {
  return {
    x,
    y,
    z,

    clone: function () {
      return Vec(this.x, this.y, this.z);
    },
    zero: function () {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      return this;
    },
    mul: function (num: number) {
      const res = Vec();
      res.x = this.x * num;
      res.y = this.y * num;
      res.z = this.z * num;
      return res;
    },
    add: function (to: VecType) {
      const res = Vec();
      res.x = this.x + to.x;
      res.y = this.y + to.y;
      res.z = this.z + to.z;
      return res;
    },

    div: function (num: number) {
      const res = Vec();
      res.x = this.x / num;
      res.y = this.y / num;
      res.z = this.z / num;
      return res;
    },

    cross: function (to: VecType) {
      const res = Vec();
      res.x = this.y * to.z - this.z * to.y;
      res.y = this.z * to.x - this.x * to.z;
      res.z = this.x * to.y - this.y * to.x;
      return res;
    },

    dot: function (to: VecType) {
      return this.x * to.x + this.y * to.y + this.z * to.z;
    },

    dot3: function (to: [number, number, number]) {
      return this.x * to[0] + this.y * to[1] + this.z * to[2];
    },

    reflect: function (n: VecType) {
      const res = Vec();
      const dot = this.dot(n);
      res.x = this.x - 2 * dot * n.x;
      res.y = this.y - 2 * dot * n.y;
      res.z = this.z - 2 * dot * n.z;
      return res;
    },

    reflect3: function (n: [number, number, number]) {
      const res = Vec();
      const dot = this.dot3(n);
      res.x = this.x - 2 * dot * n[0];
      res.y = this.y - 2 * dot * n[1];
      res.z = this.z - 2 * dot * n[2];
      return res.norm();
    },

    mag: function () {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },

    norm: function () {
      const mag = this.mag();
      return this.div(mag);
    },

    pure: function () {
      return [this.x, this.y, this.z];
    },
  };
}

export type number3 = [number, number, number];
export type Vec3Type = ReturnType<typeof Vec>;
export type DistanceResult = {
  dis: number;
  reflectNormal: number3;
};

const EPSILON = 0.0001;

export function add_in(x: number, add: number, min: number, max: number) {
  if (x + add < min) return min;
  if (x + add > max) return max;
  return x + add;
}

export function between(x: number, min: number, max: number) {
  return x >= min && x <= max;
}

export function getP(
  arr: DistanceResult[],
  origin: Vec3Type,
  dir: Vec3Type,
  forward: number3,
  boundary: number3,
) {
  const r1 = origin.dot3(forward);
  const r2 = dir.dot3(forward);
  // dot for array numbers
  const r3 = boundary.map((x, i) => x * forward[i]).reduce((a, b) => a + b, 0);
  const t = (-r1 + r3) / r2;
  if (t > EPSILON)
    arr.push({
      dis: t,
      reflectNormal: forward,
    });
}
