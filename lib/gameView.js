"use strict";

(function () {
  if (typeof(window.Asteroids) === "undefined") {
    window.Asteroids = {};
  }

  var GameView = Asteroids.GameView = function(game, ctx) {
    this.game = game;
    this.ctx = ctx;
  };

  GameView.prototype.start = function () {
    this.stepIntervalId = setInterval(function() {
      this.game.step();
      this.game.draw(this.ctx);
      this.game.handleInputs();
    }.bind(this), 10);
  };

  GameView.prototype.over = function () {
    var intervalId;

    clearInterval(this.stepIntervalId);
    ctx.font = "48px sans-serif";
    ctx.textBaseline = 'middle';
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", Asteroids.Game.DIM_X/2, Asteroids.Game.DIM_Y/3);
    ctx.font = "36px sans-serif";
    ctx.fillText("Press the spacebar to play again.", Asteroids.Game.DIM_X/2, 2*Asteroids.Game.DIM_Y/3);

    intervalId = setInterval(function () {
      if (key.isPressed("space")) {
        clearInterval(intervalId);
        key.unbind('space');
        ctx.textBaseline = 'alphebetic';
        ctx.textAlign = "start";
        this.game.restart();
        this.start();
      }
    }.bind(this), 10);
  };

  GameView.prototype.levelUp = function () {
    var intervalId;

    clearInterval(this.stepIntervalId);
    ctx.font = "48px sans-serif";
    ctx.textBaseline = 'middle';
    ctx.textAlign = "center";
    ctx.fillText("LEVEL UP!", Asteroids.Game.DIM_X/2, Asteroids.Game.DIM_Y/3);
    ctx.font = "36px sans-serif";
    ctx.fillText("Press the spacebar to continue.", Asteroids.Game.DIM_X/2, 2*Asteroids.Game.DIM_Y/3);

    intervalId = setInterval(function () {
      if (key.isPressed("space")) {
        clearInterval(intervalId);
        key.unbind('space');
        ctx.textBaseline = 'alphebetic';
        ctx.textAlign = "start";
        this.game.levelUp();
        this.start();
      }
    }.bind(this), 10);
  }

})();
