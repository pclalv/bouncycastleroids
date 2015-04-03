"use strict";

(function () {
  if (typeof window.Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Bullet = Asteroids.Bullet = function (keys) {
    keys.speed  = Bullet.SPEED;
    keys.color  = Bullet.COLOR;
    keys.r      = Bullet.RADIUS;
    keys.pos    = new SAT.V(keys.pos[0], keys.pos[1]);
    keys.circle = new SAT.Circle(keys.pos.clone(), keys.r);

    Asteroids.MovingObject.call(this, keys);

    setTimeout(function () {
      this.remove = true;
    }.bind(this), 5000)
  };

  Asteroids.Util.inherits(Bullet, Asteroids.MovingObject);

  Bullet.COLOR  = 'black';
  Bullet.RADIUS = 5;
  Bullet.SPEED  = 6;

  Bullet.prototype.isWrappable = function () {
    return this.poweredUp;
  };
})();
