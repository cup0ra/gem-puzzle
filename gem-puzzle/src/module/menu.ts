import Game from './game';
import { BestScore, SaveGame } from '../interface/interface';

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
    };

    createMenu = (): DocumentFragment => {
        const fragment = document.createDocumentFragment();
        this.wrapperMenu.classList.add('wrapper-menu');
        this.menuContainer.classList.add('menu');
        this.menuContainer.append(this.createButton('New Game', this.startNewGame));
        this.menuContainer.append(this.createButton('Save game', this.showSaveGame));
        this.menuContainer.append(this.createButton('Best score', this.showScore));
        this.menuContainer.append(this.createButton('Settings', this.showSittings));
        this.menuContainer.append(this.creteSittings());
        this.wrapperMenu.append(this.menuContainer);
        fragment.append(this.wrapperMenu);
        return fragment;
    };

    createButton = (name: string, functions: any): HTMLButtonElement => {
        const button = document.createElement('button');
        button.classList.add('menu__item');
        button.textContent = name;
        button.addEventListener('click', () => functions());
        return button;
    };

    createInput = (): HTMLInputElement => {
        const input = document.createElement('input');
        input.type = 'range';
        return input;
    };

    creteSittings = (): HTMLDivElement => {
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
        buttonSound.innerText = this.sound ? 'Sound On' : 'Sound Off';

        const buttonImage = document.createElement('button');
        buttonImage.classList.add('sittings__button_image');
        buttonImage.innerText = this.image ? 'Image On' : 'Image Off';

        const buttonNumber = document.createElement('button');
        buttonNumber.classList.add('sittings__button_number');
        buttonNumber.innerText = this.isNumber ? 'Number Off' : 'Number On';

        const close = document.createElement('button');
        close.classList.add('sittings__close');

        this.mainSitting.append(label, input, buttonSound, buttonImage, buttonNumber, close);
        input.addEventListener('input', () => {
            this.setEmpty(+input.value);
            this.setSizeField(+input.value);
            document.querySelector('.size-field').innerHTML = `${input.value} x ${input.value}`;
            this.activeBoard = false;
        });

        buttonSound.addEventListener('click', () => {
            this.sound = !this.sound;
            buttonSound.innerText = this.sound ? 'Sound On' : 'Sound Off';
            localStorage.setItem('sound', `${this.sound}`);
        });
        buttonImage.addEventListener('click', () => {
            this.image = !this.image;
            buttonImage.innerText = this.image ? 'Image On' : 'Image Off';
            localStorage.setItem('image', `${this.image}`);
            if (this.arrayWin.length > 0) {
                this.arrayWin.forEach((e) => {
                    if (e.element) {
                        e.element.classList.toggle('image-none');
                    }
                });
            }
        });
        buttonNumber.addEventListener('click', () => {
            this.isNumber = !this.isNumber;
            buttonNumber.innerText = this.isNumber ? 'Number Off' : 'Number On';
            localStorage.setItem('number', `${this.isNumber}`);
            if (this.arrayWin.length > 0) {
                this.arrayWin.forEach((e) => {
                    if (e.element) {
                        e.element.classList.toggle('number-none');
                    }
                });
            }
        });

        close.addEventListener('click', () => this.mainSitting.classList.toggle('hidden'));
        return this.mainSitting;
    };

    showSittings = (): void => {
        this.mainSitting.classList.toggle('hidden');
    };

    startNewGame = (): void => {
        this.initGame();
        this.menuContainer.classList.add('hidden');
        this.paused = true;
        this.field.classList.remove('hidden');
    };

    showScore = (): void => {
        this.mainScore.classList.add('score');
        this.mainScore.innerHTML = '';
        this.mainScore.append(this.createScore('score__header', 'Date', 'Time', 'Size', 'Moves', 'id'));
        const array = JSON.parse(localStorage.getItem('score'));
        if (array) {
            array.forEach((element: BestScore) => {
                this.mainScore.append(
                    this.createScore(
                        'score__items',
                        this.getDate(element.date),
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
        close.addEventListener('click', () => this.wrapperMenu.removeChild(this.mainScore));
        this.mainScore.append(close);
        this.wrapperMenu.append(this.mainScore);
    };

    showSaveGame = (): void => {
        this.saved = true;
        this.mainSave.classList.add('save-game');
        this.mainSave.innerHTML = '';
        this.mainSave.append(this.createButtonSaved());
        this.mainSave.append(this.createScore('save-game__header', 'Date', 'Time', 'Size', 'Moves', 'id'));
        const array = JSON.parse(localStorage.getItem('save'));
        if (array) {
            array.forEach((element: SaveGame) => {
                const time = `${element.time[0] < 10 ? `0${element.time[0]}` : element.time[0]}:${
                    element.time[1] < 10 ? `0${element.time[1]}` : element.time[1]
                }`;
                this.mainSave.append(
                    this.createScore(
                        'save-game__items',
                        this.getDate(element.date),
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

    createButtonLoud = (id: string): HTMLButtonElement => {
        const button = document.createElement('button');
        button.classList.add('loud');
        button.innerText = 'Loud';
        button.dataset.id = id;
        button.addEventListener('click', () => {
            const array = JSON.parse(localStorage.getItem('save'));
            const result = array.filter((item: SaveGame) => item.id === button.dataset.id)[0];
            const { size, time, image, move } = result;
            this.setSizeField(size);
            this.setEmpty(size);
            this.isLoudGame = true;
            this.moves = move;
            [this.minutes, this.second] = time;
            this.setNumberImage(image);
            this.startNewGame();
            this.loudGame(result);
            this.wrapperMenu.removeChild(this.mainSave);
            this.saved = false;
        });
        return button;
    };

    createScoreItem = (name: string): HTMLDivElement => {
        const item = document.createElement('div');
        item.textContent = name;
        return item;
    };

    getDate = (element: number): string => {
        const date = new Date(element);
        const m = date.getMonth() + 1;
        const d = date.getDate();
        const dateString = ` ${date.getFullYear()}-${m < 10 ? `0${m}` : m}-${d < 10 ? `0${d}` : d}`;
        return dateString;
    };

    createFooter = (): HTMLDivElement => {
        const footer = document.createElement('div');
        footer.classList.add('footer');

        const name = document.createElement('a');
        name.classList.add('link-git');
        name.href = 'https://github.com/cup0ra';
        name.innerText = 'Cup0ra';

        footer.append(name);
        return footer;
    };

    createLouder = (): HTMLImageElement => {
        const louder = document.createElement('img');
        louder.classList.add('louder', 'hidden');
        louder.src = '../img/louder.gif';
        louder.alt = 'louder';
        return louder;
    };

    initApp = (): void => {
        this.wrapper.classList.add('wrapper');
        this.wrapper.append(this.createHeaderApp(), this.createMenu(), this.createFooter(), this.createLouder());
        document.body.append(this.wrapper);
    };
}

export default Menu;
