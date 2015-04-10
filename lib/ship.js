(function () {
  "use strict";

  if (typeof(window.Asteroids) === 'undefined') {
    window.Asteroids = {};
  }

  var Ship = Asteroids.Ship = function (keys) {
    keys.color = Ship.COLOR;
    keys.numSides = 3;
    keys.speed = 0;
    keys.givePowerUp = false;
    keys.theta = 0.001;
    keys.head  = [0, 1];
    Asteroids.Util.rotateVec(keys.head, keys.   theta);
    keys.polygon = new SAT.Polygon();
    keys.edges = [];
    keys.edgeCenters = [];
    keys.pos = new SAT.V(keys.pos[0], keys.pos[1]);

    Asteroids.MovingPolygon.call(this, keys);

    this.calculateVertices();
  };

  Asteroids.Util.inherits(Asteroids.Ship, Asteroids.MovingPolygon);

  Ship.COLOR  = "blue";
  Ship.HEIGHT = 20;
  Ship.WIDTH = 10;
  Ship.MAX_SPEED = 8;

  Ship.prototype.draw = function (ctx) {
    ctx.strokeStyle = Ship.COLOR;
    ctx.fillStyle = 'black'
    ctx.lineWidth = 1;
    ctx.beginPath();

    ctx.moveTo(
      this.vertices()[0].x,
      this.vertices()[0].y);

    ctx.lineTo(
      this.vertices()[1].x,
      this.vertices()[1].y);

    ctx.lineTo(
      this.vertices()[2].x,
      this.vertices()[2].y);

    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    this.drawContacts(ctx);
    this.drawPos(ctx);
  };

  Ship.prototype.relocate = function (pos) {
    this.pos = new SAT.V(pos[0], pos[1]);
    this.speed = 0;
  };

  Ship.prototype.power = function (impulse) {
    this.speed = Math.min(impulse+this.speed, Ship.MAX_SPEED);
    this.speed = Math.max(this.speed, 0);
  };

  Ship.prototype.move = function (move) {
    var ctx, newSpeed;
    if (move) {
      this.pos.add(move);
    } else {
      newSpeed = this.speed - 0.01;

      this.pos.add(this.vel());
      this.calculateVertices();
      this.speed = Math.max(newSpeed, 0);
    }
  };

  Ship.prototype.fireBullet = function () {
    return new Asteroids.Bullet({
      theta: this.theta,
      head: this.head.slice(),
      pos: this.vertices()[2].clone(),
      poweredUp: this.givePowerUp });
  };

  Ship.prototype.rotate = function (theta) {
    Asteroids.Util.rotateVec(this.head, theta);
    this.theta += theta;
  };

  Ship.prototype.calculateVertices = function () {
    var i,
        vertices = [];

    vertices[0] = new SAT.V(
      Ship.WIDTH/2,
      -1 * Ship.HEIGHT/2);

    vertices[1] = new SAT.V(
      -1 * Ship.WIDTH/2,
      -1 * Ship.HEIGHT/2);

    vertices[2] = new SAT.V(
      0,
      Ship.HEIGHT/2);

    for (i = 0; i < 3; i++) {
      vertices[i].rotate(this.theta);
      vertices[i].add(this.pos);

      if (vertices[i].x < 0 || vertices[i].x > Asteroids.Game.D) {

      }
    }


    this.polygon.setPoints(vertices);
  };
})();
