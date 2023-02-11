const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

// canvasContext.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/background.png',
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      framesMax: 8,
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      framesMax: 6,
    },
    attack2: {
      imageSrc: './img/samuraiMack/Attack2.png',
      framesMax: 6,
    },
  },
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0,
  },
});

const movementSpeed = 5;
const jumpHeight = 20;

// console.log(player);

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);

  c.fillStyle = 'black';

  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();

  shop.update();

  player.update();
  // enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // Player 1 movement //
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -movementSpeed;
    player.switchSprite('run');
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = movementSpeed;
    player.switchSprite('run');
  } else {
    player.switchSprite('idle');
  }

  // Player 1 jump //
  if (player.velocity.y < 0) {
    player.switchSprite('jump');
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall');
  }

  // Player 2 movement //
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -movementSpeed;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = movementSpeed;
  }

  // detect for collision //
  if (rectangularCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector('#enemyHealth').style.width = enemy.health + '%';
  }

  if (rectangularCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector('#playerHealth').style.width = player.health + '%';
  }

  // end the game based on health //

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    // Player 1 Controls //
    case 'd':
      keys.d.pressed = true;
      player.lastKey = 'd';
      break;
    case 'a':
      keys.a.pressed = true;
      player.lastKey = 'a';
      break;
    case 'w':
      player.velocity.y = -jumpHeight;
      break;
    case ' ':
      player.attack();
      break;

    // Player 2 Controls //
    case 'ArrowRight':
      keys.ArrowRight.pressed = true;
      enemy.lastKey = 'ArrowRight';
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = 'ArrowLeft';
      break;
    case 'ArrowUp':
      enemy.velocity.y = -jumpHeight;
      break;
    case 'ArrowDown':
      enemy.attack();
      break;
  }

  // console.log(event.key);
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    // Player 1 Controls //
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;

    // Player 2 Controls //
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
  }

  // console.log(event.key);
});
