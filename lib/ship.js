"use strict";

(function () {
  if (typeof(window.Asteroids) === 'undefined') {
    window.Asteroids = {};
  }

  var Ship = Asteroids.Ship = function (keys) {
    keys.head  = [0, 1];
    keys.speed = 0;
    this.givePowerUp = false;
    this.theta = 0;
    this.edgeCenters = [];
    this.vertices = [];

    Asteroids.MovingObject.call(this, keys);

    this.calculateEdgeCenters();
  };

  Asteroids.Util.inherits(Asteroids.Ship, Asteroids.MovingObject);

  Ship.COLOR  = "green";
  Ship.HEIGHT = 20;
  Ship.WIDTH = 10;
  Ship.MAX_SPEED = 8;

  Ship.prototype.draw = function (ctx) {
    ctx.fillStyle = Ship.COLOR;
    ctx.save();
    ctx.beginPath();

    ctx.translate(
      this.pos[0],
      this.pos[1]);

    ctx.rotate(this.theta);

    ctx.translate(
      -this.pos[0],
      -this.pos[1]);

    this.calculateEdgeCenters();
    this.calculateVertices();

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
    ctx.fill();
    ctx.restore();

    this.drawContacts(ctx);
  };

  Ship.prototype.drawContacts = function (ctx) {
    ctx.fillStyle = 'black';

    ctx.beginPath();

    this.edgeCenters.forEach(function (edgeCenter) {
      ctx.arc(
        edgeCenter[0],
        edgeCenter[1],
        2,
        0,
        2 * Math.PI,
        false
      );
    });

    this.vertices.forEach(function (vertex) {
      ctx.arc(
        vertex[0],
        vertex[1],
        2,
        0,
        2 * Math.PI,
        false
      );
    });

    ctx.fill();
  }

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

    Asteroids.Util.vecAdd(this.pos, this.vel());
    this.speed = Math.max(newSpeed, 0);
  };

  Ship.prototype.fireBullet = function () {
    return new Asteroids.Bullet({
      head: this.head.slice(),
      pos: this.pos.slice(),
      poweredUp: this.givePowerUp });
  };

  Ship.prototype.rotate = function (theta) {
    Asteroids.Util.rotateVec(this.head, theta);
    this.theta += theta;
  };

  Ship.prototype.calculateVertices = function () {
    this.vertices[0] = [
      this.pos[0] + Ship.WIDTH/2,
      this.pos[1] - Ship.HEIGHT/2];

    this.vertices[1] = [
      this.pos[0] - Ship.WIDTH/2,
      this.pos[1] - Ship.HEIGHT/2];

    this.vertices[2] = [
      this.pos[0],
      this.pos[1] + Ship.HEIGHT/2];
  };

  Ship.prototype.calculateEdgeCenters = function () {
    this.edgeCenters[0] = [this.pos[0], this.pos[1] - Ship.HEIGHT/2];
    this.edgeCenters[1] = [this.pos[0] - Ship.WIDTH/4, this.pos[1]];
    this.edgeCenters[2] = [this.pos[0] + Ship.WIDTH/4, this.pos[1]];
  }
})();
