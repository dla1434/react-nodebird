const express = require('express');
const db = require('../models');
const sequelize = require('../models').sequelize;

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const query = 'select * from users where email = :email';
    const values = {
      email: 'test@email.com',
    };

    //성공
    sequelize.query(query, { replacements: values }).then((memo) => {
      console.log('memo', memo);
      console.log('-------------------------------------------------');
      console.log('dataValues', memo.dataValues);
      res.send(memo);
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;

//에러 발생) sequelize spread is not a function
// sequelize.query(query, { replacements: values }).spread(
//   function (reuslts, metadata) {
//     console.log('suc', reuslts, metadata);
//     res.send(reuslts);
//   },
//   function (err) {
//     console.error(err);
//     res.send(reuslts);
//   }
// );

// 실패
// sequelize.query(query, { replacements: values }).spread((memo, created) => {
//   if (created) {
//     console.log('created', memo.dataValues);
//   } else {
//     console.log('not created', memo.dataValues);
//   }
// });
