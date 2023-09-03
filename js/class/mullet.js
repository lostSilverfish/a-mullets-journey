class Mullet {
  constructor({ pos, game }) {
    this.colors = {
      hex: "#EB5E28",
      rgb: "235, 94, 40,",
    };
    this.size = {
      w: 50,
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
      followSpeed: 0.025,
      curiousSpeed: 0.01,
      fleeSpeed: 0.1,
      angle: 0,
      attentionSpan: 50,
      curiosity: 25,
    };
    this.collisionCircle = {
      radius: this.size.w * 0.75,
      growSpeed: this.size.w / 150,
      alphaShrinkSpeed: this.size.w / 150 / (this.size.w * 2.5),
      alpha: 1,
      // ripples: {
      //   1: {
      //     radius: 0,
      //     alpha: 1,
      //   },
      // 2: {
      //   radius: this.size.w * 0.5,
      //   alpha: 1,
      // },
      // 3: {
      //   radius: this.size.w,
      //   alpha: 1,
      // },
      // 4: {
      //   radius: this.size.w * 1.5,
      //   alpha: 1,
      // },
      // },
    };
    this.boundaries = {
      left: this.collisionCircle.radius,
      right: this.game.canvas.width - this.collisionCircle.radius,
      up: this.collisionCircle.radius,
      down: this.game.canvas.height - this.collisionCircle.radius,
    };
    this.currentBehaviour = "FOLLOW";
    // this.directions = ["LEFT", "RIGHT", "UP", "DOWN"];
    // this.currentDirection = "";
    // this.curiosityBehaviours = {
    //   LEFT: {
    //     on: () => {
    //       if (this.pos.x - this.collisionCircle.radius < this.boundaries.left) {
    //         this.pos.x = this.boundaries.left;
    //       } else {
    //         this.nextPos.x -= this.stats.curiousSpeed;
    //       }
    //     },
    //   },
    //   RIGHT: {
    //     on: () => {
    //       if (
    //         this.pos.x + this.collisionCircle.radius >
    //         this.boundaries.right
    //       ) {
    //         this.pos.x = this.boundaries.right;
    //       } else {
    //         this.nextPos.x += this.stats.curiousSpeed;
    //       }
    //     },
    //   },
    //   UP: {
    //     on: () => {
    //       if (this.pos.y - this.collisionCircle.radius < this.boundaries.up) {
    //         this.pos.y = this.boundaries.up;
    //       } else {
    //         this.nextPos.y -= this.stats.curiousSpeed;
    //       }
    //     },
    //   },
    //   DOWN: {
    //     on: () => {
    //       if (this.pos.y + this.collisionCircle.radius > this.boundaries.down) {
    //         this.pos.y = this.boundaries.down;
    //       } else {
    //         this.nextPos.y += this.stats.curiousSpeed;
    //       }
    //     },
    //   },
    // };
    this.behaviours = {
      FLEE: {
        on: () => {
          this.move(this.stats.fleeSpeed);
        },
      },
      CURIOUS: {
        on: () => {
          // this.currentDirection =
          //   this.directions[Math.floor(Math.random() * this.directions.length)];

          // if (this.stats.curiosity >= this.stats.attentionSpan) {
          //   this.currentDirection =
          //     this.directions[
          //       Math.floor(Math.random() * this.directions.length)
          //     ];
          // } else {
          //   this.stats.curiosity += 0.01;
          // }

          // this.curiosityBehaviours[this.currentDirection].on();

          if (this.stats.curiosity >= this.stats.attentionSpan) {
            this.getCuriousPos();
            this.stats.curiosity = 0;
          } else {
            this.stats.curiosity += 0.25;
          }

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

    // this.follow = true;
    // this.flee = false;
    // this.curious = false;
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.colors.hex;
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.stats.angle);
    ctx.fillRect(0 - this.size.w, 0 - this.size.h, this.size.w, this.size.h);

    // this.spawnRipples(ctx);

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
    // if (this.flee) {
    //   this.pos.x += (this.nextPos.x - this.pos.x) * this.stats.fleeSpeed;
    //   this.pos.y += (this.nextPos.y - this.pos.y) * this.stats.fleeSpeed;
    // } else if (this.curious) {
    // } else {
    //   this.pos.x += (this.nextPos.x - this.pos.x) * this.stats.followSpeed;
    //   this.pos.y += (this.nextPos.y - this.pos.y) * this.stats.followSpeed;
    // }

    // if (this.collisionCircle.alpha < 0.2) {
    //   this.collisionCircle.alpha = 1;
    // } else {
    //   this.collisionCircle.alpha -= this.collisionCircle.alphaShrinkSpeed;
    // }

    this.behaviours[this.currentBehaviour].on();

    // this.growRipples();
  }

  getCuriousPos() {
    this.nextPos.x = Math.floor(
      Math.random() * this.boundaries.right + this.boundaries.left
    );
    this.nextPos.y = Math.floor(
      Math.random() * this.boundaries.down + this.boundaries.up
    );
  }

  move(speed) {
    this.pos.x += (this.nextPos.x - this.pos.x) * speed;
    this.pos.y += (this.nextPos.y - this.pos.y) * speed;
  }

  // growRipples() {
  // if more ripples
  //   // for (let ripple in this.collisionCircle.ripples) {
  //   //   const currentRipple = this.collisionCircle.ripples[ripple];
  //   //   if (currentRipple.radius >= this.collisionCircle.radius) {
  //   //     currentRipple.radius = 0;
  //   //     currentRipple.alpha = 1;
  //   //   } else {
  //   //     currentRipple.radius += this.collisionCircle.growSpeed;
  //   //     currentRipple.alpha -= this.collisionCircle.alphaShrinkSpeed;
  //   //   }
  //   // }

  // if one ripple
  //   if (this.collisionCircle.ripples[1].radius > this.collisionCircle.radius) {
  //     this.collisionCircle.ripples[1].radius = 0;
  //     this.collisionCircle.ripples[1].alpha = 0.25;
  //   } else {
  //     this.collisionCircle.ripples[1].radius += this.collisionCircle.growSpeed;
  //     this.collisionCircle.ripples[1].alpha +=
  //       this.collisionCircle.alphaShrinkSpeed;
  //   }

  //   if (
  //     this.collisionCircle.ripples[1].radius === this.collisionCircle.radius
  //   ) {
  //     this.collisionCircle.ripples[1].alpha = 1;
  //   }
  // }

  // spawnRipples(ctx) {
  // if more ripple
  //   // for (let ripple in this.collisionCircle.ripples) {
  //   //   const currentRipple = this.collisionCircle.ripples[ripple];
  //   //   ctx.beginPath();
  //   //   ctx.strokeStyle = `rgba(${this.colors.rgb}${currentRipple.alpha})`;
  //   //   ctx.arc(
  //   //     0 - this.size.w / 2,
  //   //     0 - this.size.h / 2,
  //   //     currentRipple.radius,
  //   //     0,
  //   //     Math.PI * 2
  //   //   );
  //   //   ctx.stroke();
  //   //   ctx.closePath();
  //   // }

  // if one ripple
  //   ctx.beginPath();
  //   ctx.strokeStyle = `rgba(${this.colors.rgb}${this.collisionCircle.ripples[1].alpha})`;
  //   ctx.arc(
  //     0 - this.size.w / 2,
  //     0 - this.size.h / 2,
  //     this.collisionCircle.ripples[1].radius,
  //     0,
  //     Math.PI * 2
  //   );
  //   ctx.stroke();
  //   ctx.closePath();
  // }

  seekMouse(mousePos, angle) {
    // if (this.follow && !this.curious) {
    //   this.nextPos = mousePos;
    //   this.stats.angle = angle;
    // }

    if (this.currentBehaviour == "FOLLOW" || this.currentBehaviour === "FLEE") {
      this.nextPos = mousePos;
      this.stats.angle = angle;
    }
  }

  toggleFollow() {
    // if (this.follow && !this.flee) {
    //   this.follow = false;
    //   this.curious = true;
    // } else if (!this.follow && !this.flee) {
    //   this.follow = true;
    //   this.curious = false;
    // }
    if (this.currentBehaviour !== "FOLLOW") {
      this.currentBehaviour = "FOLLOW";
    } else {
      this.currentBehaviour = "CURIOUS";
    }
  }
}
