const fs = require('fs');
const express = require('express');
const router = express.Router();

const interview = require('./interview');

const sendMessage = require('../telegram/sendMessage');
const sendPhoto = require('../telegram/sendPhoto');

const addUser = require('../db/addUser');
const getInfo = require('../db/getInfo');
const updateState = require('../db/updateState');

const keyboardsSrcJSON = fs.readFileSync('./telegram/keyboards.json');
const keyboards = JSON.parse(keyboardsSrcJSON);

router.post('/', async (req, res, next) => {
  
  let command = req.body.message.text;
  let ID = req.body.message.from.id;

  if(command === '/start') {
    
    await sendMessage(ID, 'Добро пожаловать!');
    await sendMessage(ID, 'Начать опрос?', keyboards.keyboard_start);
    
    let resUpdateState = await addUser(ID);

  } else {

    let nextQuestion;
    let userInfo = await getInfo(ID);

    if(command === 'Начать' && userInfo.curEvent === 'start') {

      await sendMessage(ID, 'Для получения результата отвечайте на вопросы');
      nextQuestion = interview(userInfo);
      
    } else if(command === 'Позже' && userInfo.curEvent === 'start') {
  
      await sendMessage(ID, 'Как только захотите пройти, напишите /start');
    
    } else {

      nextQuestion = await interview(userInfo, command);

      if (!nextQuestion) {
        
        let pathPic = `src/images/${userInfo.curEvent}.jpg`;
        let stream = fs.createReadStream(pathPic);
        let sizeFile = fs.statSync(pathPic).size;

        await sendMessage(ID, 'Ваш результат:');
        await sendPhoto(ID, stream, 'Результат', sizeFile);

        await updateState(ID, {chatID: ID, curEvent: 'end', curQuestion: 0});

      }
      
    }

  }

  res.end();
});

module.exports = router;
