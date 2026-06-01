const colors = [
    ['#ff4c4c', '#ffb4b4'],
    ['#4cff8b', '#b4ffba'],
    ['#4c7fff', '#b4ddff'],
    ['#edff4c', '#faffb4'],
    ['#f34cff', '#efb4ff'],
    ['#7f4cff', '#bcb4ff'],
];
// 복제의 기반이 되는 복제체
const basicNote = document.querySelector('.note');
basicNote.style.display = 'none'; // 화면에 안보이게 설정
create_note(basicNote.cloneNode(true));

function create_note(note) {
    note.style.display = 'block'; // 화면에 보이게 변경
    // const note = document.querySelector('.note');
    const noteHead = note.querySelector('.head');
    const titleInput = note.querySelector('.title');
    const textarea = note.querySelector('textarea');
    const [plusBtn, saveBtn, loadBtn, colorBtn, closeBtn] = note.querySelectorAll('.head button');
    const colorContainer = note.querySelector('.color_container');
    const noteList = note.querySelector('.note_list'); // div
    const noteListOl = noteList.querySelector('ol'); // ol


    for (let i = 0; i < colors.length; i++) {
        const headColor = colors[i][0];
        const div = document.createElement('div');
        div.classList.add('color');
        div.style.backgroundColor = headColor;
        div.onclick = () => {
            color_clicked(i);
        };
        colorContainer.appendChild(div);
    }


    // 노트 목록을 클릭하거나, 저장버튼을 눌렀을 때 메모 목록을 갱신하는 함수
    function load_memos() {
        noteListOl.innerHTML = ''; // 기존 노트 목록 전부 삭제
        // localStorage에서 모든 note 리스트를 가져옴
        for (let i = 0; i < localStorage.length; i++) {
            // localstorage에 저장된 모든 key 값을 가져옴
            const key = localStorage.key(i); // 노트 제목!
            // ol에 추가할 li 태그
            const li = document.createElement('li');
            // 가져온 제목을 태그 내부의 글자로 적어줌
            li.textContent = key;
            // ol에 li를 추가해줌
            noteListOl.appendChild(li);
            // 추가된 노트 목록 중 하나를 클릭했을 때
            li.onclick = () => {
                const confirmed = confirm('노트를 불러오시겠습니까?');
                if (confirmed) {
                    // 노트 제목을 통해 메모 데이터 객체을 가져온다 (JSON 문자열)
                    const jsonText = localStorage.getItem(key);
                    // JSON 문자열을 실제 JS의 객체로 변경
                    const data = JSON.parse(jsonText);
                    // 변경된 JS 데이터를 가지고 노트의 정보를 변경
                    titleInput.value = key; // 제목
                    textarea.value = data['text']; // 메모 내용
                    noteHead.style.backgroundColor = data['headColor']; // 헤드 색상
                    textarea.style.backgroundColor = data['textareaColor']; // 텍스트 에리어 색상
                }
            }
        }
    }

    // 색상을 클릭했을 때
    function color_clicked(index) {
        // 미리 정의해놓은 colors 배열에서 index에 해당하는 값 가져오기
        const headColor = colors[index][0];
        const textareaColor = colors[index][1];
        // 노트의 색을 변경하기
        noteHead.style.backgroundColor = headColor;
        textarea.style.backgroundColor = textareaColor;
        // 노트 colorContainer 에 active 제거해서 위로 올리기
        colorContainer.classList.remove('active');
    }

// 색상 ... 버튼을 클릭했을 때
    colorBtn.onclick = () => {
        colorContainer.classList.add('active');
    }
// 저장 버튼을 클릭했을 때
    saveBtn.onclick = () => {
        const confirmed = confirm('저장하시겠습니까?');
        // 만약 사용자가 확인을 눌렀다면
        if (confirmed) {
            const title = titleInput.value; // 노트 제목
            const text = textarea.value; // 사용자가 작성한 메모
            // 실제로 저장할 노트 데이터 객체
            const data = {
                text: text,
                headColor: getComputedStyle(noteHead).backgroundColor,
                textareaColor: getComputedStyle(textarea).backgroundColor,
            }
            // json 형태의 문자열로 변경
            const jsonText = JSON.stringify(data);
            // 로컬스토리지에 title을 key로, jsonText를 value로 저장
            localStorage.setItem(title, jsonText);
            load_memos(); // 메모 목록을 갱신한다.
            alert('저장 완료!');
        }
    }
// 노트 목록 불러오기 버튼을 클릭했을 때
    loadBtn.onclick = () => {
        load_memos(); // 모든 메모 목록을 불러온다.
        noteList.classList.toggle('active');
    }
    // x 버튼을 눌렀을 때
    closeBtn.onclick = () => {
        const confirmed = confirm('정말 닫으시겠습니까?');
        if (confirmed) {
            note.remove(); // 노트를 제거한다
        }
    }
/////// 요소 이동
// 요소에서 마우스 클릭한 위치
    let initialMousePosX = 0;
    let initialMousePosY = 0;
// 현재까지 움직인 거리
    let offsetX = 0;
    let offsetY = 0;

    function mouse_move(event) {
        // 현재 위치 - 처음있었던 위치 => 이동한 거리
        offsetX = event.clientX - initialMousePosX;
        offsetY = event.clientY - initialMousePosY;
        // 이동한 거리만큼 translate 로 요소를 이동시킴
        note.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }

// 마우스를 내리고 나면
    note.addEventListener('mousedown', event => {
        // 마우스를 클릭한 위치를 받아옴 ( +현재까지 이동한 거리도 추가 )
        initialMousePosX = event.clientX - offsetX;
        initialMousePosY = event.clientY - offsetY;

        // 움직일때 mouse_move 함수가 동작하도록 설정함
        note.addEventListener('mousemove', mouse_move);
    });
// 이 문서 내의 어디서든 마우스를 떼면
    window.addEventListener('mouseup', event => {
        // div.onmousedown = null; // on으로 넣었을 경우는 null 넣으면 ok
        // mousemove 이벤트에서 mouse_move 함수를 제거한다 => 이벤트 취소
        note.removeEventListener('mousemove', mouse_move);
    });

    plusBtn.onclick = () => {
        const note = basicNote.cloneNode(true);
        create_note(note);
    }

    document.body.appendChild(note);
}















