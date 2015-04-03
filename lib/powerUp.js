"use strict";

(function () {
  if (typeof window.Asteroids === 'undefined') {
    window.Asteroids = {};
  }

  var PowerUp = Asteroids.PowerUp = function (keys) {
    keys.r = PowerUp.RADIUS;
    keys.color = PowerUp.COLOR;
    keys.head = [0, 0];
    keys.speed = 0;
    keys.pos = new SAT.V(keys.pos[0], keys.pos[1]);
    keys.circle = new SAT.Circle(keys.pos, keys.r);

    Asteroids.MovingObject.call(this, keys);

    setTimeout(function () {
      this.remove = true;
    }.bind(this), 3000)
  };

  PowerUp.COLOR = 'yellow';
  PowerUp.RADIUS = 5;

  Asteroids.Util.inherits(PowerUp, Asteroids.MovingObject);
})();
