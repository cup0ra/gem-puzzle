/* eslint-disable no-restricted-syntax */
import Board from './board';
import Game from './game';

class Menu extends Game {
    board: any;

    sizeField: number;

    wrapperMenu = document.createElement('div') as HTMLDivElement;

    menuContainer = document.createElement('div') as HTMLDivElement;

    mainSitting = document.createElement('div') as HTMLDivElement;

    mainScore = document.createElement('div') as HTMLDivElement;

    mainSave = document.createElement('div') as HTMLDivElement;

    activeBoard = false;

    saved: boolean;

    createHeaderApp = (): HTMLHeadElement => {
        const header = document.createElement('header');
        const title = document.createElement('h1');
        title.classList.add('title');
        title.textContent = 'GEM PUZZLE';
        header.append(title);
        return header;
    }

    createMenu = (): DocumentFragment => {
        const fragment = document.createDocumentFragment();
        this.wrapperMenu.classList.add('wrapper-menu');
        this.menuContainer.classList.add('menu');
        this.menuContainer.append(this.createButton('New Game', this.startNewGame));
        this.menuContainer.append(this.createButton('Save game', this.showSaveGame));
        this.menuContainer.append(this.createButton('Best score', this.showScore));
        this.menuContainer.append(this.createButton('Sitting', this.showSittings));
        this.menuContainer.append(this.creteSittings());
        this.wrapperMenu.append(this.menuContainer);
        fragment.append(this.wrapperMenu);
        return fragment;
    };

    createButton = (name: string, q: any) => {
        const button = document.createElement('button');
        button.classList.add('menu__item');
        button.textContent = name;
        button.addEventListener('click', () => q());
        return button;
    };

    createInput = () => {
        const input = document.createElement('input');
        input.type = 'range';
        return input;
    };

    creteSittings = () => {
        this.mainSitting.classList.add('sittings', 'hidden');

        const input = document.createElement('input');
        input.id = 'slider';
        input.type = 'range';
        input.min = '3';
        input.max = '8';
        input.value = '4';
        const label = document.createElement('label');
        label.innerHTML = `Size field - <span class='size-field'>${input.value} x ${input.value}</span>`;

        const buttonSound = document.createElement('button');
        buttonSound.classList.add('sittings__button_sound');
        buttonSound.innerText = this.sound ? 'Sound Off' : 'Sound On';

        const buttonImage = document.createElement('button');
        buttonImage.classList.add('sittings__button_image');
        buttonImage.innerText = this.image ? 'Image Off' : 'Image On';

        const close = document.createElement('button');
        close.classList.add('sittings__close');
        close.textContent = '✖';

        this.mainSitting.append(label, input, buttonSound, buttonImage, close);
        input.addEventListener('input', () => {
            this.setEmpty(+input.value);
            this.setSizeField(+input.value);
            document.querySelector('.size-field').innerHTML = `${input.value} x ${input.value}`;
            this.activeBoard = false;
        });

        buttonSound.addEventListener('click', () => {
            this.sound = !this.sound;
            buttonSound.innerText = this.sound ? 'Sound Off' : 'Sound On';
            localStorage.setItem('sound', `${this.sound}`);
        });
        buttonImage.addEventListener('click', () => {
            this.image = !this.image;
            buttonImage.innerText = this.image ? 'Image Off' : 'Image On';
            localStorage.setItem('image', `${this.image}`);
            if (this.arrayWin.length > 0) {
                this.arrayWin.forEach((e) => {
                    if (e.element) {
                        /* e.element.innerText = this.image ? '' : `${e.value}`; */
                        e.element.classList.toggle('image-none');
                    }
                });
            }
        });

        close.addEventListener('click', () => this.mainSitting.classList.toggle('hidden'));
        return this.mainSitting;
    };

    showSittings = () => {
        this.mainSitting.classList.toggle('hidden');
    };

    startNewGame = () => {
        this.initGame();
        this.menuContainer.classList.add('hidden');
        this.paused = true;
        this.field.classList.remove('hidden');
    };

    initApp = () => {
        this.board = 4;
        this.wrapper.classList.add('wrapper');
        this.wrapper.append(this.createHeaderApp(), this.createMenu());
        document.body.append(this.wrapper)
    };

    showScore = () => {
        this.mainScore.classList.add('score');
        this.mainScore.innerHTML = '';
        this.mainScore.append(this.createScore('score__header', 'Date', 'Time', 'Size', 'Moves', 'id'));
        const array = JSON.parse(localStorage.getItem('score'));
        if (array) {
            array.forEach((element: any) => {
                this.mainScore.append(
                    this.createScore(
                        'score__items',
                        this.getDate(element),
                        element.time,
                        `${element.size}x${element.size}`,
                        element.move,
                        element.id,
                    ),
                );
            });
        }
        const close = document.createElement('button');
        close.classList.add('score__close');
        close.textContent = '✖';
        close.addEventListener('click', () => this.wrapperMenu.removeChild(this.mainScore));
        this.mainScore.append(close);
        this.wrapperMenu.append(this.mainScore);
    };

    showSaveGame = () => {
        this.saved = true;
        this.mainSave.classList.add('save-game');
        this.mainSave.innerHTML = '';
        this.mainSave.append(this.createButtonSaved());
        this.mainSave.append(this.createScore('save-game__header', 'Date', 'Time', 'Size', 'Moves', 'id'));
        const array = JSON.parse(localStorage.getItem('save'));
        if (array) {
            array.forEach((element: any) => {
                const time = `${element.time[0] < 10 ? `0${element.time[0]}` : element.time[0]}:${
                    element.time[1] < 10 ? `0${element.time[1]}` : element.time[1]
                }`;
                this.mainSave.append(
                    this.createScore(
                        'save-game__items',
                        this.getDate(element),
                        time,
                        `${element.size}x${element.size}`,
                        element.move,
                        element.id,
                    ),
                );
            });
        }
        const close = document.createElement('button');
        close.classList.add('save-game__close');
        close.textContent = '✖';
        close.addEventListener('click', () => {
            this.saved = false;
            this.wrapperMenu.removeChild(this.mainSave);
        });
        this.mainSave.append(close);
        this.wrapperMenu.append(this.mainSave);
    };

    createScore = (
        classes: string,
        date: string,
        time: string,
        size: string,
        moves: string,
        id: string,
    ): HTMLDivElement => {
        const scoreContainer = document.createElement('div');
        scoreContainer.classList.add(classes);
        scoreContainer.append(this.createScoreItem(date));
        scoreContainer.append(this.createScoreItem(time));
        scoreContainer.append(this.createScoreItem(size));
        scoreContainer.append(this.createScoreItem(moves));
        if (this.saved) scoreContainer.append(this.createButtonLoud(id));
        return scoreContainer;
    };

    createButtonSaved = (): HTMLButtonElement => {
        const button = document.createElement('button');
        button.classList.add('save-game__button_saved');
        button.innerText = 'Save Game';

        button.addEventListener('click', () => {
            if (this.isGame) {
                const array =
                    JSON.parse(localStorage.getItem('save')) === null
                        ? this.saveGame
                        : JSON.parse(localStorage.getItem('save'));
                this.saveGame = [
                    ...array,
                    {
                        id: `f${(+new Date()).toString(16)}`,
                        move: this.moves,
                        date: Date.now(),
                        size: this.sizeField,
                        time: [this.minutes, this.second],
                        array: this.items,
                        arrayShift: this.arrayShifts,
                        image: this.numberImage,
                    },
                ].sort((a, b) => (a.date > b.date ? 1 : -1));
                localStorage.setItem('save', JSON.stringify(this.saveGame));
                this.wrapperMenu.removeChild(this.mainSave);
                this.showSaveGame();
            }
        });

        return button;
    };

    createButtonLoud = (id: string) => {
        const button = document.createElement('button');
        button.classList.add('loud');
        button.innerText = 'Loud';
        button.dataset.id = id;
        button.addEventListener('click', (e) => {
            const array = JSON.parse(localStorage.getItem('save'));
            const result = array.filter((item: any) => item.id === button.dataset.id)[0];
            const { size, time, image, move, arrayShift } = result;
            this.setSizeField(size);
            this.setEmpty(size);
            this.isLoudGame = true;
            this.moves = move;
            [this.minutes, this.second] = time;
            this.setNumberImage(image);
            this.startNewGame();
            this.arrayShifts = arrayShift;
            this.loudGame(result);
            this.wrapperMenu.removeChild(this.mainSave);
            /* this.isLoudGame = false; */
            this.saved = false;
        });
        return button;
    };

    createScoreItem = (name: string): HTMLDivElement => {
        const item = document.createElement('div');
        item.textContent = name;
        return item;
    };

    getDate = (element: any) => {
        const date = new Date(element.date);
        const m = date.getMonth() + 1;
        const d = date.getDate();
        const dateString = ` ${date.getFullYear()}-${m < 10 ? `0${m}` : m}-${d < 10 ? `0${d}` : d}`;
        return dateString;
    };
}

export default Menu;
