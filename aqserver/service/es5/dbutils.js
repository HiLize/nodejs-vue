'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _promiseMysql = require('promise-mysql');

var _promiseMysql2 = _interopRequireDefault(_promiseMysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dbutils = function () {
	function dbutils() {
		var _this = this;

		_classCallCheck(this, dbutils);

		// this.cfg = {
		//     connectionLimit : 10,
		//     host     	: '127.0.0.1',
		//     port        : '3306',
		//     user     	: 'root',
		//     password 	: '123123',
		//     database 	: 'answerquestion'
		// };
		this.cfg = {
			connectionLimit: 10,
			host: 'rm-bp1l127cta7kxe7l5o.mysql.rds.aliyuncs.com',
			port: '3306',
			user: 'microqatest',
			password: 'microqatest2wsx@2017',
			database: 'wec_micro_qatest'
		};
		// this.pool = mysql.createPool(this.cfg);
		this.pool = {
			releaseConnection: function releaseConnection(con) {
				return new Promise(function (resolve, reject) {
					if (con && con.end) {
						con.end();
						resolve();
					} else {
						reject();
					}
				});
			}
		};

		['t_answer', 't_current_quuid_auuid', 't_dic', 't_question', 't_question_setting', 't_quuid_auuid', 't_submit', 't_user_submission', 'v_user_rank', 'v_college_rank', 'v_question', 'sheet1'].forEach(function (el) {
			_this[el + '_add'] = function () {
				var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
					var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
					var con, pkeys, result;
					return regeneratorRuntime.wrap(function _callee$(_context) {
						while (1) {
							switch (_context.prev = _context.next) {
								case 0:
									_context.prev = 0;
									_context.next = 3;
									return _this.getConnection();

								case 3:
									con = _context.sent;
									pkeys = Object.keys(params);
									_context.next = 7;
									return con.query('insert into ' + el + '(' + pkeys.join(',') + ') values(' + pkeys.map(function (el) {
										return '?';
									}).join(',') + ') ', pkeys.map(function (el) {
										return params[el];
									}));

								case 7:
									result = _context.sent;
									_context.next = 10;
									return _this.pool.releaseConnection(con);

								case 10:
									return _context.abrupt('return', result);

								case 13:
									_context.prev = 13;
									_context.t0 = _context['catch'](0);

									console.log(el + '_add \u51FA\u9519\uFF01');
									return _context.abrupt('return', new Error(el + '_add \u51FA\u9519\uFF01'));

								case 17:
								case 'end':
									return _context.stop();
							}
						}
					}, _callee, _this, [[0, 13]]);
				}));

				return function () {
					return _ref.apply(this, arguments);
				};
			}();
			_this[el + '_delete'] = function () {
				var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
					var conditions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
					var ckeys, con, result;
					return regeneratorRuntime.wrap(function _callee2$(_context2) {
						while (1) {
							switch (_context2.prev = _context2.next) {
								case 0:
									_context2.prev = 0;
									ckeys = Object.keys(conditions);

									if (!(ckeys.length < 1)) {
										_context2.next = 4;
										break;
									}

									return _context2.abrupt('return', null);

								case 4:
									_context2.next = 6;
									return _this.getConnection();

								case 6:
									con = _context2.sent;
									_context2.next = 9;
									return con.query('delete from ' + el + ' where ' + ckeys.map(function (el) {
										return el + '=?';
									}).join(' and '), ckeys.map(function (el) {
										return params[el];
									}));

								case 9:
									result = _context2.sent;
									_context2.next = 12;
									return _this.pool.releaseConnection(con);

								case 12:
									return _context2.abrupt('return', result);

								case 15:
									_context2.prev = 15;
									_context2.t0 = _context2['catch'](0);

									console.log(el + '_delete \u51FA\u9519\uFF01');
									return _context2.abrupt('return', new Error(el + '_delete \u51FA\u9519\uFF01'));

								case 19:
								case 'end':
									return _context2.stop();
							}
						}
					}, _callee2, _this, [[0, 15]]);
				}));

				return function () {
					return _ref2.apply(this, arguments);
				};
			}();
			_this[el + '_update'] = function () {
				var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
					var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
					var conditions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
					var ckeys, con, pkeys, result;
					return regeneratorRuntime.wrap(function _callee3$(_context3) {
						while (1) {
							switch (_context3.prev = _context3.next) {
								case 0:
									_context3.prev = 0;
									ckeys = Object.keys(conditions);

									if (!(ckeys.length < 1)) {
										_context3.next = 4;
										break;
									}

									return _context3.abrupt('return', null);

								case 4:
									_context3.next = 6;
									return _this.getConnection();

								case 6:
									con = _context3.sent;
									pkeys = Object.keys(params);
									_context3.next = 10;
									return con.query('update ' + el + ' set ' + pkeys.map(function (el) {
										return el + '=?';
									}).join(',') + ' where ' + ckeys.map(function (el) {
										return el + '=?';
									}).join(' and '), [].concat(_toConsumableArray(pkeys.map(function (el) {
										return params[el];
									})), _toConsumableArray(ckeys.map(function (el) {
										return conditions[el];
									}))));

								case 10:
									result = _context3.sent;
									_context3.next = 13;
									return _this.pool.releaseConnection(con);

								case 13:
									return _context3.abrupt('return', result);

								case 16:
									_context3.prev = 16;
									_context3.t0 = _context3['catch'](0);

									console.log(el + '_update \u51FA\u9519\uFF01');
									return _context3.abrupt('return', new Error(el + '_update \u51FA\u9519\uFF01'));

								case 20:
								case 'end':
									return _context3.stop();
							}
						}
					}, _callee3, _this, [[0, 16]]);
				}));

				return function () {
					return _ref3.apply(this, arguments);
				};
			}();
			_this[el + '_query'] = function () {
				var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
					var conditions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
					var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
					var ckeys, con, result;
					return regeneratorRuntime.wrap(function _callee4$(_context4) {
						while (1) {
							switch (_context4.prev = _context4.next) {
								case 0:
									_context4.prev = 0;
									ckeys = Object.keys(conditions);
									_context4.next = 4;
									return _this.getConnection();

								case 4:
									con = _context4.sent;
									_context4.next = 7;
									return con.query('select * from ' + el + ' ' + (ckeys.length > 0 ? 'where' : '') + ' ' + ckeys.map(function (el) {
										return el + '=?';
									}).join(' and ') + ' ' + (limit ? 'limit ' + limit : ''), ckeys.map(function (el) {
										return conditions[el];
									}));

								case 7:
									result = _context4.sent;
									_context4.next = 10;
									return _this.pool.releaseConnection(con);

								case 10:
									return _context4.abrupt('return', result);

								case 13:
									_context4.prev = 13;
									_context4.t0 = _context4['catch'](0);

									console.log(el + '_query \u51FA\u9519\uFF01');
									return _context4.abrupt('return', new Error(el + '_query \u51FA\u9519\uFF01'));

								case 17:
								case 'end':
									return _context4.stop();
							}
						}
					}, _callee4, _this, [[0, 13]]);
				}));

				return function () {
					return _ref4.apply(this, arguments);
				};
			}();
		});
	}

	_createClass(dbutils, [{
		key: 'closePool',
		value: function closePool() {
			return this.pool.end().catch(function (e) {
				console.error(e);
			});
		}
	}, {
		key: 'getConnection',
		value: function getConnection() {
			return _promiseMysql2.default.createConnection(this.cfg);
			// return new Promise((resolve, reject)=>{
			//     this.pool.getConnection().then(con=>resolve(con)).catch(e=>reject(e))
			// });
		}
	}, {
		key: 'getRandomQuestion',
		value: function () {
			var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
				var conditions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
				var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
				var ckeys, con, result;
				return regeneratorRuntime.wrap(function _callee5$(_context5) {
					while (1) {
						switch (_context5.prev = _context5.next) {
							case 0:
								ckeys = Object.keys(conditions);
								_context5.next = 3;
								return this.getConnection();

							case 3:
								con = _context5.sent;
								_context5.next = 6;
								return con.query('select * from v_question ' + (ckeys.length > 0 ? 'where' : '') + ' ' + ckeys.map(function (el) {
									return el + '=?';
								}).join(' and ') + ' order by rand() limit ' + limit, ckeys.map(function (el) {
									return conditions[el];
								}));

							case 6:
								result = _context5.sent;
								_context5.next = 9;
								return this.pool.releaseConnection(con);

							case 9:
								return _context5.abrupt('return', result);

							case 10:
							case 'end':
								return _context5.stop();
						}
					}
				}, _callee5, this);
			}));

			function getRandomQuestion() {
				return _ref5.apply(this, arguments);
			}

			return getRandomQuestion;
		}()
	}, {
		key: 'getRandomQuestionWithOptions',
		value: function () {
			var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
				var _this2 = this;

				var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
				var r1, result;
				return regeneratorRuntime.wrap(function _callee9$(_context9) {
					while (1) {
						switch (_context9.prev = _context9.next) {
							case 0:
								_context9.next = 2;
								return Promise.all(options.map(function (_ref7) {
									var conditions = _ref7.conditions,
									    limit = _ref7.limit;

									return _this2.getRandomQuestion(conditions, limit);
								}));

							case 2:
								r1 = _context9.sent;
								_context9.next = 5;
								return Promise.all(r1.map(function () {
									var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(el) {
										var tmp;
										return regeneratorRuntime.wrap(function _callee8$(_context8) {
											while (1) {
												switch (_context8.prev = _context8.next) {
													case 0:
														_context8.next = 2;
														return Promise.all(el.map(function () {
															var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(item1) {
																var options, reoptions;
																return regeneratorRuntime.wrap(function _callee7$(_context7) {
																	while (1) {
																		switch (_context7.prev = _context7.next) {
																			case 0:
																				options = item1.options;
																				_context7.next = 3;
																				return Promise.all(options.split(',').map(function () {
																					var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(item2) {
																						return regeneratorRuntime.wrap(function _callee6$(_context6) {
																							while (1) {
																								switch (_context6.prev = _context6.next) {
																									case 0:
																										_context6.next = 2;
																										return _this2.t_answer_query({ uuid: item2 });

																									case 2:
																										return _context6.abrupt('return', _context6.sent[0]);

																									case 3:
																									case 'end':
																										return _context6.stop();
																								}
																							}
																						}, _callee6, _this2);
																					}));

																					return function (_x12) {
																						return _ref10.apply(this, arguments);
																					};
																				}()));

																			case 3:
																				reoptions = _context7.sent;

																				item1.options = reoptions;
																				return _context7.abrupt('return', item1);

																			case 6:
																			case 'end':
																				return _context7.stop();
																		}
																	}
																}, _callee7, _this2);
															}));

															return function (_x11) {
																return _ref9.apply(this, arguments);
															};
														}()));

													case 2:
														tmp = _context8.sent;
														return _context8.abrupt('return', tmp);

													case 4:
													case 'end':
														return _context8.stop();
												}
											}
										}, _callee8, _this2);
									}));

									return function (_x10) {
										return _ref8.apply(this, arguments);
									};
								}()));

							case 5:
								result = _context9.sent;
								return _context9.abrupt('return', result);

							case 7:
							case 'end':
								return _context9.stop();
						}
					}
				}, _callee9, this);
			}));

			function getRandomQuestionWithOptions() {
				return _ref6.apply(this, arguments);
			}

			return getRandomQuestionWithOptions;
		}()
	}, {
		key: 'queryQuestionsBatch',
		value: function () {
			var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
				var uuidRange = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
				var con, result;
				return regeneratorRuntime.wrap(function _callee10$(_context10) {
					while (1) {
						switch (_context10.prev = _context10.next) {
							case 0:
								if (!(uuidRange.length < 1)) {
									_context10.next = 2;
									break;
								}

								return _context10.abrupt('return', null);

							case 2:
								_context10.next = 4;
								return this.getConnection();

							case 4:
								con = _context10.sent;
								_context10.next = 7;
								return con.query('select * from v_question where uuid in (' + uuidRange.map(function (el) {
									return '?';
								}).join(',') + ')', uuidRange);

							case 7:
								result = _context10.sent;
								_context10.next = 10;
								return this.pool.releaseConnection(con);

							case 10:
								return _context10.abrupt('return', result);

							case 11:
							case 'end':
								return _context10.stop();
						}
					}
				}, _callee10, this);
			}));

			function queryQuestionsBatch() {
				return _ref11.apply(this, arguments);
			}

			return queryQuestionsBatch;
		}()
	}, {
		key: 'getMyRank',
		value: function () {
			var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
				var con, result;
				return regeneratorRuntime.wrap(function _callee11$(_context11) {
					while (1) {
						switch (_context11.prev = _context11.next) {
							case 0:
								_context11.next = 2;
								return this.getConnection();

							case 2:
								con = _context11.sent;
								_context11.next = 5;
								return con.query('select (@rowNum:=@rowNum+1) as rowNo, vur.* from v_user_rank vur, (select(@rowNum :=0)) r');

							case 5:
								result = _context11.sent;
								_context11.next = 8;
								return this.pool.releaseConnection(con);

							case 8:
								return _context11.abrupt('return', result);

							case 9:
							case 'end':
								return _context11.stop();
						}
					}
				}, _callee11, this);
			}));

			function getMyRank() {
				return _ref12.apply(this, arguments);
			}

			return getMyRank;
		}()
	}]);

	return dbutils;
}();

exports.default = dbutils;
