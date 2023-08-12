class Shapes {
    static line(drawer, from, to, color) {
        let dx = to.x - from.x;
        let dy = to.y - from.y;
        let tg = dy / dx;
        let y = from.y;
        let accumulator = 0;
        for (let x = from.x; x <= to.x; x++) {
            accumulator += tg;
            if (accumulator > 1) {
                y++;
                accumulator -= 1;
            }
            drawer.drawPixel(x, y, ...color);
        }
    }    
}

class CanvasDrawer {

    /*
        obj.selector - css selector of canvas
        obj.resizeCallback - function will be called, when resize happens
    */
    constructor(props = {}) {
        this.Shapes = Shapes;
        this.resizeCallback = props.resizeCallback ||
            (() => { console.log("CanvasDrawer resize"); });
        this.canvas = document.querySelector(props.selector || 'canvas');
        this.canvasContext = this.canvas.getContext('2d',
            { willReadFrequently: true });
        this.resize();
        window.onresize = () => this.resize();
    }

    resize(height, width) {
        this.setSize(height || window.innerHeight, 
            width || window.innerWidth);
        this.nextFrame = this.canvasContext.getImageData(0, 0, this.width, this.height);
        this.resizeCallback();
    }

    setSize(height, width) {
        this.canvas.height = this.height = height;
        this.canvas.width = this.width = width;
    }

    drawPixel(x, y, r, g, b, a) {
        let index = x + this.width * y;
        this.nextFrame.data[4 * index] = r;
        this.nextFrame.data[4 * index + 1] = g;
        this.nextFrame.data[4 * index + 2] = b;
        this.nextFrame.data[4 * index + 3] = a;
    }

    draw(clear) {
        this.canvasContext.putImageData(this.nextFrame, 0, 0);
        this.nextFrame = this.canvasContext.getImageData(0, 0, this.width, this.height);
        if (clear)
            for (let i = 0; i < this.nextFrame.data.length; i++)
                this.nextFrame.data[i] = 255;
    }
}