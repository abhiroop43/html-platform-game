// detects collision between two players
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
    rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

// logic to determine winner
function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  let $displayText = document.querySelector('#displayText');
  $displayText.style.display = 'flex';
  if (player.health === enemy.health) {
    $displayText.innerHTML = 'Tie';
  } else if (player.health > enemy.health) {
    $displayText.innerHTML = 'Player 1 Wins';
  } else if (enemy.health > player.health) {
    $displayText.innerHTML = 'Player 2 Wins';
  }
}

let timer = 60; // the game will last this many seconds
let timerId;

// function to decrease the timer
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector('#timer').innerHTML = timer.toString();
  }

  // when the timer reaches 0, determine the winner
  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}
