import express from 'express';
import dbutils from '../service/dbutils'
import uuid from 'uuid/v4'
let router = express.Router();
let db = new dbutils();

router.all('/web', (req, res, next)=>{
    let params = {...req.query, ...req.body};
    res.render('web', params);
});

router.all('/test', async (req, res, next)=>{
    let params = {...req.query, ...req.body};
    let submits = ['0158cd4f-2331-44ac-8f47-20f92f26301e','9363546a-5e38-477e-92d5-da89d8c2a266','93fe666d-4b38-494d-911f-eac71efefa72','176791d3-6966-45ab-8ffa-5bad18b450a1','02f4f43e-1774-49c4-a16b-0d809f17f066','eac1a137-b868-4006-bd84-07bc219a4764','053be916-fdc9-432e-bd2f-1f7ef941007c','1f1d718e-b29a-44b3-8f21-f4481a1fbbfe','412eb205-36b3-4fb6-b81a-6fbd9a2cae9c','15f435a6-223c-43bd-86ab-f3be03f2f5d3','1a169d59-73d6-48f9-9f15-f1605ac99823','9c904045-f40f-4efb-b19f-aa2f37cdc76e','1e9b6a50-de67-40f8-bd97-e2fc03b3686a','375fbb14-b347-4dc1-aaee-8812785bcc24','2a3bb438-342e-4d43-a2c5-b3cd69c6d96a','ef04c36f-889f-4761-a96d-aee401ec0aec','d7820ee5-084d-48c3-b46a-ffcff0fd89e5','86a5f0c3-4bdb-4045-a84c-46c964c2e34f','477a4a5e-faf9-40bb-b4b4-f4a9e7a58275','a428865a-f16f-452b-bad5-8a1176985944','fa39074e-b3c2-43dd-a378-e29a2f97da1a','42af61ab-f790-403e-bb0c-8e65c6dac429','24b6f3cd-b776-4182-aefe-56fe9706765b','1158d6fd-e535-48e7-bacb-3691aa817fed','a700fd24-7111-4ece-bfb9-fe6a24d22d69','9b532098-a53a-49c4-b660-a991900ad7fa','cf8508ca-6282-4665-a40e-c7947ab644ed','98f21d89-fc22-4fa7-8bef-ba1bc5c63d43','89d122ad-1599-4a8e-8d3c-8f1c49f0b133','dfd57cce-f9de-4d28-8800-27e3e47afa91','bac7fc21-12f6-4ffd-bbcf-fc3d1c1e8e23','09abb142-4c4d-403d-aeb9-06086f9348d9','82be8a14-1032-4148-bec0-953368ad27c8','7cbb1265-60e1-48e5-bace-aae8959e0340','5b0181c6-10d4-4307-84be-3167262fdfb9','e3842601-cc46-4fc8-a89a-6c2eb5bf9e60','fe26bf43-d09d-4611-ab60-e73da81a5180','75673547-200c-4419-ae3b-418435f8676f','fbcc0e47-1d87-4dfa-b2df-7b6c5add5b5c','8025af66-5298-4d55-b1b0-d4618e04386d','5139ef2f-9445-416d-91ea-4729416ad961','aee3d436-b8a4-4273-b2ad-58ac249b2d63','7a26264a-27c6-4a2a-9cff-c97df4917f06','ef23636e-4526-4071-b2b5-25771f3c849d','60f07ca3-3e5d-4c13-a620-f2045916d316','0db141bd-b114-47d5-aeb7-c633d0e6302b','60b32434-de3c-4ebd-9b13-6178d697edee','a08a7a84-8d01-4543-a3bd-c60f31f3426a'];
	let scores = 0;
	console.log('length: '+submits.length);
	await Promise.all(submits.map(async (el, index)=>{
		let [s] = await db.t_submit_query({uuid: el});
		let [{score}] = await db.t_question_query({uuid: s.quuid});
		let [{auuid}] = await db.t_current_quuid_auuid_query({quuid: s.quuid});
		if(auuid == s.auuid){
			scores += score;
			console.log(scores);
		}
		return null;
	}));
    
    res.end('scores: '+scores);
});


router.all('/generate', async (req, res, next)=>{
	let sh = await db.sheet1_query();
	let array = sh.map(el=>{
		let title = el['试题标题'];
		let score = el['试题分数'];
		let currentIndex = el['正确选项'];
		let options = [];
		for(let i=1; i<=8; i++){
			let op = el['试题选项'+i];
			if(op){
				options.push({
					auuid: uuid(),
					name: op,
					answer_type: 5,
					current: currentIndex===i
				});
			}
		}
		return {
			quuid: uuid(),
			title,
			question_type: 1,
			score,
			options
		}
	});
	
	array.forEach(async el=>{
		let {quuid, title, description, question_type, score, university, college} = el;
		let qr = await db.t_question_add({uuid: quuid, title, description, question_type, score, university, college});
		if(qr.affectedRows == 1){
			//插入成功
			el.options.forEach(async option=>{
				let {auuid, name, answer_type} = option;
				let ar = await db.t_answer_add({uuid: auuid, name, answer_type});
			});
			await db.t_quuid_auuid_add({quuid, auuid: el.options.map(el=>el.auuid).join(',')});
			await db.t_current_quuid_auuid_add({quuid, auuid: el.options.filter(el=>el.current).map(el=>el.auuid).join(',')})
		}
	});
	
	res.json(array)
});


//判断题
router.all('/generateQuestions3', async (req, res, next)=>{
	let array = [];
	let getRandom = ()=>{
		return parseInt((Math.random()*100).toFixed(0));
	};
	for(let i=0; i<20; i++){
		let r1 = getRandom();
		let r2 = getRandom();
		let r3 = getRandom();
		let t = getRandom()+getRandom()+getRandom();
		let total = r1+r2+r3;
		while (t==(r1+r2+r3)){ t=getRandom()+getRandom()+getRandom(); }
		let randomFlag = getRandom()>50;
		array.push({
			quuid: uuid(),
			title: r1+'+'+r2+'+'+r3+'='+(randomFlag?total:t)+'?',
			description: '判断题：'+r1+'+'+r2+'+'+r3+'='+(randomFlag?total:t)+'?',
			question_type: 3,
			score: 5,
			university: '金智大学',
			college: '前端学院',
			current: randomFlag,
		});
	}
	
	array.forEach(async el=>{
		let {quuid, title, description, question_type, score, university, college} = el;
		let qr = await db.t_question_add({uuid: quuid, title, description, question_type, score, university, college});
		if(qr.affectedRows == 1){
			//插入成功
			await db.t_quuid_auuid_add({quuid, auuid: '1e0997f8-9add-11e7-a3de-426122843167,269fdb3e-9add-11e7-a3de-426122843167'});
			await db.t_current_quuid_auuid_add({quuid, auuid: (el.current?'1e0997f8-9add-11e7-a3de-426122843167':'269fdb3e-9add-11e7-a3de-426122843167')})
		}
	});

	res.json(array);
});

//多选题
router.all('/generateQuestions2', async (req, res, next)=>{
	let array = [];
	let getRandom = ()=>{
		return parseInt((Math.random()*100).toFixed(0));
	};
	for(let i=0; i<20; i++){
		let r1 = getRandom();
		let r2 = getRandom();
		let r3 = getRandom();
		let t = getRandom();
		let total = r1+r2+r3;
		while (t==r1 || t==r2 || t==r3){ t=getRandom(); }
		array.push({
			quuid: uuid(),
			title: '和值为'+total+'的选项有?',
			description: '计算题：哪些值之和为'+total,
			question_type: 2,
			score: 5,
			university: '金智大学',
			college: '前端学院',
			options: [
				{
					auuid: uuid(),
					name: r1+'',
					answer_type: 5,
					current: true
				},
				{
					auuid: uuid(),
					name: r2+'',
					answer_type: 5,
					current: true
				},
				{
					auuid: uuid(),
					name: r3+'',
					answer_type: 5,
					current: true
				},
				{
					auuid: uuid(),
					name: t+'',
					answer_type: 5,
					current: false
				}
			].sort((a, b)=>parseInt(a.name)-parseInt(b.name)),
		});
	}
	
	array.forEach(async el=>{
		let {quuid, title, description, question_type, score, university, college} = el;
		let qr = await db.t_question_add({uuid: quuid, title, description, question_type, score, university, college});
		if(qr.affectedRows == 1){
			//插入成功
			el.options.forEach(async option=>{
				let {auuid, name, answer_type} = option;
				let ar = await db.t_answer_add({uuid: auuid, name, answer_type});
			});
			await db.t_quuid_auuid_add({quuid, auuid: el.options.map(el=>el.auuid).join(',')});
			await db.t_current_quuid_auuid_add({quuid, auuid: el.options.filter(el=>el.current).map(el=>el.auuid).join(',')})
		}
	});
	
	res.json(array);
	
});

//单选题
router.all('/generateQuestions1', async (req, res, next)=>{
	let params = {...req.query, ...req.body};
	let array = [];
	let getRandom = ()=>{
	    return parseInt((Math.random()*1000).toFixed(0));
    };
	
	for(let i=0; i<2; i++){
	    let r1 = getRandom();
	    let r2 = getRandom();
	    if(array.filter(el=>el.title===r1+'+'+r2+'=?').length>0) continue;
	    let t1 = null;
	    let t2 = null;
	    while ((t1=getRandom()+getRandom()) === (r1+r2)){ t1=getRandom()+getRandom(); }
	    while ((t2=getRandom()+getRandom()) === (r1+r2)){ t2=getRandom()+getRandom(); }
		array.push({
			quuid: uuid(),
            title: r1+'+'+r2+'=?',
            description: '计算题：'+r1+'+'+r2,
            question_type: 1,
            score: 5,
			university: '金智大学',
			college: '前端学院',
            options: [
	            {
	            	auuid: uuid(),
		            name: r1+r2+'',
		            answer_type: 5,
                    current: true
	            },
                {
	                auuid: uuid(),
                    name: t1+'',
                    answer_type: 5,
	                current: false
                },
                {
	                auuid: uuid(),
                    name: t2+'',
                    answer_type: 5,
	                current: false
                }
            ].sort((a, b)=>parseInt(a.name)-parseInt(b.name)),
        });
    }
    
    // array.forEach(async el=>{
    //     let {quuid, title, description, question_type, score, university, college} = el;
    //     let qr = await db.t_question_add({uuid: quuid, title, description, question_type, score, university, college});
    //     if(qr.affectedRows == 1){
    //         //插入成功
	 //        el.options.forEach(async option=>{
		//         let {auuid, name, answer_type} = option;
		//         let ar = await db.t_answer_add({uuid: auuid, name, answer_type});
	 //        });
	 //        await db.t_quuid_auuid_add({quuid, auuid: el.options.map(el=>el.auuid).join(',')});
	 //        await db.t_current_quuid_auuid_add({quuid, auuid: el.options.filter(el=>el.current).map(el=>el.auuid).join(',')})
    //     }
    // });
	
	res.json(array);
	
});




module.exports = router;
