const express = require('express');
const Goods = require('../schemas/goods');
const req = require('express/lib/request');
const Cart = require('../schemas/cart');
const router = express.Router();


router.get('/goods/cart', async (req, res) => {
  const carts = await Cart.find();
  const goodsIds = carts.map((cart) => cart.goodsId);

  const goods = await Goods.find({ goodsId: goodsIds});

  const results = carts.map((cart) => {
      return {
          quantity: cart.quantity,
          goods : goods.find((item) => item.goodsId === cart.goodsId),
      };
  });

  

  res.json({
      carts : results,
  })
});


router.get('/', (req,res) => { ///api
    res.send('this is root page');
});

const goods = [
    {
      goodsId: 4,
      name: "상품 4",
      thumbnailUrl:
        "https://cdn.pixabay.com/photo/2016/09/07/02/11/frogs-1650657_1280.jpg",
      category: "drink",
      price: 0.1,
    },
    {
      goodsId: 3,
      name: "상품 3",
      thumbnailUrl:
        "https://cdn.pixabay.com/photo/2016/09/07/02/12/frogs-1650658_1280.jpg",
      category: "drink",
      price: 2.2,
    },
    {
      goodsId: 2,
      name: "상품 2",
      thumbnailUrl:
        "https://cdn.pixabay.com/photo/2014/08/26/19/19/wine-428316_1280.jpg",
      category: "drink",
      price: 0.11,
    },
    {
      goodsId: 1,
      name: "상품 1",
      thumbnailUrl:
        "https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg",
      category: "drink",
      price: 6.2,
    },
  ];


router.get('/goods', (req,res) => { ///api/goods
    res.json({
        goods, //goods = goods key와 value가 같으면 하나만 써도 됨
    });
});

// /goods/1234가 goodsID가 되는 것(아래코드)
router.get('/goods/:goodsId', async (req, res) => {
    const { goodsId } = req.params;

    const [detail] = await Goods.find({ goodsId : Number(goodsId) });


    res.json({
        detail,
    });
});

/* goodsId를 가져와서 주소에 들어가게 되면, 그것은 문자열이다. ===는 타입 체크까지 하기 때문에 
주소에 들어가는 '숫자'와 변수 goods 안에 각 item마다 가지고 있는 goodsId인 숫자는 다르다. */

/* 
router.get('/goods/:goodsId', (req,res) => {
    const goodsId = req.params.goodsId;

    res.json({
        detail : goods.filter((item) => { //goods is Array //filter return type pf array
            return item.goodsId === goodsId;
        }),
    });
}); */

router.post('/goods/:goodsId/cart', async(req, res) => {
  const { goodsId } = req.params; //다 string
  const { quantity } = req.body;

  const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
  if (existsCarts.length) {
    return res.status(400).json({ success: false, errorMessage: '이미 장바구니에 들어있는 상품입니다.' });
  }

  await Cart.create({ goodsId: Number(goodsId), quantity });
  res.json({ success: true});
});


// 위에는 장바구니 추가, 아래는 장바구니 제거
router.delete('/goods/:goodsId/cart', async(req, res) => {
  const { goodsId } = req.params; //다 string

  const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
  if (existsCarts.length) {
    await Cart.deleteOne({ goodsId: Number(goodsId) });
  }

  res.json({ success:true });
});

//HW : 수량을 1 미만으로 보내면 요청 거부기능
router.put('/goods/:goodsId/cart', async(req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body; 

  if ( quantity < 1 ){
    return res.status(400).json({
      errorMessage: '1 이상의 값만 입력할 수 있습니다.'
    });
  }

  const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
  if (!existsCarts.length) { //1이 아닐때, 즉 길이가 0이라는 것은 아무것도 없을때니까 !를 붙여서 부정으로 바꿔준다.
    return res.status(400).json({ success: false, errorMessage: '장바구니에 해당 상품이 없습니다.' });
  }

  await Cart.updateOne({ goodsID: Number(goodsId) }, { $set: { quantity} });


  res.json({ success: true });

});


router.post('/goods', async (req, res) => {
  /*   const goodsId = req.body.goodsId;
    const name = req.body.name;
    const category = req.body.category;
    const price = req.body.price; *///아래랑 똑같음

    const { goodsId, name, thumbnailUrl, category, price } = req.body;

    const goods = await Goods.find({ goodsId });
    if (goods.length){//배열의 길이가 있을때 
        return res.status(400).json({ success : false, errorMessage: '이미 있는 데이터입니다.'});
    }

    const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price });


    res.json({ goods : createdGoods });

});



module.exports = router;
