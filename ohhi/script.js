const tiles_wrapper = document.querySelector(".tiles");
const solve_btn = document.querySelector("#solve");

const tiles = []
const tile_classes = ["tile empty_tile", "tile red_tile", "tile blue_tile"]

const tiles_width = 12;
const tiles_count = tiles_width * tiles_width;
for (let i = 0; i < tiles_count; i++)
    tiles.push(0);

function tile_click_listener(elem) {
    const index = elem.getAttribute("index");
    tiles[index] = (tiles[index] + 1) % 3;
    elem.className = tile_classes[tiles[index]];
}

function add_tile(tile_type, index) {
    const tile = document.createElement("button");
    tile.className = tile_classes[tile_type];
    tile.setAttribute("index", index)
    tile.addEventListener("click", e => tile_click_listener(e.target));
    tiles_wrapper.appendChild(tile);
}

for (let i = 0; i < tiles_count; i++) add_tile(tiles[i], i);

solve_btn.addEventListener("click", solve);

class Solver {
    constructor(tiles) {
        this.tiles = [];
        this.filled = [];
        for (let i = 0; i < tiles_width; i++) {
            this.tiles.push([]);
            for (let j = 0; j < tiles_width; j++) {
                const type = tiles[j + i * tiles_width];
                if (type != 0) this.filled.push({row: i, col: j});
                this.tiles[i].push(type);
            }
        }
    }

    check_rule_1() {
        let incorrect = true;
        for (let i = 0; i < tiles_width; i++) {
            for (let j = 0; j < tiles_width - 2; j++) {
                if(this.tiles[i][j] == 0) continue;
                let incorrect = this.tiles[i][j] == this.tiles[i][j + 1] && 
                                this.tiles[i][j] == this.tiles[i][j + 2];
                if (incorrect) return false;
            }
            for (let j = 0; j < tiles_width - 2; j++) {
                if(this.tiles[j][i] == 0) continue;
                let incorrect = this.tiles[j][i] == this.tiles[j + 1][i] && 
                                this.tiles[j][i] == this.tiles[j + 2][i];
                if (incorrect) return false;
            }
        }
        return true;
    }

    check_rule_2() {
        const max_sum = tiles_width / 2;
        let incorrect = true;
        let sums = {red: 0, blue: 0};
        for (let i = 0; i < tiles_width; i++) {
            sums = {red: 0, blue: 0};
            for (let j = 0; j < tiles_width; j++) {
                if (this.tiles[i][j] == 1) sums.red += 1;  
                else if (this.tiles[i][j] == 2) sums.blue += 1;  
            }
            if (sums.red > max_sum || sums.blue > max_sum) return false;
            sums = {red: 0, blue: 0};
            for (let j = 0; j < tiles_width; j++) {
                if (this.tiles[j][i] == 1) sums.red += 1;  
                else if (this.tiles[j][i] == 2) sums.blue += 1;  
            }
            if (sums.red > max_sum || sums.blue > max_sum) return false;
        }
        return true;
    }

    check_rule_3() {
        
    }

    check_correctness() {
        if (!this.check_rule_1()) return false;
        if (!this.check_rule_2()) return false;
        return true;
    }

    solve() {
        return this.check_correctness();
    }
}

function solve() {
    const solver = new Solver(tiles);
    const result = solver.solve();
    console.log(result);
    // if (!result) alert("Can't be solved")
}