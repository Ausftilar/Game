'use strict';

game.snake = {
    game: game,
    cells: [],
    moving: false,
    direction: false,
    directions: {
        up: {
            row: -1,
            col: 0,
            angle: 0
        },
        down: {
            row: 1,
            col: 0,
            angle: 180
        },
        left: {
            row: 0,
            col: -1,
            angle: 270
        },
        right: {
            row: 0,
            col: 1,
            angle: 90
        }
    },

    create() {
        let startCells = [{row: 7, col: 7}, {row: 8, col: 7}];
        this.direction = this.directions.up;

        for (let startCell of startCells) {
            this.cells.push(this.game.board.getCell(startCell.row, startCell.col));
        }
    },
    renderHead() {
        //Получить голову
        let head = this.cells[0];

        let halSize = this.game.sprites.head.width / 2;

        //Сохранить исходное состояние контекста
        this.game.ctx.save();

        //Перенос точки отсчета в начало координат головы
        this.game.ctx.translate(head.x, head.y);

        //Перенос точки отсчета в центр головы
        this.game.ctx.translate(halSize, halSize);

        //Вращаяем контекст относительно центра
        this.game.ctx.rotate(this.direction.angle * Math.PI / 180);

        //Отрисовываем голову с учетом поворота контекста
        this.game.ctx.drawImage(this.game.sprites.head, -halSize, -halSize);

        //Вернуть исходное состояние контекста
        this.game.ctx.restore();
    },
    renderBody() {
        for (let i = 1; i <this.cells.length; ++i) {
            this.game.ctx.drawImage(this.game.sprites.body, this.cells[i].x, this.cells[i].y);
        }
    },
    render() {
        this.renderHead();
        this.renderBody();
    },
    start(keyCode) {
        switch(keyCode) {
            case 38:
                this.direction = this.directions.up;
                break;
            case 37:
                this.direction = this.directions.left;
                break;
            case 39:
                this.direction = this.directions.right;
                break;
            case 40:
                this.direction = this.directions.down;
                break;
        }

        if (!this.moving) {
            this.game.onSnakeStart();
        }
        
        this.moving = true;
    },
    move() {
        //Запущено ли движение
        if(!this.moving) {
            return;
        }
        //Получить новую ячейку доски
        let cell = this.getNextCell();
        //Если такая ячейка есть
        if (!cell || this.hasCell(cell) || this.game.board.isBombCell(cell)) {
            //Остановить игру
            this.game.stop();
        } else {
            //Добавить новую ячейку в snake.cells
            this.cells.unshift(cell);
            
            //Если новая ячейка не является яблоко
            if (!this.game.board.isFoodCell(cell)) {
                //Удалить последнюю ячейку из snake.cells
                this.cells.pop();
           } else {
               //Если ячейка является яблоком
               this.game.onSnakeEat();
           }
        }
    },
    hasCell(cell) {
        return this.cells.find(part => part === cell);
    },
    getNextCell() {
        let head = this.cells[0];
        
        let row = head.row + this.direction.row;
        let col = head.col + this.direction.col;

        return this.game.board.getCell(row, col);
    }
};