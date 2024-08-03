const member_form = document.querySelector('#member_form');
const memListTbl = document.querySelector('.memListTbl');
let pkNum = 1044;
let imageCnt = 2;

member_form.addEventListener('submit', (e) => {
  e.preventDefault(); // 기본 폼 제출 동작 방지

  let name = document.querySelector('#name').value;
  let dept = document.querySelector('#dept').value;
  let rank = document.querySelector('#rank').value;
  
  axios.post('http://localhost:3000/member_input_form', {
    name: name,
    dept: dept,
    rank: rank,
  })
  .then(res => {
    console.log("서버 응답 : ", res.data);
    member_form.reset(); // 이름, 부서, 직급 입력폼 초기화

    memListTbl.innerHTML +=
    `
      <tr>
        <td rowspan="2"><input type="checkbox" name="" id=""></td>
        <td rowspan="2">${pkNum++}</td>
        <td>
          <img src="" alt="사원${imageCnt++}의 사진">
        </td>
        <td>${res.data[0].name}</td>
        <td>${res.data[0].dept}</td>
        <td>${res.data[0].rank}</td>
        <td rowspan="2"><button>Edit</button></td>
        <td rowspan="2"><button>Delete</button></td>
      </tr>
      <tr>
        <td colspan="4">
          <table class="subTbl" width="100%" cellspacing="0">
            <tr>
              <td width="10px">번호</td>
              <td>댓글내용</td>
              <td>작성자</td>
              <td>수정</td>
              <td>삭제</td>
            </tr>
            <tr>
              <td>1</td>
              <td>멋진 사진입니다.</td>
              <td>박문수</td>
              <td>수정</td>
              <td>삭제</td>
            </tr>
            <tr>
              <td>2</td>
              <td>좋아요^^ 퍼가요~</td>
              <td>일지매</td>
              <td>수정</td>
              <td>삭제</td>
            </tr>
            <tr>
              <td colspan="5">
                댓글
                <input type="text">
                작성자
                <input type="text">
                <button>댓글입력</button>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `
  })
  .catch(err => {
    console.log("서버 오류 : ", err);
  });
});