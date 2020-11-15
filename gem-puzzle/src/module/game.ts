import Board from './board';

class Game extends Board {
    size: number;

    second: number;

    minutes: number;

    time: HTMLDivElement;

    header = document.createElement('div');

    saveGame: any = [];

    constructor() {
        super();
        this.size = 4;
    }

    initGame = async () => {
        this.isGame = true;
        this.second = this.isLoudGame ? this.second : 0;
        this.minutes = this.isLoudGame ? this.minutes : 0;
        this.header.innerHTML = '';
        this.wrapper.append(this.createHeader());
        this.render();

        this.timer();
    };

    createHeader = (): HTMLDivElement => {
        const headerBlock = document.createElement('div');
        headerBlock.classList.add('header');

        const blockTimeMoves = document.createElement('div');
        blockTimeMoves.classList.add('header__item');

        const blockButton = document.createElement('div');
        blockButton.classList.add('header__item');

        blockTimeMoves.append(this.createTimer());
        blockTimeMoves.append(this.createMoves());
        blockButton.append(this.createButtonAutocomplete());
        blockButton.append(this.createButtonPaused());

        headerBlock.append(blockTimeMoves, blockButton);
        this.header.append(headerBlock);
        return this.header;
    };

    createTimer = (): HTMLDivElement => {
        this.time = document.createElement('div');
        this.time.classList.add('header__timer');
        this.time.innerHTML = `<span>00:00</span>`;
        return this.time;
    };

    createMoves = (): HTMLDivElement => {
        const moves = document.createElement('div');
        moves.classList.add('header__moves');

        const quantity = document.createElement('span');
        quantity.classList.add('header__moves_quantity');
        quantity.innerHTML = `${this.moves}`;

        moves.append(quantity);
        return moves;
    };

    createButtonPaused = (): HTMLButtonElement => {
        const button = document.createElement('button');
        button.classList.add('header__button_paused');
        button.innerText = 'Pause';

        button.addEventListener('click', () => this.pausedGame(button));
        return button;
    };

    createButtonAutocomplete = (): HTMLButtonElement => {
        const button = document.createElement('button');
        button.classList.add('header__button_autocomplete');
        button.innerText = 'Autocomplete';

        button.addEventListener('click', () => this.refresh());
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
                this.time.innerHTML = `<span>${this.minutes < 10 ? `0${this.minutes}` : this.minutes}:${
                    this.second < 10 ? `0${this.second}` : this.second
                }</span>`;
            } else {
                clearInterval(timer);
            }
        }, 1000);
    };

    pausedGame = (button: HTMLButtonElement): void => {
        if (!this.isGame) return;
        if (!this.paused) this.timer();
        document.querySelector('.menu').classList.toggle('hidden');
        this.field.classList.toggle('hidden');
        this.paused = !this.paused;
        button.textContent = this.paused ? 'Pause' : 'Resume';
    };
}

export default Game;
