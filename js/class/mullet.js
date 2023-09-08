class Mullet {
  constructor(pos, game) {
    this.game = game;
    this.colors = {
      hex: "#EB5E28",
      rgb: "235, 94, 40,",
    };
    this.size = {
      w: 50,
      h: 10,
      r: 10,
    };
    this.pos = {
      x: pos.x - this.size.w / 2,
      y: pos.y - this.size.h / 2,
    };
    this.nextPos = {
      x: this.pos.x,
      y: this.pos.y,
    };
    this.currentMousePos = {
      x: 0,
      y: 0,
    };
    this.stats = {
      hp: 10,
      maxHp: 100,
      str: 2,
      exp: 0,
      expNeed: 100,
      lvl: 1,
      followSpeed: 0.025,
      curiousSpeed: 0.01,
      fleeSpeed: 0.1,
      nextPosSpeed: 5,
      angle: 0,
      attentionSpan: 50,
      curiosity: 25,
    };
    this.collisionCircle = {
      radius: this.size.w * 0.75,
      growSpeed: this.size.w / 150,
      alphaShrinkSpeed: this.size.w / 150 / (this.size.w * 2.5),
      alpha: 1,
    };
    this.boundaries = {
      left: this.collisionCircle.radius,
      right: this.game.canvas.width - this.collisionCircle.radius,
      up: this.collisionCircle.radius,
      down: this.game.canvas.height - this.collisionCircle.radius,
    };
    this.curiousDirections = [
      "LEFT",
      "RIGHT",
      "UP",
      "DOWN",
      "DOWN",
      "RIGHT",
      "LEFT",
      "UP",
      "LEFT",
      "UP",
      "RIGHT",
      "DOWN",
    ];
    this.currentCuriousDirection = "RIGHT";
    this.nextPosMove = {
      LEFT: {
        on: () => {
          if (this.nextPos.x < this.boundaries.left) {
            this.nextPos.x += this.stats.nextPosSpeed;
            this.currentCuriousDirection = "RIGHT";
          } else {
            this.nextPos.x -= this.stats.nextPosSpeed;
          }
        },
      },
      RIGHT: {
        on: () => {
          if (this.nextPos.x > this.boundaries.right) {
            this.nextPos.x -= this.stats.nextPosSpeed;
            this.currentCuriousDirection = "LEFT";
          } else {
            this.nextPos.x += this.stats.nextPosSpeed;
          }
        },
      },
      UP: {
        on: () => {
          if (this.nextPos.y < this.boundaries.up) {
            this.nextPos.y += this.stats.nextPosSpeed;
            this.currentCuriousDirection = "DOWN";
          } else {
            this.nextPos.y -= this.stats.nextPosSpeed;
          }
        },
      },
      DOWN: {
        on: () => {
          if (this.nextPos.y > this.boundaries.down) {
            this.nextPos.y -= this.stats.nextPosSpeed;
            this.currentCuriousDirection = "UP";
          } else {
            this.nextPos.y += this.stats.nextPosSpeed;
          }
        },
      },
    };
    this.currentBehaviour = "FOLLOW";
    this.behaviours = {
      FLEE: {
        on: () => {
          this.move(this.stats.fleeSpeed);
        },
      },
      CURIOUS: {
        on: () => {
          // if (this.stats.curiosity >= this.stats.attentionSpan) {
          //   this.getCuriousPos();
          //   this.stats.curiosity = 0;
          // } else {
          //   this.stats.curiosity += 0.25;
          // }

          if (this.stats.curiosity >= this.stats.attentionSpan) {
            this.currentCuriousDirection =
              this.curiousDirections[
                Math.floor(Math.random() * this.curiousDirections.length)
              ];
            this.stats.curiosity = 0;
          } else {
            this.stats.curiosity += 0.25;
          }

          this.nextPosMove[this.currentCuriousDirection].on();

          this.stats.angle = Math.atan2(
            this.nextPos.y - this.pos.y,
            this.nextPos.x - this.pos.x
          );

          this.move(this.stats.curiousSpeed);
        },
      },
      FOLLOW: {
        on: () => {
          this.move(this.stats.followSpeed);
        },
      },
    };
    this.moving = false;
    this.redhan = [];
    this.timeToSpawnRedhan = 0;
    this.createRedhan();
  }

  draw(ctx) {
    for (let i = 0; i < this.redhan.length; i++) {
      if (!this.redhan[i].free) {
        this.redhan[i].update();
        this.redhan[i].draw(ctx);
      }

      if (this.redhan[i].free && this.timeToSpawnRedhan >= 2 && this.moving) {
        this.redhan[i].spawn(
          {
            x: this.pos.x,
            y: this.pos.y,
          },
          {
            x: -Math.cos(this.stats.angle) + Math.random() * 2 - 1,
            y: -Math.sin(this.stats.angle) + Math.random() * 2 - 1,
          }
        );
        this.timeToSpawnRedhan = 0;
        break;
      } else {
        this.timeToSpawnRedhan += 0.01;
      }
    }

    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.stats.angle);
    ctx.fillStyle = this.colors.hex;
    ctx.beginPath();
    ctx.roundRect(
      0 - this.size.w,
      0 - this.size.h,
      this.size.w,
      this.size.h,
      this.size.r
    );
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.strokeStyle = `rgba(${this.colors.rgb}${this.collisionCircle.alpha})`;
    ctx.arc(
      0 - this.size.w / 2,
      0 - this.size.h / 2,
      this.collisionCircle.radius,
      0,
      Math.PI * 2
    );
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
  }

  update() {
    if (this.collisionCircle.alpha < 0.2) {
      this.collisionCircle.alpha = 1;
    } else {
      this.collisionCircle.alpha -= this.collisionCircle.alphaShrinkSpeed;
    }

    if (
      Math.abs(this.nextPos.x - this.pos.x) > this.size.w * 3.5 ||
      Math.abs(this.nextPos.y - this.pos.y) > this.size.w * 3.5
    ) {
      this.moving = true;
    } else {
      this.moving = false;
    }

    this.behaviours[this.currentBehaviour].on();
  }

  getCuriousPos() {
    // this.nextPos.x = Math.floor(
    //   Math.random() * this.boundaries.right + this.boundaries.left
    // );
    // this.nextPos.y = Math.floor(
    //   Math.random() * this.boundaries.down + this.boundaries.up
    // );
  }

  move(speed) {
    this.pos.x += (this.nextPos.x - this.pos.x) * speed;
    this.pos.y += (this.nextPos.y - this.pos.y) * speed;
  }

  seekMouse(mousePos) {
    this.currentMousePos.x = mousePos.x;
    this.currentMousePos.y = mousePos.y;

    const angle = Math.atan2(mousePos.y - this.pos.y, mousePos.x - this.pos.x);

    if (this.currentBehaviour == "FOLLOW" || this.currentBehaviour === "FLEE") {
      this.nextPos.x = mousePos.x;
      this.nextPos.y = mousePos.y;
      this.stats.angle = angle;
    }
  }

  toggleBehaviour(behaviour) {
    if (behaviour == "FLEE" || behaviour == "FOLLOW") {
      const angle = Math.atan2(
        this.currentMousePos.y - this.pos.y,
        this.currentMousePos.x - this.pos.x
      );
      this.stats.angle = angle;
      this.nextPos.x = this.currentMousePos.x;
      this.nextPos.y = this.currentMousePos.y;
    }

    this.currentBehaviour = behaviour;
  }

  createRedhan() {
    for (let i = 0; i < 20; i++) {
      this.redhan.push(
        new Redhan(
          {
            x: 0,
            y: 0,
          },
          {
            x: 0,
            y: 0,
          }
        )
      );
    }
  }
}
