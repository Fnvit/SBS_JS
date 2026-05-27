window.addEventListener("DOMContentLoaded", () => {
    let section = document.querySelector('section');
    let img = document.querySelector('img');
    console.log(section);
    let imgSrc = img.getAttribute('src');
    console.log(imgSrc);
    console.log('DOM 구축 완료!');
});
window.onload = () => {
    console.log('문서 로딩 완료!');
}


