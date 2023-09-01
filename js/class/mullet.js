class Mullet {
  constructor({ pos, game }) {
    this.size = {
      w: 30,
      h: 10,
    };
    this.pos = {
      x: pos.x - this.size.w / 2,
      y: pos.y - this.size.h / 2,
    };
    this.nextPos = {
      x: this.pos.x,
      y: this.pos.y,
    };
    this.game = game;
    this.stats = {
      hp: 10,
      maxHp: 100,
      str: 2,
      exp: 0,
      expNeed: 100,
      lvl: 1,
      speed: 0.025,
      fleeSpeed: 0.1,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.follow = true;
    this.flee = false;
    this.curious = false;
  }

  draw(ctx) {
    ctx.fillStyle = "#A9E4EF";
    ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
  }

  update() {
    if (this.flee) {
      this.pos.x += (this.nextPos.x - this.pos.x) * this.stats.fleeSpeed;
      this.pos.y += (this.nextPos.y - this.pos.y) * this.stats.fleeSpeed;
    } else if (this.curious) {
      return;
    } else {
      this.pos.x += (this.nextPos.x - this.pos.x) * this.stats.speed;
      this.pos.y += (this.nextPos.y - this.pos.y) * this.stats.speed;
    }
  }

  seekMouse(mousePos) {
    if (this.follow && !this.curious) {
      this.nextPos = mousePos;
    }
  }

  toggleFollow() {
    if (this.follow && !this.flee) {
      this.follow = false;
      this.curious = true;
    } else if (!this.follow && !this.flee) {
      this.follow = true;
      this.curious = false;
    }
  }
}
