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
let pkNum = 1;
let imageCnt = 1;

const server = http.createServer(app);
server.listen(app.get('port'), () => {
  console.log(`connecting nodejs server >>> http://localhost:${app.get('port')}`);
});

app.post('/list', (req, res) => {
  console.log("남은 회원 리스트 :", memberList);

  res.status(200).json(memberList);
});

app.post('/submit', (req, res) => {
  console.log("회원가입한 회원 /// 이름 :", req.body.name, "/ 부서 :", req.body.dept, "/ 직급 :", req.body.rank);

  memberList.push( {pkNum: pkNum++, name: req.body.name, dept: req.body.dept, rank: req.body.rank, imageCnt: imageCnt++} );

  // 클라이언트에게 응답
  res.status(200).json({success: true});
});

app.post('/delete', (req, res) => {
  let pkNum = parseInt(req.body.pkNum); // string -> number
  
  let idx = memberList.findIndex(ind => {
    return ind.pkNum == pkNum;
  });

  if (idx != -1) {
    memberList.splice(idx, 1);
  }
  
  res.status(200).json(memberList);
});

app.post('/getEditData', (req, res) => {
  let pkNum = parseInt(req.body.pkNum); // string -> number

  let idx = memberList.findIndex(ind => {
    return ind.pkNum == pkNum;
  });

  res.status(200).json( {idx: idx, memberList: memberList} );
});

app.post('/edit', (req, res) => {
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
})