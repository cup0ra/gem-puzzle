import Board from './module/board';
import Menu from './module/menu';
import Game from './module/game';
import './css/style.scss';

/* const field = new Board(); */
const menu = new Menu();
/* const game = new Game(3); */
/* menu.render(); */
/* game.init(); */
menu.initApp();

 document.body.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowUp') menu.bottom();
    if (e.code === 'ArrowDown') menu.top();
    if (e.code === 'ArrowRight') menu.right();
    if (e.code === 'ArrowLeft') menu.left();
    console.log(e.target)
});