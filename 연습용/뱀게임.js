const h3 = document.querySelector('.game_container h3');
const score = document.querySelector('.game_container b');

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let gameId = null;
// 전체 뱀의 몸들을 저장하는 배열
let snake = [];
// 뱀의 각 몸의 좌표
const snakeBody = {
    x: 0,
    y: 0,
    direction: 6
};
// 사과의 좌표
const apple = {
    x: 0,
    y: 0,
}
// 뱀 몸통 크기 (사과도 동일)
const snakeWidth = 40;
const snakeHeight = 40;
let intervalSetting = 200; // 초기 진행 속도
// 게임 진행 속도 (점점 빨라지는)
let interval = 200;

// 초기화 함수
function init(){
    h3.classList.remove('game_over');
    score.textContent = '0';

    snake = [];
    // 뱀 몸을 하나 생성
    snake.push(snakeBody);
    // 사과 좌표 랜덤으로 정하기
    apple.x = parseInt(Math.random() * 15) * 40;
    apple.y = parseInt(Math.random() * 15) * 40;
    interval = intervalSetting; // 게임 진행 속도 초기화
    gameId = setInterval(main_loop, interval);
}
// 게임이 진행되는 메인 루프
function main_loop(){
    create_rect(0, 0, canvas.clientWidth, canvas.clientHeight, 'black');
    move_snake();
    draw();
    is_collision();
}
// 각 프레임마다 화면을 그리는 함수
function draw(){
    // 게임판을 그린다.
    create_rect(0, 0, canvas.clientWidth, canvas.clientHeight, 'black');
    // 사과를 그린다
    create_rect(apple.x, apple.y, snakeWidth, snakeHeight, 'red');
    // 뱀의 모든 몸통을 그린다.
    for (let i = 0; i < snake.length; i++) {
        const snakeBody = snake[i];
        // 머리/몸/꼬리 에 따라 색을 따로 정하기
        if(i === 0){
            color = 'yellow';
        }
        else if(i === snake.length - 1){
            color = 'blue';
        }
        else{
            color = 'white';
        }
        create_rect(snakeBody.x, snakeBody.y, snakeWidth, snakeHeight, color);
    }
}
// 뱀을 이동시키는 함수
function move_snake(){
    const snakeHead = snake[0];
    const coordinate = calc_coordinate(snakeHead.x, snakeHead.y, snakeHead.direction);
    snake.pop(); // 꼬리를 뽑는다
    snake.unshift(coordinate); // 새로운 머리를 추가한다
}
// 뱀의 몸을 생성한다
function add_snake(){
    // 꼬리를 가져온다
    const lastSnakeBody = snake[snake.length - 1];
    // 꼬리가 가는 방향의 반대 방향에 새로운 꼬리를 장착해야 함
    const coordinate = calc_coordinate(lastSnakeBody.x, lastSnakeBody.y, lastSnakeBody.direction);
    // 전체 몸통에 꼬리를 추가함
    snake.push({
        x: -coordinate.x,
        y: -coordinate.y,
        direction: coordinate.direction,
    });
}
// canvas 의 x, y 좌표에 (w x h) 만큼의 사각형을 그림
function create_rect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}
// 다음 뱀이 만들어져야 하는 좌표를 계산하는 함수
// 기존 x, y 좌표에서 direction에 따라 좌표를 계산함
function calc_coordinate(x, y, direction){
    switch (direction){
        case 2: // down
            return { x: x , y: y + snakeHeight, direction: direction };
        case 8: // up
            return { x: x , y: y - snakeHeight, direction: direction };
        case 4: // left
            return { x: x - snakeWidth , y: y, direction: direction };
        case 6: // right
            return { x: x + snakeWidth , y: y, direction: direction };
    }
}
// 충돌이 되었는지 확인하는 함수
function is_collision(){
    // 뱀의 머리가 사과의 좌표와 정확히 일치한다면 (겹쳤다면)
    if(snake[0].x === apple.x && snake[0].y === apple.y){
        add_snake(); // 뱀의 몸통이 하나 늘어난다
        apple.x = parseInt(Math.random() * 15) * 40;
        apple.y = parseInt(Math.random() * 15) * 40;
        score.textContent = +score.textContent + 100;
        // 난이도 조절을 위해 멈췄다가 시간 줄여서 다시 실행
        clearInterval(gameId);
        interval -= 20;
        gameId = setInterval(main_loop, interval);
    }
    if(
        (snake[0].x < 0)|| (snake[0].y < 0) ||
        (snake[0].x >= canvas.clientWidth) || (snake[0].y >= canvas.clientHeight)
    ){
        clearInterval(gameId);
        gameId = null;
        h3.classList.add('game_over');
    }
    // 뱀의 머리를 제외한 다른 몸통을 순회하면서
    for(let i = 1; i < snake.length; i++){
        // 머리와 몸이 부딪혔는지 (겹쳤는지) 검사
        if((snake[0].x === snake[i].x) && (snake[0].y === snake[i].y)){
            clearInterval(gameId);
            gameId = null;
            h3.classList.add('game_over');
            break;
        }
    }
}


document.onkeydown = event => {
    const key = event.key; // 눌린 키를 가져온다
    console.log(key);
    switch (key){
        case "ArrowUp":
            snake[0].direction = 8;
            break;
        case "ArrowDown":
            snake[0].direction = 2;
            break;
        case "ArrowLeft":
            snake[0].direction = 4;
            break;
        case "ArrowRight":
            snake[0].direction = 6;
            break;
        // 스페이바 누르면
        case " ":
            if(gameId === null){
                init();
                break;
            }
    }
}




