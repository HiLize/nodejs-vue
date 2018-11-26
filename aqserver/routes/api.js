import express from 'express';
import dbutils from '../service/dbutils'
import uuid from 'uuid/v4'
import moment from 'moment'
import {generateResult} from '../service/utils'
import fs from 'fs'
import ejsExcel from 'ejsexcel'

let router = express.Router();
let db = new dbutils();

[
  'v_user_rank_query',
  'v_college_rank_query',
].forEach(el => {
  router.all('/' + el, async (req, res, next) => {
    let params = {...req.query, ...req.body};
    let result = await db[el]({}, params.limit);
    res.json(generateResult(result));
  });
});

// router.all('/getRandomQuestion', async (req, res, next)=>{
// 	let params = {...req.query, ...req.body};
// 	let result = await db.getRandomQuestion({
// 		question_type_id: 2
// 	}, 10);
// 	res.json(result);
// });


router.all('/getMyRank', async (req, res, next) => {
  let params = {...req.query, ...req.body};
  let all = await db.getMyRank();
  let array = all.filter(el => el.student_id == params.student_id);
  if (array && array.length > 0) {
    res.json(generateResult(array[0]))
  } else {
    res.json(generateResult(null, 1003, '未找到用户排名数据'));
  }
});

// add by guxuewu
router.all('/getCountLimit', async (req, res, next) => {
  let params = {...req.query, ...req.body};
  let {collegeId, student_id} = params;
  let queryId = 1;
  if (collegeId) {
    queryId = collegeId
  }

  let setting = await db.t_question_setting_query({id: queryId});
  if (!setting || !setting[0] || !setting[0].json) {
    res.json(generateResult(null, 2001, `未查询到collegeId为${collegeId}设置信息`));
    return;
  }
  let {limitCount} = JSON.parse(setting[0].json);
  
  if (!limitCount) {
    limitCount = 0
  }

  // 查询学生已经答题了多少次
  if (!student_id) {
    res.json(generateResult(null, 2003, '未查询到学号'));
    return;
  }

  let nowUserCount = await db.getUserCount(student_id);
  if(!nowUserCount||nowUserCount.length === 0){
    nowUserCount = 0
  } else {
    nowUserCount = nowUserCount[0].count
  }
  res.json(generateResult({limitCount: limitCount, nowUserCount:nowUserCount}));
})


router.all('/getRandomQuestionWithOptions', async (req, res, next) => {
  let params = {...req.query, ...req.body};
  let {collegeId, student_id} = params;
  
  let queryId = 1;
  if (collegeId) {
    queryId = collegeId
  }
  
  let setting = await db.t_question_setting_query({id: queryId});
  if (!setting || !setting[0] || !setting[0].json) {
    res.json(generateResult(null, 2001, `未查询到collegeId为${collegeId}设置信息`));
    return;
  }
  let {options, rangeTime} = JSON.parse(setting[0].json);
  
  let now = moment().toDate().getTime();
  if (now < moment(rangeTime.from).toDate().getTime()) {
    res.json(generateResult(null, 2001, '答题时间未开始'));
    return;
  }
  if (now > moment(rangeTime.to).toDate().getTime()) {
    res.json(generateResult(null, 2002, '答题时间已过'));
    return;
  }
  if (!student_id) {
    res.json(generateResult(null, 2003, '未查询到学号'));
    return;
  }
  
  let [dic, result] = await Promise.all([
    db.t_dic_query({type: 'question_type'}),
    db.getRandomQuestionWithOptions(options)
  ]);
  let addQuestions = [];
  let questionProcessUUID = uuid();
  result.forEach(el => el.forEach(i => addQuestions.push(i.uuid)));
  await db.t_question_process_add({
    uuid: questionProcessUUID,
    student_id: student_id,
    answer_time_from: moment().format('YYYY-MM-DD HH:mm:ss'),
    questions_uuid: addQuestions.sort().join(',')
  });
  result = result.map((el, index) => {
    return {
      question_type_id: options[index].conditions.question_type_id,
      question_type_name: dic.filter(el => el.id == options[index].conditions.question_type_id)[0].name,
      datas: el.map(e => {
        delete e.answers;
        return e;
      })
    }
  });
  
  if (result) {
    res.json(generateResult({
      questionProcessUUID,
      result,
    }));
  } else {
    res.json(generateResult(null, 1001, '查询失败'));
  }
  
});

router.all('/submit', async (req, res, next) => {
  let params = {...req.query, ...req.body};
  let {questionProcessUUID, student_id, name, university, college, quuid_auuid, img} = params;
  if (!questionProcessUUID || !student_id) {
    res.json(generateResult(null, 1011, '缺少提交参数'));
    return;
  }
  let [tqp] = await db.t_question_process_query({
    uuid: questionProcessUUID,
    student_id,
  });
  if (!tqp) {
    res.json(generateResult(null, 1012, '未查询到此次问答信息，请重新答卷'));
    return;
  } else if (tqp.answer_time_to) {
    res.json(generateResult(null, 1012, '已有提交数据，请重新作答'));
    return;
  }
  quuid_auuid = JSON.parse(quuid_auuid);
  if (tqp.questions_uuid !== Object.keys(quuid_auuid).sort().join(',')) {
    res.json(generateResult(null, 1010, '不符合提交条件，请重新答卷'));
    return;
  }
  
  let questionsBatch = await db.queryQuestionsBatch(Object.keys(quuid_auuid));
  let score = 0;
  let pArray = [];
  let submitUuidArray = [];
  let current_qa = [];
  questionsBatch.forEach(el => {
    current_qa.push({
      key: el.uuid,
      value: el.answers,
      type: el.question_type_id
    });
    let currentAnswerStr = el.answers.split(',').sort().join(',');
    let userAnswerStr = '';
    if (quuid_auuid[el.uuid] instanceof Array) {
      userAnswerStr = quuid_auuid[el.uuid].sort().join(',');
    } else {
      userAnswerStr = quuid_auuid[el.uuid].split(',').sort().join(',');
    }
    // console.log('currentAnswerStr::'+currentAnswerStr);
    // console.log('userAnswerStr::'+userAnswerStr);
    if (currentAnswerStr === userAnswerStr) {
      //此题回答正确
      score += el.score;
    }
    let cuuid = uuid();
    submitUuidArray.push(cuuid);
    pArray.push(db.t_submit_add({
      uuid: cuuid,
      quuid: el.uuid,
      auuid: userAnswerStr,
    }));
  });
  let submit_result = await Promise.all(pArray);
  let nowTime = moment();
  let cost_time = parseInt((nowTime.toDate().getTime() - moment(tqp.answer_time_from).toDate().getTime()) / 1000);
  let submissionAddUUID = uuid();
  let submission_result = await db.t_user_submission_add({
    uuid: submissionAddUUID,
    student_id,
    name,
    img,
    submit_uuid: submitUuidArray.join(','),
    score,
    answer_time_from: moment(tqp.answer_time_from).format('YYYY-MM-DD HH:mm:ss'),
    answer_time_to: nowTime.format('YYYY-MM-DD HH:mm:ss'),
    cost_time,
    university,
    college,
  });
  await db.t_question_process_update({
    answer_time_to: nowTime.format('YYYY-MM-DD HH:mm:ss'),
  }, {
    uuid: tqp.uuid,
  });
  
  
  let allSubmitAffectedRows = submit_result.filter(el => el.affectedRows == 1);
  if (allSubmitAffectedRows.length == pArray.length && submission_result.affectedRows == 1) {
    let raceRankInfo = await db.t_user_submission_race_rank_query({university, student_id});
    if (raceRankInfo.length > 0) {
      let [nowBestInfo] = raceRankInfo;
      if (nowBestInfo.score < score
        || (nowBestInfo.score === score && nowBestInfo.cost_time > cost_time)) {
        await Promise.all([
          db.t_user_submission_race_rank_add({
            uuid: submissionAddUUID,
            student_id,
            name,
            img,
            submit_uuid: submitUuidArray.join(','),
            score,
            answer_time_from: moment(tqp.answer_time_from).format('YYYY-MM-DD HH:mm:ss'),
            answer_time_to: nowTime.format('YYYY-MM-DD HH:mm:ss'),
            cost_time,
            university,
            college,
          }),
          db.t_user_submission_race_rank_delete({
            uuid: nowBestInfo.uuid
          })
        ]);
      }
    } else {
      await db.t_user_submission_race_rank_add({
        uuid: submissionAddUUID,
        student_id,
        name,
        img,
        submit_uuid: submitUuidArray.join(','),
        score,
        answer_time_from: moment(tqp.answer_time_from).format('YYYY-MM-DD HH:mm:ss'),
        answer_time_to: nowTime.format('YYYY-MM-DD HH:mm:ss'),
        cost_time,
        university,
        college,
      });
    }
    res.json(generateResult({score, current_qa, cost_time}));
  } else {
    await db.t_user_submission_delete({uuid: submissionAddUUID});
    res.json(generateResult(null, 1002, '提交失败'));
  }
  
});


// 用于导入数据的接口
router.all('/insertData', async (req, res, next) => {
    if(req.query.import != 'ningbo'){
    console.log("************  can not import");
      res.json({result:'ignore'});
      return;
    }
    let exBuf=fs.readFileSync('public/宁大.xlsx');
    //return;
    ejsExcel.getExcelArr(exBuf).then( async (exlJson)=>{
      console.log("************  read success:getExcelArr");
      let workSheets=exlJson[0];
      console.log("************** import item"+exlJson);
      workSheets.forEach( async (item,index)=>{

        if (item && item.length > 0 && index > 0) {
          let name = item[0]
           console.log("************** import item name:"+name);
          let rightAnsIndex =  item[1]-1
  
          let ansA = item[2]
          let ansB = item[3]
          let ansC= item[4]
          let ansD = item[5]
  
          //1.向t_answer表中逐条插入答案
          let ansAUUID = uuid();
          let ansBUUID = uuid();
          let ansCUUID = uuid();
          let ansDUUID = uuid();
          let ansUUIDs = [ansAUUID,ansBUUID,ansCUUID,ansDUUID]
  
          let nowTime = moment();
  
          await db.t_answer_add({
            uuid: ansAUUID,
            name: ansA,
            answer_type: 5,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            modify_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            state: 0
          });
  
          await db.t_answer_add({
            uuid: ansBUUID,
            name: ansB,
            answer_type: 5,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            modify_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            state: 0
          });
  
          await db.t_answer_add({
            uuid: ansCUUID,
            name: ansC,
            answer_type: 5,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            modify_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            state: 0
          });
  
          await db.t_answer_add({
            uuid: ansDUUID,
            name: ansD,
            answer_type: 5,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            modify_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            state: 0
          });
  
          //2.向t_question表中插入问题
          let questionUUID = uuid();
          await db.t_question_add({
            uuid: questionUUID,
            title: name,
            description: '',
            question_type: 1,
            score: 4,
            university: '',
            college: '',
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            modify_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            state: 0
          });
  
          //3.向t_current_quuid_auuid插入正确的答案
          await db.t_current_quuid_auuid_add({
            quuid: questionUUID,
            auuid: ansUUIDs[rightAnsIndex],
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            modify_time: moment().format('YYYY-MM-DD HH:mm:ss')
          });
  
          //4.向t_quuid_auuid插入题目，答案关系
          await db.t_quuid_auuid_add({
            quuid: questionUUID,
            auuid: ansUUIDs.join(','),
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            modify_time: moment().format('YYYY-MM-DD HH:mm:ss')
          });
        }
      })

      res.json({result:'ok'});
    }).catch(error=>{
        console.log("************** had error!");
        console.log(error);
       res.json({result:'error'});
    });
});




module.exports = router;
