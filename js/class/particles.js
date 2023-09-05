class Particles {
  constructor() {
    this.alpha = 1;
    this.free = true;
  }

  update() {
    if (!this.free) {
      this.pos.x += this.velocity.x;
      this.pos.y += this.velocity.y;

      this.alpha -= 0.01;
    }

    if (this.alpha < 0) {
      this.reset();
    }
  }

  reset() {
    this.free = true;
  }

  spawn(pos, velocity) {
    this.pos.x = pos.x;
    this.pos.y = pos.y;

    this.velocity.x = velocity.x;
    this.velocity.y = velocity.y;

    this.free = false;
    this.alpha = 1;
  }
}

class Redhan extends Particles {
  constructor(velocity, pos) {
    super();
    this.radius = Math.floor(Math.random() * 3);
    this.pos = pos;
    this.velocity = velocity;
    this.colors = {
      hex: "#9bd1e8",
      rgb: "155, 209, 232,",
    };
    this.radius = Math.ceil(Math.random() * 3 + 1);
  }

  draw(ctx) {
    if (!this.free) {
      ctx.save();
      ctx.fillStyle = `rgba(${this.colors.rgb}${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }
  }
}
