import mysql from 'promise-mysql'

class dbutils {
  constructor() {

    this.cfg = {
      connectionLimit: 10,
      host: 'rm-bp1l127cta7kxe7l5o.mysql.rds.aliyuncs.com',
      port: '3306',
      user: 'microapp',
      password: 'microapp1qaz@2017',
      database: 'wec_micro_knowledge_competition'
    };

     //this.cfg = {
     //  connectionLimit: 10,
     //  host: '172.16.7.111',
     //  port: '3306',
     //  user: 'admin',
     //  password: 'wisedu@2016',
     //  database: 'wec_zsjs'
     //};
    // this.cfg = {
    //     connectionLimit : 10,
    //    host: 'rm-bp1l127cta7kxe7l5o.mysql.rds.aliyuncs.com',
    //    port: '3306',
    //    user: 'microqatest',
    //    password: 'microqatest2wsx@2017',
    //    database: 'wec_micro_qatest'
    // };
    // this.pool = mysql.createPool(this.cfg);
    this.pool = {
      releaseConnection: (con) => {
        return new Promise((resolve, reject) => {
          if (con && con.end) {
            con.end();
            resolve()
          } else {
            reject()
          }
        })
      }
    };
    
    [
      't_answer',
      't_current_quuid_auuid',
      't_dic',
      't_question',
      't_question_process',
      't_question_setting',
      't_quuid_auuid',
      't_submit',
      't_user_submission',
      't_user_submission_race_rank',
      'v_user_rank',
      'v_college_rank',
      'v_question',
    ].forEach(el => {
      this[el + '_add'] = async (params = {}) => {
        try {
          let con = await this.getConnection();
          let pkeys = Object.keys(params);
          let result = await con.query(`insert into ${el}(${pkeys.join(',')}) values(${pkeys.map(el => '?').join(',')}) `,
            pkeys.map(el => params[el]));
          await this.pool.releaseConnection(con);
          return result;
        } catch (e) {
          console.log(`${el}_add 出错！`);
          return new Error(`${el}_add 出错！`);
        }
      };
      this[el + '_delete'] = async (conditions = {}) => {
        try {
          let ckeys = Object.keys(conditions);
          if (ckeys.length < 1) return null;
          let con = await this.getConnection();
          let result = await con.query(`delete from ${el} where ${ckeys.map(el => el + '=?').join(' and ')}`,
            ckeys.map(el => conditions[el]));
          await this.pool.releaseConnection(con);
          return result;
        } catch (e) {
          console.log(`${el}_delete 出错！`);
          return new Error(`${el}_delete 出错！`);
        }
      };
      this[el + '_update'] = async (params = {}, conditions = {}) => {
        try {
          let ckeys = Object.keys(conditions);
          if (ckeys.length < 1) return null;
          let con = await this.getConnection();
          let pkeys = Object.keys(params);
          let result = await con.query(`update ${el} set ${pkeys.map(el => el + '=?').join(',')} where ${ckeys.map(el => el + '=?').join(' and ')}`,
            [...pkeys.map(el => params[el]), ...ckeys.map(el => conditions[el])]);
          await this.pool.releaseConnection(con);
          return result;
        } catch (e) {
          console.log(`${el}_update 出错！`);
          return new Error(`${el}_update 出错！`);
        }
      };
      this[el + '_query'] = async (conditions = {}, limit = null) => {
        try {
          let ckeys = Object.keys(conditions);
          let con = await this.getConnection();
          let result = await con.query(`select * from ${el} ${ckeys.length > 0 ? 'where' : ''} ${ckeys.map(el => el + '=?').join(' and ')} ${limit ? 'limit ' + limit : ''}`,
            ckeys.map(el => conditions[el]));
          await this.pool.releaseConnection(con);
          return result;
        } catch (e) {
          console.log(`${el}_query 出错！`);
          return new Error(`${el}_query 出错！`);
        }
      }
    })
    
  }
  
  closePool() {
    return this.pool.end().catch(e => {
      console.error(e)
    });
  }
  
  getConnection() {
    return mysql.createConnection(this.cfg)
    // return new Promise((resolve, reject)=>{
    //     this.pool.getConnection().then(con=>resolve(con)).catch(e=>reject(e))
    // });
  }
  
  async getRandomQuestion(conditions = {}, limit = 20) {
    let ckeys = Object.keys(conditions);
    let con = await this.getConnection();
    let result = await con.query(`select * from v_question ${ckeys.length > 0 ? 'where' : ''} ${ckeys.map(el => el + '=?').join(' and ')} order by rand() limit ${limit}`,
      ckeys.map(el => conditions[el]));
    await this.pool.releaseConnection(con);
    return result;
  }
  
  async getRandomQuestionWithOptions(options = []) {
    let r1 = await Promise.all(options.map(({conditions, limit}) => {
      return this.getRandomQuestion(conditions, limit)
    }));
    let result = await Promise.all(r1.map(async el => {
      let tmp = await Promise.all(el.map(async item1 => {
        let {options} = item1;
        if(!options) console.log(item1);
        let reoptions = await Promise.all(options.split(',').map(async item2 => {
          return (await this.t_answer_query({uuid: item2}))[0]
        }));
        item1.options = reoptions;
        return item1;
      }));
      return tmp;
    }));
    return result;
  }
  
  async queryQuestionsBatch(uuidRange = []) {
    if (uuidRange.length < 1) return null;
    let con = await this.getConnection();
    let result = await con.query(`select * from v_question where uuid in (${uuidRange.map(el => '?').join(',')})`,
      uuidRange);
    await this.pool.releaseConnection(con);
    return result;
  }

  // add by guxuewu
  async getUserCount(userId){
    let con = await this.getConnection();
    let result = await con.query(`select count(*) as count from t_user_submission where student_id = '${userId}'`,userId);
    await this.pool.releaseConnection(con);
    return result;
  }
  
  async getMyRank() {
    let con = await this.getConnection();
    let result = await con.query(`select (@rowNum:=@rowNum+1) as rowNo, vur.* from v_user_rank vur, (select(@rowNum :=0)) r`);
    await this.pool.releaseConnection(con);
    return result;
  }
  
}

export default dbutils
