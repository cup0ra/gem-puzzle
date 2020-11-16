import { ItemPosition, BestScore, SaveGame } from '../interface/interface';

class Board {
    wrapper = document.createElement('div') as HTMLDivElement;

    wrapperField = document.createElement('div') as HTMLDivElement;

    field = document.createElement('div') as HTMLDivElement;

    sizeField = 4;

    sizeItem = 15;

    items: ItemPosition[] = [];

    arrayShifts: ItemPosition[] = [];

    empty: ItemPosition = {
        left: this.sizeField - 1,
        top: this.sizeField - 1,
        value: 0,
    };

    arrayWin: ItemPosition[] = [];

    isDrag = false;

    paused = true;

    isGame = false;

    isLoudGame = false;

    isAutocompleted = false;

    isNumber = localStorage.getItem('number') !== 'false';

    private clientX: number;

    private clientY: number;

    url: string;

    moves = 0;

    count = 0;

    image = localStorage.getItem('image') !== 'false';

    numberImage: number;

    sound: boolean = localStorage.getItem('sound') !== 'false';

    bestScore: BestScore[] = [];

    loudGameId: string;

    setEmpty = (value: number): void => {
        this.empty = {
            left: value - 1,
            top: value - 1,
            value: 0,
        };
    };

    setSizeField = (value: number): void => {
        this.sizeField = value;
        this.sizeItem = value > 4 ? 10 : 15;
    };

    setNumberImage = (value: number): void => {
        this.numberImage = value;
    };

    render = async () => {
        this.wrapperField.innerHTML = '';
        this.field.innerHTML = '';
        this.loudGameId = '';
        this.items = [];
        this.isGame = true;
        this.isAutocompleted = false;
        this.arrayWin = [];
        this.arrayShifts = [];
        this.moves = this.isLoudGame ? this.moves : 0;
        this.setEmpty(this.sizeField);
        this.wrapperField.classList.add('wrapper-field');
        this.field.classList.add('container');
        this.field.style.width = `${this.sizeItem * this.sizeField}vmin`;
        this.field.style.height = `${this.sizeItem * this.sizeField}vmin`;
        this.field.append(this.createItems());
        document.querySelector('.louder').classList.remove('hidden');
        this.url = await this.getImage();
        document.querySelector('.louder').classList.add('hidden');
        this.wrapperField.append(this.field);
        this.wrapper.append(this.wrapperField);
        if (!this.isLoudGame) this.shuffle();
        this.showImage();
        document.querySelector('.header__moves_quantity').innerHTML = '0';
    };

    private readonly newProperty = this;

    loudGame = (result: SaveGame): void => {
        this.loudGameId = result.id;
        this.items.forEach((item) => {
            const cell = item;
            const newPosition = result.array.filter((e: ItemPosition) => e.value === item.value)[0];
            cell.left = newPosition.left;
            cell.top = newPosition.top;
            if (item.element) {
                cell.element.style.left = `${newPosition.left * this.sizeItem}vmin`;
                cell.element.style.top = `${newPosition.top * this.sizeItem}vmin`;
            }
        });
        this.arrayShifts = [...this.arrayShifts, ...result.arrayShift];
        this.isLoudGame = false;
    };

    createItems = (): DocumentFragment => {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < this.sizeField * this.sizeField - 1; i += 1) {
            const item = document.createElement('div');
            item.classList.add('item');
            item.draggable = true;
            item.dataset.id = String(i + 1);
            item.innerText = String(i + 1);
            const left = i % this.sizeField;
            const top = (i - left) / this.sizeField;
            item.style.left = `${left * this.sizeItem}vmin`;
            item.style.top = `${top * this.sizeItem}vmin`;
            item.style.width = `${this.sizeItem}vmin`;
            item.style.height = `${this.sizeItem}vmin`;
            fragment.appendChild(item);
            this.items = [...this.items, { left, top, element: item, value: i + 1 }];
            this.arrayWin = [...this.arrayWin, { left, top, element: item, value: i + 1 }];

            item.addEventListener('click', () => {
                this.move(i + 1);
                item.classList.add('transition');
                item.addEventListener('transitionend', () => item.classList.remove('transition'), false);
            });
            item.addEventListener(
                'dragstart',
                (e) => {
                    if (this.getAbsoluteValue(i + 1) > 1) return;
                    this.dragStart(item, e);
                },
                false,
            );
            item.addEventListener(
                'drag',
                (e) => {
                    if (this.getAbsoluteValue(i + 1) > 1) return;
                    item.style.top = `${e.pageY - this.clientY}px`;
                    item.style.left = `${e.pageX - this.clientX}px`;
                },
                false,
            );
            item.addEventListener('drop', (e) => this.dragStop(item, e, i), false);
            item.addEventListener('dragend', (e) => this.dragStop(item, e, i), false);
            item.addEventListener('dragover', (e) => e.preventDefault(), false);
        }
        this.items = [...this.items, this.empty];
        this.arrayWin = [...this.arrayWin, this.empty];
        return fragment;
    };

    dragStart = (item: HTMLDivElement, event: any): void => {
        const cell = item;
        this.clientX = event.offsetX;
        this.clientY = event.offsetY;
        cell.style.top = `${event.pageY - this.clientY}px`;
        cell.style.left = `${event.pageX - this.clientX}px`;
        document.body.append(cell);
    };

    dragStop = (item: HTMLDivElement, event: any, index: number): void => {
        const cell = item;
        const q = this.items.filter((e) => e.value === 0)[0];
        const w = this.items.filter((e) => String(e.value) === cell.innerText)[0];
        this.field.append(cell);
        if (
            event.pageX - this.field.offsetLeft > q.left * cell.offsetWidth &&
            event.pageX - this.field.offsetLeft < q.left * cell.offsetWidth + cell.offsetWidth &&
            event.pageY - this.field.offsetTop > q.top * cell.offsetWidth &&
            event.pageY - this.field.offsetTop < q.top * cell.offsetWidth + cell.offsetWidth
        ) {
            this.move(index + 1);
        } else {
            cell.style.left = `${w.left * this.sizeItem}vmin`;
            cell.style.top = `${w.top * this.sizeItem}vmin`;
        }
    };

    getAbsoluteValue = (index: number): number => {
        const item = this.items[index - 1];
        const leftCell = Math.abs(this.empty.left - item.left);
        const topCell = Math.abs(this.empty.top - item.top);
        return leftCell + topCell;
    };

    move = (index: number): void => {
        if (this.getAbsoluteValue(index) > 1) return;
        if (this.sound) this.playAudio();
        this.shift(this.items[index - 1]);
        this.arrayShifts.push(this.items[index - 1]);
        this.moves += 1;
        document.querySelector('.header__moves_quantity').innerHTML = `${this.moves}`;
        this.winGame();
    };

    shuffle = (): void => {
        let numberShifts: number;
        if (this.sizeField === 3) numberShifts = 100;
        if (this.sizeField > 3) numberShifts = 300;
        if (this.sizeField > 6) numberShifts = 800;
        let pred;
        for (let i = 0; i < numberShifts; i += 1) {
            const shift = ['top', 'bottom', 'left', 'right'].sort((): number => Math.random() - 0.5)[0];
            if (shift === 'top' && pred !== 'bottom') this.top();
            if (shift === 'bottom' && pred !== 'top') this.bottom();
            if (shift === 'left' && pred !== 'right') this.left();
            if (shift === 'right' && pred !== 'left') this.right();
            if (shift === 'top' && pred === 'bottom') this.left();
            if (shift === 'bottom' && pred === 'top') this.right();
            if (shift === 'left' && pred === 'right') this.top();
            if (shift === 'right' && pred === 'left') this.bottom();
            pred = shift;
        }
    };

    checkingDuplicateMoves = (index: number): void => {
        if (
            this.arrayShifts.length - 1 > 0 &&
            this.items[index].left === this.arrayShifts[this.arrayShifts.length - 1].left &&
            this.items[index].top === this.arrayShifts[this.arrayShifts.length - 1].top &&
            this.items[index].value === this.arrayShifts[this.arrayShifts.length - 1].value
        )
            return;
        this.shift(this.items[index]);
        this.arrayShifts.push(this.items[index]);
    };

    left = (): void => {
        if (this.empty.left < this.sizeField - 1) {
            const emptyPosition = this.items.filter((e) => e.value === 0);
            const cellLeft = this.items.findIndex(
                (e) => e.top === emptyPosition[0].top && e.left === emptyPosition[0].left + 1,
            );
            this.checkingDuplicateMoves(cellLeft);
        }
    };

    right = (): void => {
        if (this.empty.left > 0) {
            const emptyPosition = this.items.filter((e) => e.value === 0);
            const cellRight = this.items.findIndex(
                (e) => e.top === emptyPosition[0].top && e.left === emptyPosition[0].left - 1,
            );
            this.checkingDuplicateMoves(cellRight);
        }
    };

    top = (): void => {
        if (this.empty.top > 0) {
            const emptyPosition = this.items.filter((e) => e.value === 0);
            const cellTop = this.items.findIndex(
                (e) => e.top === emptyPosition[0].top - 1 && e.left === emptyPosition[0].left,
            );
            this.checkingDuplicateMoves(cellTop);
        }
    };

    bottom = (): void => {
        if (this.empty.top < this.sizeField - 1) {
            const emptyPosition = this.items.filter((e) => e.value === 0);
            const cellBottom = this.items.findIndex(
                (e) => e.top === emptyPosition[0].top + 1 && e.left === emptyPosition[0].left,
            );
            this.checkingDuplicateMoves(cellBottom);
        }
    };

    shift = (item: ItemPosition): void => {
        const cell = item;
        cell.element = document.querySelector(`[data-id="${cell.value}"]`);
        cell.element.style.left = `${this.empty.left * this.sizeItem}vmin`;
        cell.element.style.top = `${this.empty.top * this.sizeItem}vmin`;
        const itemLeft = this.empty.left;
        const itemTop = this.empty.top;
        this.empty.left = cell.left;
        this.empty.top = cell.top;
        cell.left = itemLeft;
        cell.top = itemTop;
    };

    autoCompleted = (): void => {
        this.isAutocompleted = true;
        this.isLoudGame = false;
        if (this.arrayShifts.length > 0) {
            const shift: ItemPosition = this.arrayShifts.pop();
            const index = this.items.findIndex((e) => e.value === shift.value);
            this.shift(this.items[index]);
            if (this.sound) this.playAudio();
            this.moves += 1;
            document.querySelector('.header__moves_quantity').innerHTML = `${this.moves}`;
            this.items[index].element.classList.add('transition-autocomplete');
            this.items[index].element.addEventListener(
                'transitionend',
                () => this.items[index].element.classList.remove('transition-autocomplete'),
                false,
            );
            const timeout = setTimeout(() => {
                if (this.isAutocompleted) {
                    this.autoCompleted();
                } else {
                    clearTimeout(timeout);
                }
            }, 300);
        } else {
            this.showCongratulations();
            this.isAutocompleted = false;
            this.paused = !this.paused;
            this.isGame = false;
        }
    };

    getImage = async () => {
        this.numberImage = this.isLoudGame ? this.numberImage : Math.floor(Math.random() * (100 - 1) + 1);
        const response = await fetch(
            `https://raw.githubusercontent.com/cup0ra/image-data/master/box/${this.numberImage}.jpg`,
        );
        const { url } = response;
        return url;
    };

    showImage = (): void => {
        this.arrayWin.forEach((item: ItemPosition) => {
            const cell = item;
            if (item.element) {
                if (!this.image) item.element.classList.add('image-none');
                if (this.isNumber) item.element.classList.add('number-none');
                cell.element.style.backgroundImage = `url(${this.url})`;
                cell.element.style.backgroundPosition = `${
                    this.sizeField * this.sizeItem - item.left * this.sizeItem
                }vmin ${this.sizeField * this.sizeItem - item.top * this.sizeItem}vmin`;
                cell.element.style.backgroundSize = `${this.sizeField * this.sizeItem}vmin ${
                    this.sizeField * this.sizeItem
                }vmin`;
            }
        });
    };

    playAudio = (): void => {
        const myAudio = new Audio();
        myAudio.src = '../audio/04526.mp3';
        myAudio.play();
    };

    winGame = (): void => {
        let counter = 0;
        for (let i = 0; i < this.arrayWin.length; i += 1) {
            const item = this.items.filter((el: ItemPosition) => el.value === this.arrayWin[i].value)[0];
            if (
                (item.top !== this.arrayWin[i].top && item.left !== this.arrayWin[i].left) ||
                (item.top === this.arrayWin[i].top && item.left !== this.arrayWin[i].left) ||
                (item.top !== this.arrayWin[i].top && item.left === this.arrayWin[i].left)
            ) {
                return;
            }
            counter += 1;
        }
        if (counter === this.arrayWin.length) {
            this.items.forEach((item) => {
                if (item.element) {
                    const cell = item;
                    cell.element.draggable = false;
                }
            });
            const array =
                JSON.parse(localStorage.getItem('score')) === null
                    ? this.bestScore
                    : JSON.parse(localStorage.getItem('score'));
            this.bestScore = [
                ...array,
                {
                    move: this.moves,
                    date: Date.now(),
                    size: this.sizeField,
                    time: document.querySelector('.header__timer span').innerHTML,
                },
            ]
                .sort((a, b) => (a.move > b.move ? 1 : -1))
                .slice(0, 10);
            localStorage.setItem('score', JSON.stringify(this.bestScore));
            this.paused = !this.paused;
            this.isGame = false;
            setTimeout(() => this.showCongratulations(), 500);
            if (this.loudGameId) {
                const arraySaved = JSON.parse(localStorage.getItem('save')).filter(
                    (e: any) => e.id !== this.loudGameId,
                );
                localStorage.setItem('save', JSON.stringify(arraySaved));
            }
        }
    };

    showCongratulations = (): void => {
        const congratulations = document.createElement('div');
        congratulations.classList.add('congratulations');
        if (this.image) {
            congratulations.style.backgroundImage = `url(${this.url})`;
        }
        const header = document.createElement('h2');
        header.textContent = this.isAutocompleted ? 'Game Over' : 'Congratulations';

        const description = document.createElement('p');
        description.textContent = this.isAutocompleted
            ? ''
            : `you won in ${document.querySelector('.header__timer span').innerHTML} minutes and ${this.moves} moves`;
        const close = document.createElement('button');
        close.classList.add('congratulations__close');
        close.textContent = '✖';

        close.addEventListener('click', () => {
            this.wrapperField.innerHTML = '';
            document.querySelector('.menu').classList.toggle('hidden');
        });
        congratulations.append(header, description, close);
        this.field.innerHTML = '';
        this.field.append(congratulations);
    };
}

export default Board;
