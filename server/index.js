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

app.post('/member_input_form', (req, res) => {
  console.log("이름 :", req.body.name, "/ 부서 :", req.body.dept, "/ 직급 :", req.body.rank);

  memberList.push( {name: req.body.name, dept: req.body.dept, rank: req.body.rank} );

  // 클라이언트에게 응답
  res.status(200).json(memberList);
});

const server = http.createServer(app);
server.listen(app.get('port'), () => {
  console.log(`connecting nodejs server >>> http://localhost:${app.get('port')}`);
});