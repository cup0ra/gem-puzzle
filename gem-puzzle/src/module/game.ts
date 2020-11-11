import Board from './board';

class Game extends Board {
    size: number;

    second: number;

    minutes: number;

    time: HTMLDivElement;

    isGame = true;

    header = document.createElement('div');

    constructor() {
        super();
        this.size = 4;
    }

    initGame = (): void => {
        this.isGame = true;
        this.second = 0;
        this.minutes = 0;
        this.header.innerHTML = '';
        document.body.append(this.createHeader());
        this.render();
        this.timer();
    };

    createHeader = (): HTMLDivElement => {
        const headerBlock = document.createElement('div');
        headerBlock.classList.add('header');
        headerBlock.append(this.createTimer());
        headerBlock.append(this.createMoves());
        headerBlock.append(this.createButtonPaused());
        this.header.append(headerBlock);
        return this.header;
    };

    createTimer = (): HTMLDivElement => {
        this.time = document.createElement('div');
        this.time.classList.add('header__timer');
        this.time.innerHTML = `Time: <span>00:00</span>`;
        return this.time;
    };

    createMoves = (): HTMLDivElement => {
        const moves = document.createElement('div');
        moves.classList.add('header__moves');

        const description = document.createElement('span');
        description.classList.add('header__moves_description');
        description.innerHTML = 'Moves:';

        const quantity = document.createElement('span');
        quantity.classList.add('header__moves_quantity');
        quantity.innerHTML = '0';

        moves.append(description, quantity);
        return moves;
    };

    createButtonPaused = (): HTMLButtonElement => {
        const button = document.createElement('button');
        button.classList.add('header__button_paused');
        button.innerText = 'Pause';

        button.addEventListener('click', () => this.pausedGame(button));
        return button;
    };

    timer = (): void => {
        const timer = setInterval(() => {
            if (this.paused) {
                this.second += 1;
                if (this.second === 60) {
                    this.second = 0;
                    this.minutes += 1;
                }
                this.time.innerHTML = `Time: <span>${this.minutes < 10 ? `0${this.minutes}` : this.minutes}:${
                    this.second < 10 ? `0${this.second}` : this.second
                }</span>`;
            } else {
                clearInterval(timer);
            }
        }, 1000);
    };

    pausedGame = (button: HTMLButtonElement): void => {
        if (!this.paused) this.timer();
        document.querySelector('.menu').classList.toggle('hidden');
        this.field.classList.toggle('hidden');
        this.paused = !this.paused;
        button.textContent = this.paused ? 'Pause' : 'Resume';
    };
}

export default Game;
