interface ItemPosition {
    value: number;
    left: number;
    top: number;
    element?: HTMLDivElement;
}

class Board {
    wrapperField = document.createElement('div') as HTMLDivElement;

    field = document.createElement('div') as HTMLDivElement;

    sizeField: number;

    sizeItem: number;

    items: ItemPosition[];

    arrayShifts: ItemPosition[];

    empty: ItemPosition;

    arrayWin: ItemPosition[];

    isDrag = false;

    paused = true;

    private clientX: number;

    private clientY: number;

    moves = 0;

    image = localStorage.getItem('image') !== 'false';

    sound: boolean = localStorage.getItem('sound') !== 'false';

    bestScore: any = [];

    constructor() {
        this.sizeField = 4;
        this.arrayWin = [];
        this.arrayShifts = [];
        this.items = [];
        this.sizeItem = 100;
    }

    render() {
        this.field.innerHTML = '';
        this.items = [];
        this.arrayWin = [];
        this.arrayShifts = [];
        this.wrapperField.classList.add('wrapper-field');
        this.field.classList.add('container');
        this.field.style.width = `${this.sizeItem * this.sizeField}px`;
        this.field.style.height = `${this.sizeItem * this.sizeField}px`;
        this.field.append(this.createItems());
        this.wrapperField.append(this.field);
        document.body.append(this.wrapperField);
        this.showImage();
        console.log(this.sizeField, 'sound', this.sound);
        console.log(this.items, this.arrayWin);
    }

    createItems = () => {
        this.empty = {
            left: this.sizeField - 1,
            top: this.sizeField - 1,
            value: 0,
        };
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < this.sizeField * this.sizeField - 1; i += 1) {
            const item = document.createElement('div');
            item.classList.add('item');
            item.draggable = true;
            item.dataset.id = String(i + 1);
            item.innerText = String(i + 1);
            const left = i % this.sizeField;
            const top = (i - left) / this.sizeField;
            item.style.left = `${left * this.sizeItem}px`;
            item.style.top = `${top * this.sizeItem}px`;
            fragment.appendChild(item);
            this.items = [...this.items, { left, top, element: item, value: i + 1 }];
            this.arrayWin = [...this.arrayWin, { left, top, element: item, value: i + 1 }];

            item.addEventListener('click', () => this.move(i + 1));
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
            item.addEventListener(
                'dragend',
                (e) => {
                    this.dragStop(item, e, i);
                    item.classList.remove('transition');
                },
                false,
            );
            item.addEventListener('dragover', (e) => e.preventDefault(), false);
        }
        this.items = [...this.items, this.empty];
        this.arrayWin = [...this.arrayWin, this.empty];
        return fragment;
    };

    dragStart = (cell: HTMLDivElement, event: any): void => {
        event.dataTransfer.effectAllowed = 'move';
        cell.classList.add('transition');
        this.clientX = event.offsetX;
        this.clientY = event.offsetY;
        cell.style.top = `${event.pageY - this.clientY}px`;
        cell.style.left = `${event.pageX - this.clientX}px`;
        document.body.append(cell);
    };

    dragStop = (cell: HTMLDivElement, event: any, index: number): void => {
        const q = this.items.filter((e) => e.value === 0)[0];
        const w = this.items.filter((e) => String(e.value) === cell.innerText)[0];
        this.field.append(cell);
        if (
            event.pageX - this.field.offsetLeft > q.left * this.sizeItem &&
            event.pageX - this.field.offsetLeft < q.left * this.sizeItem + this.sizeItem &&
            event.pageY - this.field.offsetTop > q.top * this.sizeItem &&
            event.pageY - this.field.offsetTop < q.top * this.sizeItem + this.sizeItem
        ) {
            this.move(index + 1);
        } else {
            cell.style.left = `${w.left * this.sizeItem}px`;
            cell.style.top = `${w.top * this.sizeItem}px`;
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
        this.shift(this.items[index - 1]);
        this.moves += 1;
        document.querySelector('.header__moves_quantity').innerHTML = `${this.moves}`;
        if (this.sound) this.playAudio();
        this.winGame();
    };

    shuffle = (): void => {
        for (let i = 0; i < 100; i += 1) {
            const array = [this.top, this.bottom, this.left, this.right].sort((): number => Math.random() - 0.5);
            array[0]();
        }
    };

    left = (): void => {
        if (this.empty.left < this.sizeField - 1) {
            const q = this.items.filter((e) => e.value === 0);
            const w = this.items.filter((e) => e.top === q[0].top && e.left === q[0].left + 1);
            this.shift(w[0]);
        }
    };

    right = (): void => {
        if (this.empty.left > 0) {
            const q = this.items.filter((e) => e.value === 0);
            const w = this.items.filter((e) => e.top === q[0].top && e.left === q[0].left - 1);
            this.shift(w[0]);
        }
    };

    top = (): void => {
        if (this.empty.top > 0) {
            const q = this.items.filter((e) => e.value === 0);
            const w = this.items.filter((e) => e.top === q[0].top - 1 && e.left === q[0].left);
            this.shift(w[0]);
        }
    };

    bottom = (): void => {
        if (this.empty.top < this.sizeField - 1) {
            const q = this.items.filter((e) => e.value === 0);
            const w = this.items.filter((e) => e.top === q[0].top + 1 && e.left === q[0].left);
            this.shift(w[0]);
        }
    };

    shift = (cell: ItemPosition): void => {
        this.arrayShifts = [...this.arrayShifts, cell];
        cell.element.style.left = `${this.empty.left * this.sizeItem}px`;
        cell.element.style.top = `${this.empty.top * this.sizeItem}px`;
        const itemLeft = this.empty.left;
        const itemTop = this.empty.top;
        this.empty.left = cell.left;
        this.empty.top = cell.top;
        cell.left = itemLeft;
        cell.top = itemTop;
    };

    refresh = (): void => {
        console.log(this.arrayShifts.pop());
        this.shift(this.arrayShifts.pop());
    };

    getImage = async () => {
        const response = await fetch('https://raw.githubusercontent.com/irinainina/image-data/blob/master/box/1.jpg');
        const { url } = response;
        console.log(response);
        return url;
    };

    showImage = async () => {
        const url = await this.getImage();

        this.arrayWin.forEach((item: ItemPosition, i: number) => {
            if (item.element) {
                if (!this.image) item.element.classList.add('image-none');
                item.element.style.backgroundImage = `url('../img/1.jpg')`;
                item.element.style.backgroundPosition = `${this.field.offsetWidth - item.left * this.sizeItem}px ${
                    this.field.offsetHeight - item.top * this.sizeItem
                }px`;
                item.element.style.backgroundSize = `${this.field.offsetWidth}px ${this.field.offsetHeight}px`;
            }
        });
    };

    playAudio = () => {
        const myAudio = new Audio();
        myAudio.src = '../audio/04526.mp3';
        myAudio.play();
    };

    winGame = () => {
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
            ];
            localStorage.setItem('score', JSON.stringify(this.bestScore));
            this.paused = !this.paused;
            this.showCongratulations();
        }
    };

    showCongratulations = () => {
        const congratulations = document.createElement('div');
        congratulations.classList.add('congratulations');
        congratulations.style.width = `${this.field.offsetWidth}px`;
        congratulations.style.height = `${this.field.offsetHeight}px`;
        congratulations.style.top = `${this.field.offsetTop}px`;
        congratulations.style.left = `${this.field.offsetLeft}px`;
        const header = document.createElement('h2');
        header.textContent = 'Congratulations';

        const description = document.createElement('p');
        description.textContent = `you won in ${document.querySelector('.header__timer span').innerHTML} minutes and ${
            this.moves
        } moves`;
        const close = document.createElement('button');
        close.classList.add('congratulations__close');
        close.textContent = '✖';

        close.addEventListener('click', () => this.wrapperField.removeChild(congratulations));
        congratulations.append(header, description, close);

        this.wrapperField.append(congratulations);
    };
}

export default Board;
