"use strict";

onload = () => {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;

  ctx.scale(devicePixelRatio, devicePixelRatio);

  const game = new Game(canvas, ctx);

  (function animate() {
    ctx.reset();

    game.update();
    game.draw();

    requestAnimationFrame(animate);
  })();

  addEventListener("mousemove", (e) => {
    const mousePos = {
      x: e.clientX * devicePixelRatio,
      y: e.clientY * devicePixelRatio,
    };

    game.mullet.seekMouse(mousePos);
  });

  addEventListener("keypress", (e) => {
    if (e.key === " ") {
      if (
        game.mullet.currentBehaviour === "CURIOUS" ||
        game.mullet.currentBehaviour === "FLEE"
      ) {
        game.mullet.toggleBehaviour("FOLLOW");
      } else {
        game.mullet.toggleBehaviour("CURIOUS");
      }
    } else if (e.key === "f") {
      if (
        game.mullet.currentBehaviour === "CURIOUS" ||
        game.mullet.currentBehaviour === "FOLLOW"
      ) {
        game.mullet.toggleBehaviour("FLEE");
      } else {
        game.mullet.toggleBehaviour("CURIOUS");
      }
    }
  });
};
