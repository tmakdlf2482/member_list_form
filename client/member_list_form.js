const member_form = document.querySelector('#member_form');
const memListTbl = document.querySelector('.memListTbl');

function tblDrawList() {
  axios.post('http://localhost:3000/post/list')
  .then(res => {
    let pkNum = 1;
    let repleNum = 1;
    let imageCnt = 1;
    
    memListTbl.innerHTML = "";

    res.data.forEach((member) => {
      let repleRows = ''; // 댓글 행들을 저장할 변수

      member.reple.forEach(reple => {
        repleRows += `
          <tr data-seq="${member.pkNum}">
            <td>${reple.repleNum}</td>
            <td>${reple.repleContent}</td>
            <td>${reple.repleWriter}</td>
            <td><button onClick="handleRepleEditBtn(this)">Edit</button></td>
            <td><button onClick="handleRepleDelBtn(this)">Delete</button></td>
          </tr>
        `;
      })

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
          <tr data-seq="${member.pkNum}">
            <td rowspan="2"><input type="checkbox" name="" id=""></td>
            <td rowspan="2">${member.pkNum}</td>
            <td>
              <img src="" alt="회원${member.imageCnt}의 사진">
            </td>
            <td>${member.name}</td>
            <td>${member.dept}</td>
            <td>${member.rank}</td>
            <td rowspan="2"><button onClick="handleEditBtn(this)">Edit</button></td>
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
                ${repleRows} <!-- 댓글 행들을 여기에 추가 -->
                <tr data-seq="${member.pkNum}">
                  <td colspan="5">
                      댓글<input type="text" id="repleContent">
                      작성자<input type="text" id="repleWriter">
                      <button onClick="handleRepleSaveBtn(this)">댓글입력</button>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `;

      pkNum++;
      repleNum++;
      imageCnt++;
    });
  })
  .catch(err => {
    console.log("서버 오류 : ", err);
  });
}

member_form.addEventListener('submit', (e) => {
  e.preventDefault(); // 기본 폼 제출 동작 방지

  let name = document.querySelector('#name').value;
  let dept = document.querySelector('#dept').value;
  let rank = document.querySelector('#rank').value;

  axios.post('http://localhost:3000/post/submit', {
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

function handleEditBtn(editBtn) {
  const trElement = editBtn.parentElement.parentElement;
  const pkNum = trElement.dataset.seq;

  axios.post('http://localhost:3000/post/getEditData', {pkNum: pkNum})
  .then(res => {
    if (res.data.idx != -1) {
      let pkNum = res.data.memberList[res.data.idx].pkNum;
      let name = res.data.memberList[res.data.idx].name;
      let dept = res.data.memberList[res.data.idx].dept;
      let rank = res.data.memberList[res.data.idx].rank;
      let imageCnt = res.data.memberList[res.data.idx].imageCnt;

      trElement.innerHTML =
      `
        <td rowspan="2"><input type="checkbox" name="" id=""></td>
        <td rowspan="2">${pkNum}</td>
        <td>
          <img src="" alt="회원${imageCnt}의 사진">
        </td>
        <td><input type="text" id="newName" value="${name}"></td>
        <td><input type="text" id="newDept" value="${dept}"></td>
        <td><input type="text" id="newRank" value="${rank}"></td>
        <td rowspan="2"><button onClick="saveEdit(this)">저장</button></td>
        <td rowspan="2"><button onClick="handleDelBtn(this)">삭제</button></td>
      `;
    }
  })
  .catch(err => {
    console.log("서버 오류 : ", err);
  });
}

function saveEdit(saveBtn) {
  const trElement = saveBtn.parentElement.parentElement;
  const pkNum = trElement.dataset.seq;

  let newName = trElement.querySelector('#newName').value;
  let newDept = trElement.querySelector('#newDept').value;
  let newRank = trElement.querySelector('#newRank').value;

  let body = {
    pkNum: pkNum,
    newName: newName,
    newDept: newDept,
    newRank: newRank,
  };

  axios.post('http://localhost:3000/post/edit', body)
  .then(res => {
    tblDrawList();
  })
  .catch(err => {
    console.log("서버 오류 : ", err);
  });
}

function handleDelBtn(delBtn) {
  const trElement = delBtn.parentElement.parentElement;
  const pkNum = trElement.dataset.seq;
  
  axios.post('http://localhost:3000/post/delete', {pkNum: pkNum})
  .then(res => {
    // console.log("남은 멤버 리스트 : ", res.data);
    tblDrawList();
  })
  .catch(err => {
    console.log("서버 오류 : ", err);
  });
}

function handleRepleSaveBtn(saveBtn) {
  const trElement = saveBtn.parentElement.parentElement;
  const pkNum = trElement.dataset.seq;

  let repleContent = trElement.querySelector('#repleContent').value;
  let repleWriter = trElement.querySelector('#repleWriter').value;

  let body = {
    pkNum: pkNum,
    repleContent: repleContent,
    repleWriter: repleWriter,
  };

  axios.post('http://localhost:3000/reple/submit', body)
  .then(res => {
    tblDrawList();
  })
  .catch(err => {
    console.log("서버 오류 : ", err);
  });
};

function handleRepleEditBtn(editBtn) {
  const trElement = editBtn.parentElement.parentElement;
  const pkNum = trElement.dataset.seq;  // 게시글 번호
  const repleNum = editBtn.closest('tr').querySelector('td').innerText; // 댓글 번호

  let body = {
    pkNum: pkNum,
    repleNum: repleNum,
  };

  axios.post('http://localhost:3000/reple/getRepleEditData', body)
  .then(res => {
    let repleNum = res.data.memberList[res.data.idx].reple[res.data.idx2].repleNum;
    let repleContent = res.data.memberList[res.data.idx].reple[res.data.idx2].repleContent;
    let repleWriter = res.data.memberList[res.data.idx].reple[res.data.idx2].repleWriter;

    trElement.innerHTML =
      `
        <td>${repleNum}</td>
        <td><input type="text" id="newRepleContent" value="${repleContent}"></td>
        <td><input type="text" id="newRepleWriter" value="${repleWriter}"></td>
        <td><button onClick="saveRepleEdit(this)">저장</button></td>
        <td><button onClick="handleRepleDelBtn(this)">Delete</button></td>
      `;
  })
  .catch(err => {
    console.log("서버 오류 : ", err);
  });
};

function saveRepleEdit(saveBtn) {
  const trElement = saveBtn.parentElement.parentElement;
  const pkNum = trElement.dataset.seq;  // 게시글 번호
  const repleNum = saveBtn.closest('tr').querySelector('td').innerText; // 댓글 번호

  let newRepleContent = trElement.querySelector('#newRepleContent').value;
  let newRepleWriter = trElement.querySelector('#newRepleWriter').value;

  let body = {
    pkNum: pkNum,
    repleNum: repleNum,
    newRepleContent: newRepleContent,
    newRepleWriter: newRepleWriter,
  };

  axios.post('http://localhost:3000/reple/edit', body)
  .then(res => {
    tblDrawList();
  })
  .catch(err => {
    console.log("서버 오류 : ", err);
  });
}

function handleRepleDelBtn(delBtn) {
  const trElement = delBtn.parentElement.parentElement;
  const pkNum = trElement.dataset.seq; // 게시글 번호
  const repleNum = trElement.rowIndex; // 댓글 번호

  let body = {
    pkNum: pkNum,
    repleNum: repleNum,
  };

  axios.post('http://localhost:3000/reple/delete', body)
  .then(res => {
    tblDrawList();
  })
  .catch(err => {
    console.log("서버 오류 : ", err);
  });
};