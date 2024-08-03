const member_form = document.querySelector('#member_form');
const memListTbl = document.querySelector('.memListTbl');

function tblDrawList() {
  axios.post('http://localhost:3000/list')
  .then(res => {
    let pkNum = 1;
    let imageCnt = 1;
    
    memListTbl.innerHTML = "";

    res.data.forEach((member) => {
      memListTbl.innerHTML +=
      `
        <table class="memListTbl">
          <tr>
            <th>
              <input type="checkbox" name="" id="">
            </th>
            <th>번호</th>
            <th>사진</th>
            <th>사원명</th>
            <th>부서</th>
            <th>직급</th>
            <th>수정</th>
            <th>삭제</th>
          </tr>
          <tr data-seq="${pkNum}">
            <td rowspan="2"><input type="checkbox" name="" id=""></td>
            <td rowspan="2">${member.pkNum}</td>
            <td>
              <img src="" alt="회원${imageCnt}의 사진">
            </td>
            <td>${member.name}</td>
            <td>${member.dept}</td>
            <td>${member.rank}</td>
            <td rowspan="2"><button>Edit</button></td>
            <td rowspan="2"><button onClick="handleDelBtn(this)">Delete</button></td>
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
        </table>
      `;

      pkNum++;
      imageCnt++;
    });
  })
  .catch(err => {
    console.log(err);
  });
}

member_form.addEventListener('submit', (e) => {
  e.preventDefault(); // 기본 폼 제출 동작 방지

  let name = document.querySelector('#name').value;
  let dept = document.querySelector('#dept').value;
  let rank = document.querySelector('#rank').value;

  axios.post('http://localhost:3000/submit', {
    name: name,
    dept: dept,
    rank: rank,
  })
  .then(res => {
    // console.log("서버 응답 : ", res.data);
    member_form.reset(); // 이름, 부서, 직급 입력폼 초기화

    tblDrawList();
  })
  .catch(err => {
    console.log("서버 오류 : ", err);
  });
});

function handleDelBtn(delBtn) {
  const trElement = delBtn.parentElement.parentElement;
  const pkNum = trElement.dataset.seq;
  
  axios.post('http://localhost:3000/delete', {pkNum: pkNum})
  .then((res) => {
    console.log("남은 멤버 리스트 : ", res.data);
    tblDrawList();
  })
  .catch(err => {
    console.log("서버 오류 : ", err);
  });
}