export interface ItemPosition {
    value: number;
    left: number;
    top: number;
    element?: HTMLDivElement;
}
export interface BestScore {
    move: string;
    date: number;
    size: number;
    time: string;
    id: string;
}

export interface SaveGame {
    id: string;
    move: string;
    date: number;
    size: number;
    time: number[];
    array: ItemPosition[];
    arrayShift: ItemPosition[];
    image: number;
}
