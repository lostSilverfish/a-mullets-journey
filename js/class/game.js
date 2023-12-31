class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.mullet = new Mullet(
      {
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
      },
      this
    );
  }

  draw() {
    this.mullet.draw(this.ctx);
  }

  update() {
    this.mullet.update();
  }
}
