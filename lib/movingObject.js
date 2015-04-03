(function () {
  "use strict";

  if (typeof(window.Asteroids) === "undefined") {
    window.Asteroids = {};
  }

  var MovingObject = Asteroids.MovingObject = function (keys) {
    var key

    for (key in keys) {
      this[key] = keys[key];
    }
  };

  MovingObject.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    ctx.arc(
      this.pos.x,
      this.pos.y,
      this.r,
      0,
      2 * Math.PI,
      false
    );

    ctx.fill();
  };

  MovingObject.prototype.move = function () {
    this.pos.add(this.vel());
  };

  MovingObject.prototype.isCollidedWith = function (otherObject) {
    var collided = false;

    if (otherObject instanceof Asteroids.Ship) {
      collided = SAT.testPolygonCircle(otherObject.polygon, this.circle);
    } else {
      collided = SAT.testCircleCircle(this.polygon, otherObject.circle);
    }

    return collided;
  };

  MovingObject.prototype.isWrappable = function () {
    return true
  };

  MovingObject.prototype.vel = function () {
    return new SAT.V(this.speed*this.head[0], this.speed*this.head[1]);
  };
})();
