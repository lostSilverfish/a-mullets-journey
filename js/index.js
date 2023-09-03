onload = () => {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;

  ctx.scale(devicePixelRatio, devicePixelRatio);

  const game = new Game({ canvas, ctx });

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

    const angle = Math.atan2(
      mousePos.y - game.mullet.pos.y,
      mousePos.x - game.mullet.pos.x
    );

    game.mullet.seekMouse(mousePos, angle);
  });

  addEventListener("keypress", (e) => {
    if (e.key === "f") {
      game.mullet.toggleFollow();
    }
  });
};
