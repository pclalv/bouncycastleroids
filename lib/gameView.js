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
    setInterval(function() {
      this.game.step();
      this.game.draw(this.ctx);
    }.bind(this), 10);

    setInterval(function () {
      this.game.handleInputs();
    }.bind(this), 10);
  };

})();
