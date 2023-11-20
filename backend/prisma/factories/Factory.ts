export abstract class Factory<T extends { id?: I }, I = string> {
  IDs: I[] = [];

  abstract generate(): T;

  generateMany(times: number): T[] {
    return new Array<T>(times).fill(undefined).map(() => {
      const data = this.generate();
      this.IDs.push(data.id);
      return data;
    });
  }

  pickRandomId() {
    return this.IDs[Math.floor(Math.random() * this.IDs.length)];
  }
  pickRandomN(n: number) {
    return this.IDs.sort(() => Math.random() - 0.5).slice(0, n);
  }
}
