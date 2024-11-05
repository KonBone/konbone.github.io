function howSlow(func) {
    let start = performance.now();
    func();
    console.log(performance.now() - start);
}

const drawer = new CanvasDrawer();

var height = drawer.height,
    width = drawer.width;


var baseStep = Math.floor(width / 5);
var baseWidth = Math.floor(width / baseStep) + 1 + 1,
    baseHeight = Math.floor(height / baseStep) + 1 + 1;
var baseLength = baseHeight * baseWidth;

var redNoize = Array(3),
    greenNoize = Array(3),
    blueNoize = Array(3);

function randomVector() {
    let angle = (2 * Math.PI) * Math.random();
    let x = Math.cos(angle),
        y = Math.sin(angle);
    return [x, y];
}

function generateNoizeBase() {
    let base = Array(baseLength);
    for (let i = 0; i < baseLength; i++) base[i] = randomVector();
    return base;
}

function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
}

function interpol(a, b, t) {
    return a + (b - a) * t;
}

function smothstep(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);;
}

function createNoize() {
    let noize = Array(height * width);
    let base = generateNoizeBase();
    for (let i = 0; i < height; i++) for (let j = 0; j < width; j++) {
        let baseX = Math.floor(j / baseStep),
            baseY = Math.floor(i / baseStep);
        let deltaX = j - baseStep * baseX,
            deltaY = i - baseStep * baseY;
        let tX = deltaX / baseStep,
            tY = deltaY / baseStep;
        let baseVectors = [
            base[baseX + baseY * baseWidth],
            base[baseX + 1 + baseY * baseWidth],
            base[baseX + (baseY + 1) * baseWidth],
            base[baseX + 1 + (baseY + 1) * baseWidth]
        ];
        let vectors = [
            [tX, tY],
            [tX - 1, tY],
            [tX, tY - 1],
            [tX - 1, tY - 1]
        ];
        tX = smothstep(tX);
        tY = smothstep(tY);
        let dots = Array(4);
        for (let k = 0; k < 4; k++)
            dots[k] = dot(baseVectors[k], vectors[k]);
        let leprs = Array(2);
        for (let k = 0; k < 2; k++)
            leprs[k] = interpol(dots[2 * k + 0], dots[2 * k + 1], tX);
        let lepr = (interpol(leprs[0], leprs[1], tY) + 1) / 2 * 256;
        noize[j + i * width] = Math.floor(lepr);
    }
    return noize;
}

function refillBase(index) {
    redNoize[index] = createNoize();
    greenNoize[index] = createNoize();
    blueNoize[index] = createNoize();
}

// const fastRefillBase = gpu.createKernel(refillBase);

refillBase(0);
refillBase(1);

var state = 0;
var animStep = 100;
var index = 2;


function shot() {
    let tZ = state / animStep;
    if (state == 0) {
        index = (index + 1) % 3;
        refillBase((index + 2) % 3);
    }

    for (let i = 0; i < height; i++) for (let j = 0; j < width; j++) {
        let indexTo = (index + 1) % 3;
        let addr = j + i * width;
        let r = interpol(redNoize[index][addr], redNoize[indexTo][addr], tZ),
            g = interpol(greenNoize[index][addr], greenNoize[indexTo][addr], tZ),
            b = interpol(blueNoize[index][addr], blueNoize[indexTo][addr], tZ);
        drawer.drawPixel(j, i, r, g, b, 255);
    }

    state = (state + 1) % animStep;
    drawer.draw(true);
}

function main() {
    shot();
    setTimeout(main, 1);
}
setTimeout(main, 1);