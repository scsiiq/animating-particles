(function(){ // самовызывающаяся функция

    var canvas = document.createElement('canvas'), // переменная canvas, присвоим элемент canvas
    ctx = canvas.getContext('2d'), // контекст, который определяет переменную как 2D
    w = canvas.width = innerWidth, // ширина переменной
    h = canvas.height = innerHeight, // высота просмотра
    particles = [], // массив в котором храним частицы
    properties = { // ассоциативный массив
        bgColor             : 'rgba(17, 17, 19, 1)', // цвет фона
        particleColor       : 'rgba(255, 40, 40, 1)',
        particleRadius      : 3, // радиус окружности частицы
        particleCount       : 70, // количество частиц
        particleMaxVelocity : 0.5, // генерация скорости по х и у
        lineLength          : 250, // длина соединения
        particleLife        : 7, // жизненный цикл частицы
    };

    document.querySelector('body').appendChild(canvas); // добавление canvas на страничку

    window.onresize = function(){ /* функция срабатывающая в момент изменения окна, теперь размер 
        canvas меняется динамически вместе с окном просмтора */
        w = canvas.width = innerWidth,
        h = canvas.height = innerHeight;        
    }

    class Particle{
        constructor(){ // определяем скорость частиц, из положение, радиус и т.п.
            this.x = Math.random()*w;
            this.y = Math.random()*h;
            this.velocityX = Math.random()*(properties.particleMaxVelocity*2)-properties.particleMaxVelocity; /* поучаем скорость по х
             от 0,5 до -0,5 , от этого зависит в каком напрвлении будет двигаться частичка*/
            this.velocityY = Math.random()*(properties.particleMaxVelocity*2)-properties.particleMaxVelocity;
            this.life = Math.random()*properties.particleLife*60;
        }
        position(){
            this.x + this.velocityX > w && this.velocityX > 0 || this.x + this.velocityX < 0 && this.velocityX < 0? this.velocityX*=-1 : this.velocityX;
            // чтобы частицы не вылетали за окно просмотра)
            this.y + this.velocityY > h && this.velocityY > 0 || this.y + this.velocityY < 0 && this.velocityY < 0? this.velocityY*=-1 : this.velocityY;
            this.x += this.velocityX;
            this.y += this.velocityY;
        }
        reDraw(){ // отрисовывает частицу на canvas
            ctx.beginPath();
            ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI*2);
            ctx.closePath();
            ctx.fillStyle = properties.particleColor;
            ctx.fill();
        }
        reCalculateLife(){ // метод отнимающий жизнь
            if(this.life < 1){ // если жизнь меньше 1, то заново пересчитываются все частички заново
                this.x = Math.random()*w;
                this.y = Math.random()*h;
                this.velocityX = Math.random()*(properties.particleMaxVelocity*2)-properties.particleMaxVelocity;
                this.velocityY = Math.random()*(properties.particleMaxVelocity*2)-properties.particleMaxVelocity;
                this.life = Math.random()*properties.particleLife*60;
            }
            this.life--; 
        }
    }

    function reDrawBackground(){
        ctx.fillStyle = properties.bgColor;
        ctx.fillRect(0, 0, w, h);
    }

    function drawLines(){ // проверяем расстояние от одной частицы до другой
        var x1, y1, x2, y2, length, opacity;
        for(var i in particles){ // перебираем все элементы в массиве
            for(var j in particles){
                x1 = particles[i].x; // присваеиваем координаты частиц
                y1 = particles[i].y;
                x2 = particles[j].x;
                y2 = particles[j].y;
                length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)); // расстояние по формуле диагонали
                if(length < properties.lineLength){
                    opacity = 1-length/properties.lineLength;
                    ctx.lineWidth = '0.5'; // ширина линии
                    ctx.strokeStyle = 'rgba(255, 40, 40, '+opacity+')'; // цвет линии
                    ctx.beginPath(); // начало пути
                    ctx.moveTo(x1, y1); // из точки 1
                    ctx.lineTo(x2, y2); // в точку 2
                    ctx.closePath(); // закрываем путь
                    ctx.stroke(); //отрисует на canvas
                }
            }
        }
    }

    function reDrawParticles(){
        for(var i in particles){ // пройдемся по всем частицам в массиве
            particles[i].reCalculateLife();
            particles[i].position();
            particles[i].reDraw();
        }
    }

    function loop(){
        reDrawBackground(); // цвет заливки
        reDrawParticles();
        drawLines();
        requestAnimationFrame(loop);
    }

    function init(){ // вызов функции init, и отрисовка частиц
        for(var i = 0 ; i < properties.particleCount ; i++){
            particles.push(new Particle); // добавляем частицы в массив
        }
        loop(); // запускает рекурсивную функцию
    }

    init();

}())