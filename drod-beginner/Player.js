class Player {

  playTurn(warrior) {

    if (this.shouldHeal()) {
      warrior.rest();
    } else {
      this.attackMove(warrior);
    }
  }

  attackMove(warrior) {
    if (warrior.feel().isEmpty() || warrior.attack()) {
      warrior.walk();
    }
  }

  beingAttacked(warrior) {
    let attacked = false;
    if (typeof previousHealth == 'undefined') {
      let previousHealth = 20;
    }
    attacked = previousHealth > warrior.health();
    previousHealth = warrior.health();
    return attacked;
  }

  shouldHeal(warrior) {
    return (!this.beingAttacked() && warrior.health() < Player.startingHealth)
  }
}

class PlayetStats {

  
}
