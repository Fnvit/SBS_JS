// ./260526_문서이벤트_2.js 파일로부터 variable 변수 값을 import(가져오기)
// s를 가져왔는데, 변수 이름이 겹치니 가져올때 이름을 새로 지어서 가져옴 (as)
import { variable, s as s2 } from "./260526_문서이벤트_2.js";

let s = document.querySelector('section');
console.log('문서이벤트1-section:', s);
console.log('가져온 variable:', variable);