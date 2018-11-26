

DELETE from t_answer; -- 删除答案
DELETE from t_question; -- 删除题目
DELETE from t_quuid_auuid; -- 删除题目和答案的关系数据
DELETE from t_current_quuid_auuid;-- 删除题目中的准确答案


DELETE from t_question_process; -- 删除答题过程
DELETE from t_submit;  -- 删除用户答题记录
DELETE from t_user_submission;-- 删除用户答题记录
DELETE from t_user_submission_race_rank;-- 删除用户答题排名信息