class Player {

  playTurn(warrior) {
    if (typeof this.brain == 'undefined') {
        this.brain = new PlayerBrain(20, warrior);
    }

    let brain = this.brain;

    if (brain.shouldHeal()) {
      warrior.rest();
      brain.setPreviousAction("rest");
    }
    else if (brain.shouldFlee()) {
      warrior.walk("backward");
      brain.setPreviousAction("flee");
    }
    else {
      this.makeAction(warrior, brain);
    }

    brain.setPreviousHealth(warrior.health())
  }

  makeAction(warrior, brain) {
    let direction = brain.determineDirection();
    let spaces = warrior.look();
    let distance = brain.determineDistance(warrior, direction);

    if (distance == -1) {
      warrior.walk(direction);
      brain.setPreviousAction("walk");
    }
    else if (spaces[distance].isWall()) {
      this.wallReact(warrior, brain, direction, distance);
    }
    else if (spaces[distance].isCaptive()) {
      this.smartRescue(warrior, brain, direction, distance)
    }
    else if (brain.shouldPivot()) {
      warrior.pivot();
      brain.setPreviousAction("pivot");
    }
    else {
      this.smartAttack(warrior, brain, direction, distance);
    }
  }

  smartAttack(warrior, brain, direction, distance) {
    if (distance > 0) {
      warrior.shoot();
      brain.setPreviousAction("shoot");
    }
    else {
      warrior.attack();
      brain.setPreviousAction("attack");
    }
  }

  smartRescue(warrior, brain, direction, distance) {
    if (distance > 0){
      warrior.walk(direction);
      brain.setPreviousAction("walk");
    }
    else {
      warrior.rescue(direction);
      brain.setPreviousAction("rescue");
    }
  }

  wallReact(warrior, brain, direction, distance) {
    if (distance > 0){
      warrior.walk(direction);
      brain.setPreviousAction("walk");
    }
    else {
      warrior.pivot();
      brain.setPreviousAction("pivot");
    }
  }
}

class PlayerBrain {

  constructor(startingHealth, warrior) {
    this.startingHealth = startingHealth;
    this.previousHealth = startingHealth;
    this.previousAction = "start";
    this.direction = "forward";
    this.warrior = warrior;
  }

  beingAttacked() {
    return this.previousHealth > this.warrior.health();
  }

  determineDirection() {
    if (this.shouldFlee()) {
      this.direction = this.reverseDirection();
    }

    return this.direction;
  }

  determineDistance(warrior, direction) {
    let position = -1;
    let spaces = warrior.look(direction);

    for (let i = 2; i >= 0; i--) {
      if (!spaces[i].isEmpty()) {
        position = i;
      }
    }

    return position;
  }

  reverseDirection() {
    if (this.direction == "backward") {
      this.direction = "forward";
    } else {
      this.direction = "backward";
    }

    return this.direction;
  }

  setPreviousAction(action) {
    this.previousAction = action;
  }

  setPreviousHealth(health) {
    this.previousHealth = health;
  }

  shouldPivot() {
    return this.direction == "backward";
  }

  shouldFlee() {
    return (this.beingAttacked() && this.warrior.health() < this.startingHealth / 2);
  }

  shouldHeal() {
    return (this.warrior.health() < this.startingHealth && !this.beingAttacked());
  }

}
