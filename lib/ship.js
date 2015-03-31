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

    ctx.moveTo(
      this.pos[0] + Ship.WIDTH/2,
      this.pos[1] - Ship.HEIGHT/2);

    ctx.lineTo(
      this.pos[0] - Ship.WIDTH/2,
      this.pos[1] - Ship.HEIGHT/2);

    ctx.lineTo(
      this.pos[0],
      this.pos[1] + Ship.HEIGHT/2);

    this.calculateEdgeCenters();

    ctx.closePath();
    ctx.fill();
    ctx.restore();
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

  Ship.prototype.calculateEdgeCenters = function () {
    this.edgeCenters.push([this.pos[0], this.pos[1] - Ship.HEIGHT/2]);
    this.edgeCenters.push([this.pos[0] - Ship.WIDTH/4, this.pos[1]])
    this.edgeCenters.push([this.pos[0] + Ship.WIDTH/4, this.pos[1]]);
  }
})();
