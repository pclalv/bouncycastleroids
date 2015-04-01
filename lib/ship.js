"use strict";

(function () {
  if (typeof(window.Asteroids) === 'undefined') {
    window.Asteroids = {};
  }

  var Ship = Asteroids.Ship = function (keys) {
    keys.color = Ship.COLOR;
    keys.numSides = 3;
    keys.head  = [0, 1];
    keys.speed = 0;
    keys.givePowerUp = false;
    keys.theta = 0;
    keys.vertices = [];
    keys.edges = [];
    keys.edgeCenters = [];
    keys.pos = new SAT.V(keys.pos[0], keys.pos[1]);

    Asteroids.MovingPolygon.call(this, keys);

    this.calculateVertices();
    this.calculateEdges();
    this.calculateEdgeCenters();
  };

  Asteroids.Util.inherits(Asteroids.Ship, Asteroids.MovingPolygon);

  Ship.COLOR  = "blue";
  Ship.HEIGHT = 20;
  Ship.WIDTH = 10;
  Ship.MAX_SPEED = 8;

  Ship.prototype.draw = function (ctx) {
    ctx.strokeStyle = Ship.COLOR;
    ctx.lineWidth = 1;
    ctx.beginPath();

    ctx.moveTo(
      this.vertices[0][0],
      this.vertices[0][1]);

    ctx.lineTo(
      this.vertices[1][0],
      this.vertices[1][1]);

    ctx.lineTo(
      this.vertices[2][0],
      this.vertices[2][1]);

    ctx.closePath();
    ctx.stroke();

    this.drawContacts(ctx);
    this.drawPos(ctx);
  };

  Ship.prototype.relocate = function (pos) {
    this.pos = pos;
    this.speed = 0;
  };

  Ship.prototype.power = function (impulse) {
    this.speed = Math.min(impulse+this.speed, Ship.MAX_SPEED);
    this.speed = Math.max(this.speed, 0);
  };

  Ship.prototype.move = function () {
    var newSpeed = this.speed - 0.01;

    this.pos.add(this.vel());
    this.calculateVertices();
    Asteroids.MovingPolygon.prototype.move.call(this);
    this.speed = Math.max(newSpeed, 0);
  };

  Ship.prototype.fireBullet = function () {
    return new Asteroids.Bullet({
      head: this.head.slice(),
      pos: [this.vertices[2].x, this.vertices[2].y];
      poweredUp: this.givePowerUp });
  };

  Ship.prototype.rotate = function (theta) {
    Asteroids.Util.rotateVec(this.head, theta);
    this.theta += theta;
  };

  Ship.prototype.calculateVertices = function () {
    var i;

    this.vertices[0] = new SAT.V(
      Ship.WIDTH/2,
      -1 * Ship.HEIGHT/2);

    this.vertices[1] = new SAT.V(
      -1 * Ship.WIDTH/2,
      -1 * Ship.HEIGHT/2);

    this.vertices[2] = new SAT.V(
      0,
      Ship.HEIGHT/2);

    for (i = 0; i < 3; i++) {
      this.vertices[i].rotate(this.theta);

      this.vertices[i].add(this.pos);
      );
    }
  };
})();
