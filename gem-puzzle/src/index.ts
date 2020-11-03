import './css/style.scss'

const createBlock = (value: number): void => {
    const block = document.createElement('div')
    block.classList.add('container')
    document.body.append(block)
    for(let i = 0; i < value; i++){
        const item = document.createElement('div')
        item.classList.add('item')
        item.innerText = String(i + 1);
        block.appendChild(item)
    }
   
}
createBlock(15)