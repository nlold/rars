const fs = require('fs');

const sendMessage = require('../telegram/sendMessage');

const updateState = require('../db/updateState');

const questionsSrcJSON = fs.readFileSync('./src/questions.json');
const questions = JSON.parse(questionsSrcJSON);

const keyboardsSrcJSON = fs.readFileSync('./telegram/keyboards.json');
const keyboards = JSON.parse(keyboardsSrcJSON);

async function interview(userInfo, command = 'start') {

  if (command === 'start') {
    
    await sendMessage(userInfo.chatID, questions.age18[0], keyboards.keyboard_answer);
    await updateState(userInfo.chatID, {chatID: userInfo.chatID, curEvent: 'age18', curQuestion: 0});

    return true;
  
  } else {

    if (command === 'Да') return false;
    else if (command === 'Нет') {

      if (userInfo.curQuestion + 1 === questions[userInfo.curEvent].length) {

        let newEvent = getNewEvent(userInfo.curEvent);

        if(!newEvent) {
          await updateState(userInfo.chatID, {chatID: userInfo.chatID, curEvent: 'end', curQuestion: 0});
          await sendMessage(userInfo.chatID, 'Какой вы ожидаете результат при таких ответах? Можете собраться с мыслями и попробовать заново.');
          return true;
        } 

        await sendMessage(userInfo.chatID, questions[newEvent][0], keyboards.keyboard_answer);
        await updateState(userInfo.chatID, {chatID: userInfo.chatID, curEvent: newEvent, curQuestion: 0});

        return true;
      }

      await sendMessage(userInfo.chatID, questions[userInfo.curEvent][userInfo.curQuestion + 1], keyboards.keyboard_answer);
      await updateState(userInfo.chatID, {chatID: userInfo.chatID, curEvent: userInfo.curEvent, curQuestion: userInfo.curQuestion + 1});

      return true;
    }

  }

}

function getNewEvent(curEvent) {
  switch(curEvent) {
    case 'age18':
      return 'age16';
    case 'age16':
      return 'age12'; 
    case 'age12':
      return 'age6';
    case 'age6':
      return 'age0';
    case 'age0':
      return null;
  }
}

module.exports = interview;