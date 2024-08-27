const canvas = document.createElement('canvas')
const appRoot = document.getElementById('app')

appRoot?.appendChild(canvas)

const SIZE = 600

canvas.width = SIZE
canvas.height = SIZE
const ctx = canvas.getContext('2d')

const sudokuNumbers = [
    0,0,0,2,6,0,7,0,1,
    6,8,0,0,7,0,0,9,0,
    1,9,0,0,0,4,5,0,0,
    8,2,0,1,0,0,0,4,0,
    0,0,4,6,0,2,9,0,0,
    0,5,0,0,0,3,0,2,8,
    0,0,9,3,0,0,0,7,4,
    0,4,0,0,5,0,0,3,6,
    7,0,3,0,1,8,0,0,0

]



function mapf(val:number, inMin:number, inMax:number, outMin:number, outMax:number){
    return outMin + ((val - inMin) / (inMax - inMin) * (outMax))
}

const clamp = (val: number, min: number, max: number) => {
    if(val < min){
        return min
    }
    if (val > max){
        return max
    }
    return val
}

class Cell {
    value: number | undefined
    fillColor: string | undefined
    cornerPencil: number | number[] | undefined
    centerPencil: number | number[] | undefined
    selected: boolean = false
    locked: boolean = false
    // row: number
    // column: number

}

class Grid {
    cells: Cell[] = []
    isSelecting: boolean = false
    isUnselecting: boolean = false
}

const grid = new Grid()

for(let idx = 0; idx < 9 * 9; idx ++){
    let c = new Cell()
    if(Math.random() > 0.5){
        c.value = Math.floor((Math.random()*9)+1)
    }
    c.value = sudokuNumbers[idx]
    if(c.value){
        c.locked = true
    }
    grid.cells.push(c)
}

const renderGrid = () => {
    ctx!.clearRect(0,0,SIZE,SIZE)

    

    
    
    
    
    ctx!.lineWidth = 1
    for(let y = 0; y < 9; y++){
        for(let x = 0; x < 9; x++){
            let xPos = mapf(x,0,9,0,SIZE)
            let yPos = mapf(y,0,9,0,SIZE)
            let cell = grid.cells[y * 9 + x]
            ctx!.fillStyle = cell.selected ?  'red' : cell.fillColor ? cell.fillColor : 'white'
            ctx!.fillRect(xPos,yPos,SIZE/9,SIZE/9)
            ctx!.strokeRect(xPos,yPos,SIZE/9,SIZE/9)
            ctx!.fillStyle = 'black'
            ctx!.font = "50px sans-serif"
            ctx!.textAlign = "center"
            ctx!.textBaseline = "middle"
            ctx!.fillText(String(cell.value || ""),xPos + SIZE/18, yPos + SIZE/18)
            if(!cell.value){
                ctx!.font = "20px sans-serif"
                ctx!.textAlign = "center"
                ctx!.textBaseline = "middle"
                ctx!.fillText(String(cell.cornerPencil || ""),xPos + 15, yPos + 15)
                
                ctx!.textAlign = "center"
                ctx!.textBaseline = "middle"
                ctx!.fillText(String(cell.centerPencil || ""),xPos + SIZE/18, yPos + SIZE/18)

            }
    
        }
    }

    ctx!.strokeStyle = 'black'
    ctx!.lineWidth = 3;
    ctx!.strokeRect(2,2,SIZE-3,SIZE-3)

    for(let off = 1; off < 3; off++){
        let offPos = mapf(off,0,3,0,SIZE)
        ctx!.beginPath()
        ctx!.moveTo(0,offPos)
        ctx!.lineTo(SIZE,offPos)
        ctx!.moveTo(offPos,0)
        ctx!.lineTo(offPos,SIZE)
        ctx!.stroke()
        ctx!.closePath()
    }
}




document.addEventListener('mousedown', (ev) => {
    const canvasRect = canvas.getBoundingClientRect()
    const mouseX = ev.clientX - canvasRect.left
    const mouseY = ev.clientY - canvasRect.top
    const row = clamp(Math.floor(mapf(mouseY, 0, SIZE, 0, 9)),0,8)
    const col = clamp(Math.floor(mapf(mouseX, 0, SIZE, 0, 9)),0,8)
    console.log({mouseX,mouseY,row,col})
    const cell = grid.cells[row * 9 + col]
    grid.isSelecting = !cell.selected
    grid.isUnselecting = cell.selected
    // cell.selected = !cell.selected
    if(!cell.selected && !ev.shiftKey){
        grid.cells.forEach(c => {
            c.selected = false
        })
        cell.selected = true
    }
    else {
        cell.selected = !cell.selected
    }
    // grid.cells[row * 9 + col].selected = !grid.cells[row * 9 + col].selected
    // grid.isSelecting = true
    renderGrid()
})

document.addEventListener('mouseup', (ev) => {
    grid.isSelecting = false
    grid.isUnselecting = false
})

document.addEventListener('mousemove', (ev) => {
    if(grid.isSelecting || grid.isUnselecting){
        const canvasRect = canvas.getBoundingClientRect()
        const mouseX = ev.clientX - canvasRect.left
        const mouseY = ev.clientY - canvasRect.top
        const row = clamp(Math.floor(mapf(mouseY, 0, SIZE, 0, 9)),0,8)
        const col = clamp(Math.floor(mapf(mouseX, 0, SIZE, 0, 9)),0,8)
        console.log({mouseX,mouseY,row,col})
        const cell = grid.cells[row * 9 + col]
        cell.selected = grid.isSelecting ? true : grid.isUnselecting ? false : cell.selected
        renderGrid()
    }
})


// document.addEventListener('mouseup', (ev) => {
//     const canvasRect = canvas.getBoundingClientRect()
//     const mouseX = ev.clientX - canvasRect.left
//     const mouseY = ev.clientY - canvasRect.top
//     const row = Math.floor(mapf(mouseY, 0, SIZE, 0, 9))
//     const col = Math.floor(mapf(mouseX, 0, SIZE, 0, 9))
//     console.log({mouseX,mouseY,row,col})
//     grid.cells[row * 9 + col].selected = !grid.cells[row * 9 + col].selected
//     renderGrid()
// })

document.addEventListener('keydown', (ev) => {
    if(ev.keyCode >= 48 && ev.keyCode <= 57){
        console.log(ev)
        grid.cells.forEach(cell => {
            if(cell.selected && !cell.locked){
                if(ev.altKey){
                    cell.centerPencil = Number(ev.keyCode - 48)
                }
                else if(ev.ctrlKey){
                    cell.cornerPencil = Number(ev.keyCode - 48)
                }
                else if(cell.value == Number(ev.key)){
                    cell.value = undefined
                }
                else{
                    cell.value = Number(ev.key)

                }
            }
        })
    }
    renderGrid()
})

renderGrid()