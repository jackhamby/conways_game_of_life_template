let ticks = 0;
const INTERVAL = 60;
const WIDTH = 750;
const HEIGHT = 750;
const CELL_WIDTH = 25;
const CELL_HEIGHT = 25;
const WORLD_WIDTH = 2500;
const WORLD_HEIGHT = 2500;
const app = new PIXI.Application({
    height: HEIGHT,
    width: WIDTH,
});
const viewport = new Viewport.Viewport({
    screenWidth: WIDTH,
    screenHeight: HEIGHT,
    worldWidth: WORLD_WIDTH,
    worldHeight: WORLD_HEIGHT,
    interaction: app.renderer.plugins.interaction
});

document.getElementById("container").appendChild(app.view);
app.stage.addChild(viewport)
viewport
    .drag()
    .pinch();

viewport.position.x = -WORLD_WIDTH / 2 + WIDTH
viewport.position.y = -WORLD_HEIGHT / 2 + HEIGHT

viewport.on("clicked", (event) => {
    const xIndex = Math.floor(event.world.x / CELL_WIDTH);
    const yIndex = Math.floor(event.world.y / CELL_HEIGHT);            
    const tile = tiles[yIndex][xIndex];

    tile.isAlive = !tile.isAlive;
});

document.getElementById("toggle").addEventListener("click", (event) => {
    if (event.target.innerText === "start"){
        event.target.innerText = "stop";
        app.ticker.add(runGame);
    }
    else {
        event.target.innerText = "start";
        app.ticker.remove(runGame);
        ticks = 0;
    }
});

const grid = new PIXI.Graphics();
const tiles = []
grid.lineStyle(1, 0xFFFFFF);

for(let y = 0; y < WORLD_HEIGHT; y += CELL_HEIGHT){
    grid.moveTo(0, y)
        .lineTo(WORLD_WIDTH, y);
}

for (let x = 0; x < WORLD_WIDTH; x += CELL_WIDTH){
    grid.moveTo(x, 0)
        .lineTo(x, WORLD_HEIGHT);
}

for (let y = 0; y < WORLD_HEIGHT; y += CELL_HEIGHT){
    const row = []
    for(let x = 0; x < WORLD_WIDTH; x += CELL_WIDTH){
        const graphics = new PIXI.Graphics();
        row.push({
            y,
            x,
            graphics,
            isAlive: false,
        });
        viewport.addChild(graphics)
    }
    tiles.push(row)
}

viewport.addChild(grid);


const getNeighbors = (tile) => {
    const neighbors = [];
    const x = Math.floor(tile.x / CELL_WIDTH);
    const y = Math.floor(tile.y / CELL_HEIGHT);

    // Skip edges of the board
    if (x - 1 < 0 ||
        x + 1 > ((WORLD_WIDTH / CELL_WIDTH) - 1) ||
        y - 1 < 0 ||
        y + 1 >= ((WORLD_HEIGHT / CELL_HEIGHT) - 1)){
            return neighbors;
        }

    neighbors.push(tiles[y - 1][x - 1]);
    neighbors.push(tiles[y - 1][x]);
    neighbors.push(tiles[y - 1][x + 1]);
    neighbors.push(tiles[y][x - 1]);
    neighbors.push(tiles[y][x + 1]);
    neighbors.push(tiles[y + 1][x - 1]);
    neighbors.push(tiles[y + 1][x]);
    neighbors.push(tiles[y + 1][x + 1]);
    return neighbors;
}

app.ticker.add(() => {
    tiles.forEach((row) => {
        row.forEach((tile) => {
            tile.graphics.clear();
            if(tile.isAlive){
                tile.graphics.beginFill(0xFFFF00)
                tile.graphics.drawRect(tile.x, tile.y, CELL_WIDTH, CELL_HEIGHT);
            }
        })
    })
});