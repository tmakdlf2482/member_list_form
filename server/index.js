const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.set('port', 3000);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const memberList = [];
let pkNum = 1;      // 게시글 번호
let repleNum = 1;   // 댓글 번호
let imageCnt = 1;   // 이미지 번호

const server = http.createServer(app);
server.listen(app.get('port'), () => {
  console.log(`connecting nodejs server >>> http://localhost:${app.get('port')}`);
});

app.post('/post/list', (req, res) => {
  console.log("회원 리스트 :", JSON.stringify(memberList));
  console.log("------------------------------------------------------------------------------------------");

  res.status(200).json(memberList);
});

app.post('/post/submit', (req, res) => {
  console.log("회원가입한 회원 /// 이름 :", req.body.name, "/ 부서 :", req.body.dept, "/ 직급 :", req.body.rank);

  memberList.push({
    pkNum: pkNum++,
    imageCnt: imageCnt++,
    name: req.body.name,
    dept: req.body.dept,
    rank: req.body.rank,
    reple: [],
  });

  // 클라이언트에게 응답
  res.status(200).json({success: true});
});

app.post('/post/delete', (req, res) => {
  let pkNum = parseInt(req.body.pkNum); // string -> number
  
  let idx = memberList.findIndex(ind => {
    return ind.pkNum == pkNum;
  });

  if (idx != -1) {
    memberList.splice(idx, 1);
  }
  
  res.status(200).json(memberList);
});

app.post('/post/getEditData', (req, res) => {
  let pkNum = parseInt(req.body.pkNum); // string -> number

  let idx = memberList.findIndex(ind => {
    return ind.pkNum == pkNum;
  });

  res.status(200).json( {idx: idx, memberList: memberList} );
});

app.post('/post/edit', (req, res) => {
  let pkNum = parseInt(req.body.pkNum);

  let idx = memberList.findIndex(ind => {
    return ind.pkNum == pkNum;
  });

  if (idx != -1) {
    memberList[idx].name = req.body.newName;
    memberList[idx].dept = req.body.newDept;
    memberList[idx].rank = req.body.newRank;
  }

  res.status(200).json(memberList);
});

app.post('/reple/submit', (req, res) => {
  const pkNum = parseInt(req.body.pkNum);
  const repleContent = req.body.repleContent;
  const repleWriter = req.body.repleWriter;

  let newReple = {
    repleNum: repleNum++,
    repleContent: repleContent,
    repleWriter: repleWriter,
  };
  
  let idx = memberList.findIndex(ind => {
    return ind.pkNum == pkNum;
  });

  if (idx != -1) {
    memberList[idx].reple.push(newReple);
  }

  res.status(200).json(memberList);
});

app.post('/reple/delete', (req, res) => {
  const pkNum = parseInt(req.body.pkNum); // 게시글 번호
  const repleNum = req.body.repleNum;     // 댓글 번호

  let idx = memberList.findIndex(ind => { // 사용자가 누른 게시글 번호 찾기
    return ind.pkNum == pkNum;
  });

  let idx2 = memberList[idx].reple.findIndex(ind => { // 사용자가 누른 게시글 번호에 맞는 댓글 번호 찾기
    return ind.repleNum == repleNum;
  });

  if (idx != -1) {
    memberList[idx].reple.splice(idx2, 1);
  }
  
  res.status(200).json(memberList);
});

app.post('/reple/getRepleEditData', (req, res) => {
  const pkNum = parseInt(req.body.pkNum); // 게시글 번호
  const repleNum = req.body.repleNum;     // 댓글 번호

  let idx = memberList.findIndex(ind => { // 사용자가 누른 게시글 번호 찾기
    return ind.pkNum == pkNum;
  });

  let idx2 = memberList[idx].reple.findIndex(ind => { // 사용자가 누른 게시글 번호에 맞는 댓글 번호 찾기
    return ind.repleNum == repleNum;
  });

  res.status(200).json( {idx: idx, idx2: idx2, memberList: memberList} );
});

app.post('/reple/edit', (req, res) => {
  const pkNum = parseInt(req.body.pkNum); // 게시글 번호
  const repleNum = req.body.repleNum;     // 댓글 번호

  let idx = memberList.findIndex(ind => { // 사용자가 누른 게시글 번호 찾기
    return ind.pkNum == pkNum;
  });

  let idx2 = memberList[idx].reple.findIndex(ind => { // 사용자가 누른 게시글 번호에 맞는 댓글 번호 찾기
    return ind.repleNum == repleNum;
  });

  if (idx != -1) {
    memberList[idx].reple[idx2].repleContent = req.body.newRepleContent;
    memberList[idx].reple[idx2].repleWriter = req.body.newRepleWriter;
  }

  res.status(200).json(memberList);
});