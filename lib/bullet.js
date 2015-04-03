"use strict";

(function () {
  if (typeof window.Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Bullet = Asteroids.Bullet = function (keys) {
    keys.speed  = Bullet.SPEED;
    keys.color  = Bullet.COLOR;
    keys.r      = Bullet.RADIUS;
    keys.circle = new SAT.Circle(keys.pos, keys.r);

    Asteroids.MovingObject.call(this, keys);

    setTimeout(function () {
      this.remove = true;
    }.bind(this), 5000)
  };

  Asteroids.Util.inherits(Bullet, Asteroids.MovingObject);

  Bullet.COLOR  = 'black';
  Bullet.RADIUS = 2;
  Bullet.SPEED  = 6;

  Bullet.prototype.isWrappable = function () {
    return this.poweredUp;
  };
})();
