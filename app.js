const express = require('express'); //변수 expree에다가 app.js가 실행이 되면 'express'를 불러온다
const connect = require('./schemas');
const app = express();
const port = 3000;

connect(); //connect 함수가 실행 index.js에서. 몽고

const goodsRouter = require('./routes/goods');

const requestMiddleware = (req, res, next) => {
    console.log('Request URL:',req.originalUrl,' - ', new Date());
    next();
}; 

app.use(express.json()); //json형태의 데이터를 파싱해주는 미들웨어
app.use(requestMiddleware);//use는 미들웨어이기 때문에 get, listen 위에 써야 영향을 줌


app.use('/api', [ goodsRouter] );


app.get('/', (req, res) => {
    res.send('Hello World');
});
//'/' : 주소가 / 로 끝날 때 다음 걸 진행해주겠다는 의미
//코드를 변경하면 ctr + c 해서 서버를 껐다가 다시 켜줘야 된다

app.listen(port, () => { /* app.listen : 포트를 켜겠다 */
    console.log(port, '포트로 서버가 열렸어요!');
});
