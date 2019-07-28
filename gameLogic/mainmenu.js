function isBetween(x, interval) {
    // Проверяет находится число x в интервале
    return x>interval.start && x<interval.end;
}


class MenuOption{
    constructor(title, callback, textColor='#000000', textSize=48) {
        this.title = title;
        this.callback = callback;
        this.textColor = textColor;
        this.textFont = textSize+'px serif'
        this._textSize = textSize;
    }

    draw(ctx, position, width, height){
        // Подготовка шрифта
        ctx.font = this.textFont;
        ctx.fillStyle = this.textColor; 

        // определение положения
        var textMeasure = ctx.measureText(this.title);
        this.position = {
            x: position.x + (width - textMeasure.width)/2, 
            y: position.y + (height + this._textSize)/2
        }

        // Отрисовка
        ctx.fillText(this.title, this.position.x, this.position.y)
    }

    onClick(parent) {
        this.callback(parent)
    }
}

class Menu extends Scene {
    constructor(canvasData, options) {
        super(canvasData);
        this.backgroudColor = '#434343';
        this.options = options
        this.positions = {}

        var positions = this.positions
    }

    start() {
        this.addEventListener("click", this.clicked.bind(this))
    }

    clicked(event) {
        // определение местоположения клика
        var x = event.pageY - this.canvasData.canvas.offsetTop,
                y = event.pageX - this.canvasData.canvas.offsetLeft;
            
        for (var key in this.positions) {
            if (isBetween(x, this.positions[key])) {
                this.positions[key].option.onClick(this)
                break;
            }
        }
    }

    draw() {
        var ctx = this.canvasData.ctx;
        ctx.fillStyle = this.backgroudColor;
        ctx.fillRect(0,0, this.canvasData.size.width, this.canvasData.size.height)
        var offset = {x: 200, y: 100};
        var height = 100;
        var width = 250;
        for(var index in this.options){
            var option = this.options[index];
            this.positions[index] = {start: offset.y, end: offset.y+height, option: option};
            option.draw(ctx, offset, width, height);

            offset.y += height
        }
    }

    show() {
        this.start();
        this.draw();
    }

    end() {
        super.end();
    }
}