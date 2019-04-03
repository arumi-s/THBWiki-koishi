$(function () {
	var baseurl = 'src/';
	var tel = $('<div></div>').css({
		position: 'fixed',
		bottom: 120,
		right: 20,
		width: 100,
		height: 75,
		backgroundImage: 'url(' + baseurl + 'tel/base.png)',
		backgroundSize: '100%',
		zIndex: 5000,
	});
	var phone = $('<div></div>').css({
		position: 'absolute',
		width: 100,
		height: 75,
		backgroundImage: 'url(' + baseurl + 'tel/phone.png)',
		backgroundSize: '100%',
	});
	var front = $('<div></div>').css({
		position: 'absolute',
		width: 100,
		height: 75,
		backgroundImage: 'url(' + baseurl + 'tel/front.png)',
		backgroundSize: '100%',
	});
	var loading = $('<div>接通中</div>').css({
		position: 'absolute',
		top: -20,
		left: 10,
		fontSize: '14px',
		color: '#43194a'
	});
	var rolling = $('<span></span>');

	loading.append(rolling);
	loading.hide();
	tel.append(phone, front, loading);
	$('body').append(tel);

	var koishi_tel = $('<div id="koishi_tel"></div>');
	var koishi_cg = $('<div id="koishi_cg"></div>');
	var koishi_q = $('<div id="koishi_q"></div>');
	var koishi_title = $('<div id="koishi_title"></div>');
	var koishi_as = $('<div id="koishi_as"></div>');
	var koishi_opt1 = $('<div id="koishi_opt1" class="koishi_a"></div>');
	var koishi_opt2 = $('<div id="koishi_opt2" class="koishi_a"></div>');
	var koishi_style = $('<style></style>').text("#koishi_tel,#koishi_tel *{box-sizing:border-box}#koishi_cg,#koishi_title{right:0;background-repeat:no-repeat}#koishi_as,#koishi_q{position:absolute;right:20px}#koishi_tel{position:fixed;bottom:0;right:0;height:500px;width:400px;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:5000}#koishi_cg{position:absolute;top:0;background-position:top right;width:450px;height:500px}#koishi_q{top:250px;width:360px;height:80px;line-height:30px;border-radius:10px;background-color:rgba(0,0,0,.9);border:2px solid rgba(120,51,157,.9);color:#e6e6e6;font-size:16px;padding:8px 15px}#koishi_q span{color:#D11818}#koishi_title{position:absolute;top:345px;width:400px;height:23px;background-position:12px 0;background-size:50%;border-bottom:4px solid #D11818}#koishi_as{top:380px;width:360px}.koishi_a{margin-bottom:20px;width:360px;height:40px;border-radius:10px;background-color:rgba(216,216,216,.8);border:2px solid rgba(120,51,157,.9);color:#252525;font-size:15px;padding:8px 15px}.koishi_a.active{cursor:pointer}.koishi_a.active:hover{background-color:rgba(199,231,194,.8);border-color:rgba(77,153,116,.8)}.koishi_a.active:hover::before{color:#034114}.koishi_a::before{display:inline-block;color:#43194a;font-weight:700;margin-right:10px}#koishi_opt1::before{content:'1'}#koishi_opt2::before{content:'2'}");

	koishi_as.append(koishi_opt1, koishi_opt2);
	koishi_tel.append(koishi_cg, koishi_q, koishi_title, koishi_as, koishi_style);

	koishi_tel.hide();
	koishi_q.hide();
	koishi_title.hide();
	koishi_opt1.hide();
	koishi_opt2.hide();

	var cut = $('<div></div>');
	var black = $('<div></div>');
	var note = $('<div>DEAD END</div>');
	cut.css({
		position: 'fixed',
		top: '50%',
		left: 0,
		width: 0,
		height: 2,
		backgroundColor: '#D11818',
		zIndex: 10000
	});
	black.css({
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		backgroundColor: '#000',
		opacity: 0,
		zIndex: 10001
	});
	note.css({
		position: 'fixed',
		top: '50%',
		left: 0,
		width: '100%',
		transform: 'translateY(-50%)',
		marginTop: 50,
		color: '#D11818',
		textAlign: 'center',
		fontSize: '36px',
		opacity: 0,
		zIndex: 10002
	});

	var destroy = function () {
		koishi_tel.remove();
		tel.remove();
	}

	var started = false;
	var blocked = 1;
	var loaded = false;
	var hangover = false;
	var opened = false;
	var clickable = false;

	var ringAnimation = setInterval(function () {
		var i = 0
		var ring = setInterval(function () {
			if (started) {
				clearInterval(ring);
				return;
			}
			if (i % 2) {
				phone.css({
					'transform': 'rotate(-' + (Math.random() * 3 + Math.sqrt(i)) + 'deg)',
					'transform-origin': '34px 20px',
				});
			} else {
				phone.css({
					'transform': 'rotate(' + (Math.random() * 3 + Math.sqrt(i)) + 'deg)',
					'transform-origin': '66px 20px',
				});
			}
			++i;
			if (i > 12) {
				phone.css({
					'transform': 'rotate(0deg)'
				});
				clearInterval(ring);
			}
		}, 50);
	}, 2000);
	var loadingAnimation;
	var images = [
		'title.png',
		'normal.png',
		'normal2.png',
		'sad.png',
		'shocked.png',
		'shocked2.png',
		'smile2.png'
	];

	var calling = function (callback) {
		setTimeout(function () {
			blocked = false;
			if (!blocked) {
				callback();
			} else if (blocked == 1) {
				out('需要*登*录才能接听哦', '登录', '创建账户', function () {
					location.href = '/%E7%89%B9%E6%AE%8A:%E7%94%A8%E6%88%B7%E7%99%BB%E5%BD%95';
				}, function () {
					location.href = '/%E7%89%B9%E6%AE%8A:%E5%88%9B%E5%BB%BA%E8%B4%A6%E6%88%B7';
				});
			} else if (blocked == 2) {
				out('你刚才*死*掉*了呢……\n复活你的身体大概需要*1*0*分*钟的时间…\b或者编辑任意词条即可复活\n（编辑时要守规矩哦）', '默默地等', '看看有什么词条需要编辑', function () {

				}, function () {
					location.href = '/keng';
				});
			} else {
				out('很抱歉，你没有足够*权*限', '？？', '？？？', function () { }, function () { });
			}
		}, 500);
	}
	var preload = function (callback) {
		if (images.length) {
			var image = new Image();
			image.onload = function () {
				preload(callback);
			}
			image.src = baseurl + images.shift();
		} else {
			callback();
		}
	};

	var type = function (node, text, callback) {
		text = text.split('');
		var i = 0;
		node.html('');
		var typing = function () {
			if (text[i - 1] === '\b') {
				node.html('');
			}
			if (i < text.length) {
				if (text[i] === ' ') {
					node.append('&nbsp;');
					++i;
					setTimeout(typing, 100);
				} else if (text[i] === '\t') {
					++i;
					setTimeout(typing, 600);
				} else if (text[i] === '\n') {
					node.append('<br />');
					++i;
					setTimeout(typing, 1000);
				} else if (text[i] === '\b') {
					++i;
					setTimeout(typing, 3000);
				} else if (text[i] === '*') {
					++i;
					node.append('<span>' + text[i] + '</span>');
					++i;
					setTimeout(typing, 200);
				} else {
					node.append(text[i]);
					++i;
					setTimeout(typing, 170);//200
				}
			} else {
				if (callback != null) {
					callback();
				}
			}
		};
		setTimeout(typing, 250);
	}

	var openDialogue = function () {
		if (opened || blocked) return;
		opened = true;
		loading.css('opacity', 0);
		tel.fadeOut(500);
		koishi_opt1.click(function (e) {
			e.preventDefault();
			hideOpt(1);
		});
		koishi_opt2.click(function (e) {
			e.preventDefault();
			hideOpt(2);
		});
		$('body').append(koishi_tel);
		cg('normal');
		koishi_title.css('background-image', 'url(' + baseurl + 'title.png)');
		koishi_tel.fadeIn(1500, function () {
			koishi_q.fadeIn(500, function () {
				getSet();
				talk(wrap(line), opts[0][0], opts[1][0], true);
			});
		});

	};

	var out = function (text, a, b, acb, bcb) {
		loading.css('opacity', 0);
		$('body').append(koishi_tel);
		koishi_tel.fadeIn(1500, function () {
			koishi_q.fadeIn(500, function () {
				talk(text, a, b, false, function () {
					clickable = true;
					koishi_opt1.click(function (e) {
						e.preventDefault();
						e.stopPropagation();
						hideOpt(1, acb);
					});
					koishi_opt2.click(function (e) {
						e.preventDefault();
						e.stopPropagation();
						hideOpt(2, bcb);
					});
					var closing = false;
					koishi_q.click(function (e) {
						e.stopPropagation();
					});
					koishi_tel.click(function (e) {
						e.preventDefault();
						if (closing) return;
						closing = true;
						phone.delay(400).animate({ borderSpacing: 0 }, {
							step: function (now) {
								$(this).css('transform', 'rotate(' + now + 'deg)');
							},
							duration: 1000,
							complete: function () {
								koishi_tel.fadeOut(500);
								setTimeout(function () {
									tel.fadeOut(600, function () {
										destroy();
									});
								}, 500);
							}
						});
					});
				});
			});
		});
	}

	var cg = function (n, k) {
		if (n == null) {
			koishi_cg.css('background-image', false);
		} else {
			koishi_cg.css('background-image', 'url(' + baseurl + n + (k ? '2' : '') + '.png)');
		}
	};

	var talk = function (q, a, b, f, cb) {
		type(koishi_q, q, function () {
			if (f) {
				koishi_title.fadeIn(600, function () {
					showOpt(a, b);
				});
			} else {
				showOpt(a, b);
			}
			if (cb != null) cb();
		});
	};

	var win = function () {
		koishi_q.animate({ 'opacity': 0 }, {
			duration: 500,
			complete: function () {
				koishi_q.html('');
				koishi_q.css('opacity', 1);
			}
		});
		koishi_title.delay(500).fadeOut(500, function () {
			type(koishi_q, '\t\t为什么你不害怕呀\n一点都不好玩\t，回家去了\t\t\t', function () {
				koishi_cg.animate({ opacity: 0 }, 800);
				type(koishi_q, '\t\t\t…\t…\t\t\t', function () {
					koishi_tel.fadeOut(1000);
					tel.fadeIn(1000, function () {
						phone.delay(800).animate({ borderSpacing: 0 }, {
							step: function (now) {
								$(this).css('transform', 'rotate(' + now + 'deg)');
							},
							duration: 1000,
							complete: function () {
								setTimeout(function () {
									tel.fadeOut(600, function () {
										destroy();
									});
								}, 500);
							}
						});
					});
				});
			});
		});
	};
	var lost = function () {
		koishi_q.animate({ 'opacity': 0 }, {
			duration: 500,
			complete: function () {
				koishi_q.html('');
				koishi_q.css('opacity', 1);
			}
		});
		koishi_title.delay(500).fadeOut(500, function () {
			type(koishi_q, '\t\t我是恋恋\n现在在\t *你*的*背*后 。\b\t*…\t*…\t\t', function () {
				$('body').append(cut, black, note);
				cut.animate({ width: '100%' }, 100, 'linear')
					.delay(400)
					.animate({ height: '100%', top: 0 }, 500, 'linear');
				black.delay(800).animate({ opacity: 1 }, {
					duration: 800,
					easing: 'linear',
					complete: function () {
						cut.remove();
						destroy();
						note.delay(1000).animate({ marginTop: 0, opacity: 1 }, 3000);
						setTimeout(function () {
							note.animate({ opacity: 0 }, 1000);
							black.fadeOut(2000, function () {
								note.remove();
								black.remove();
							});
						}, 7000);
					}
				});
			});
		});
	};

	var plot = [
		[
			'',
			[],
			[],
		],
		[
			'你家的门口',
			[['你不要过来啊啊啊', -1], ['你想做什么！', -1]],
			[['我做了晚饭，一起吃吧', 2], ['后备钥匙在地毯底下', 3]],
		],
		[
			'铃奈庵的拐角那里',
			[['等等，刀是什么回事', -1], ['都市传说看太多了吧', -1]],
			[['那里的千金好可爱的', 2], ['借了书的话不要忘了还哦', 3], ['帮我买本华胥三绝，谢谢', 6]],
		],
		[
			'人类村落里',
			[['今天的幻想乡也很和平呢', -1], ['巫女小姐！妖怪进村了！', -1]],
			[['村里有时可以欣赏到能乐表演', 2], ['你可能去错村了', 3], ['放开那位村民，有什么冲我来！', 4]],
		],
		[
			'香霖堂中',
			[['你知道吗，朱鹭是濒危物种哦', -1], ['店主都不是做生意的', -2], ['搞不好会被杂物堆死', -3]],
			[['那里是镇纸专门店', 2], ['不换个更先进便利的手机么', 3]],
		],
		[
			'森林里',
			[['听说那里有天不怕地不怕的魔法使', -2], ['能遇到人就怪了', -2], ['最怕潮湿的地方了', -3]],
			[['蘑菇可好吃了', 2], ['你到底认不认得路啊', 3]],
		],
		[
			'无缘塚里',
			[['上一个通话的人的坟头草已经三尺高了', -2], ['去那么危险的地方干嘛啊', -3]],
			[['那是什么地方', 1], ['好厉害的电话，这都有信号', 2]],
		],
		[
			'三途河边',
			[['别想不开啊', -3], ['听说只要渡了河就没法回来了', -4]],
			[['有遇到死神吗', 1], ['不管有没有雾，也不会有人看得见你的啦', 2]],
		],
		[
			'雾之湖边',
			[['一加一等于几', -3], ['听说边上的洋馆住着可怕的吸血鬼', -4]],
			[['趁机摸鱼了', 1], ['钓鱼是很好的竞技运动', 2]],
		],
		[
			'妖怪山山脚',
			[['好笼统的说法', -3], ['在这里蹓跶的话会被做成新闻的', -4]],
			[['妖怪们真是占了一个好地方', 1], ['不上山参拜一下吗', 2]],
		],
		[
			'间歇泉旁边',
			[['搞不好就被毒气毒死了', -3], ['怨灵好多好恐怖', -4]],
			[['你要去地底吗', 1], ['温泉啊，很好玩的样子', 2]],
		],
		[
			'旧地狱的街上',
			[['听见就觉得热', -3], ['感觉路上全是麻烦', -4]],
			[['偶尔去逛逛也没什么不好', 1], ['有什么好吃好玩的介绍一下', 2]],
		],
		[
			'旧都的酒馆里',
			[['遇到麻烦的酒鬼就惨了', -3], ['小妹妹你几岁啊', -4]],
			[['干杯！', 1]],
		],
		[
			'地灵殿门口',
			[['你姐还好吗', -3], ['那个地方比地狱还糟糕', -4]],
			[['请把我挂在地灵殿门上', 1]],
		],
		[
			'',
			[],
			[]
		],
	];
	var position = 6;
	var jump = 0;
	var line = '';
	var opts = [];

	var wrap = function (a) {
		return '嘿嘿，\t我是恋恋\n现在在\t ' + a.replace(/./g, '*$&') + ' ……';
	}
	var shuffle = function (a) {
		for (var i = a.length, j, k; i; i--) {
			j = Math.floor(Math.random() * i);
			k = a[i - 1];
			a[i - 1] = a[j];
			a[j] = k;
		}
	}

	var getSet = function () {
		var setting = plot[position];
		var opts1 = [], opts2 = [], i, r;
		for (i = 0; i < setting[1].length; ++i) {
			r = setting[1][i];
			if (r[1] != -jump) opts1.push(r);
		}
		for (i = 0; i < setting[2].length; ++i) {
			r = setting[2][i];
			if (r[1] != -jump) opts2.push(r);
		}
		opts = [];

		if (Math.random() < (1 - Math.pow(position - 8, 2) / 150)) {
			opts[0] = opts1[Math.floor(Math.random() * opts1.length)];
			opts[1] = opts2[Math.floor(Math.random() * opts2.length)];
			shuffle(opts);
		} else {
			shuffle(opts1);
			opts = opts1.slice(0, 2);
			if (opts.length < 2) {
				opts[1] = opts2[Math.floor(Math.random() * opts2.length)];
			}
		}
		line = setting[0];
	}

	var selectOpt = function (opt) {
		jump = opts[opt][1];
		position += jump;
		getSet();
		if (position == 0) {
			cg('smile', true);
			lost();
		} else if (position == plot.length - 1) {
			cg('sad');
			win();
		} else {
			cg(jump > 0 ? 'shocked' : 'normal', position < 3);
			talk(wrap(line), opts[0][0], opts[1][0]);
		}
	}

	/*
	var stat = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var wlens = [];
	var llens = [];

	for (var q = 0; q < 10000; ++q) {
			position = 6;
			jump = 0;
			line = '';
			opts = [];
			var length = 0;
			getSet();
			while (position != 0 && position != 14) {
					selectOpt(Math.random() < 0.5 ? 1 : 0);
					++stat[position];
					++length;
					//console.log(position);
			}
			if (position == 0) {
					if (llens[length] == null) {
							llens[length] = 0;
					}
					++llens[length];
			} else {
					if (wlens[length] == null) {
							wlens[length] = 0;
					}
					++wlens[length];
			}
	}
	console.log(stat);
	console.log(llens);
	console.log(wlens);
	*/

	var showOpt = function (opt1, opt2) {
		clickable = false;
		koishi_as.css('padding-top', 20);
		koishi_as.animate({ 'padding-top': 0 }, 800);
		koishi_opt1.fadeIn(800, function () {
			koishi_opt1.html(opt1);
			koishi_opt1.addClass('active');
			clickable = true;
		});
		koishi_opt2.fadeIn(800, function () {
			koishi_opt2.html(opt2);
			koishi_opt2.addClass('active');
			clickable = true;
		});
	}

	var hideOpt = function (select, cb) {
		if (!clickable) return;
		clickable = false;
		koishi_opt1.removeClass('active');
		koishi_opt2.removeClass('active');
		if (select == 1) {
			koishi_opt1.delay(100).animate({ opacity: 0 }, 1000);
			koishi_opt2.delay(600).fadeOut(1000, function () {
				koishi_opt1.hide().css({ opacity: 1 });
				koishi_opt1.html('');
				koishi_opt2.html('');
				if (cb == null) selectOpt(0);
				else cb();
			});
		} else {
			koishi_opt2.delay(100).animate({ opacity: 0 }, 1000);
			koishi_opt1.delay(600).fadeOut(1000, function () {
				koishi_opt2.hide().css({ opacity: 1 });
				koishi_opt1.html('');
				koishi_opt2.html('');
				if (cb == null) selectOpt(1);
				else cb();
			});
		}
	}

	tel.click(function (e) {
		e.preventDefault();
		if (started) return;
		started = true;
		clearInterval(ringAnimation);

		loaded = false;
		calling(function () {
			preload(function () {
				loaded = true;
				if (hangover) {
					openDialogue();
				}
			});
		});
		setTimeout(function () {
			hangover = true;
			if (loaded) {
				openDialogue();
			}
		}, 5000);

		phone.css({ 'transform': 'rotate(0deg)', 'transform-origin': '76px 20px' });
		phone.animate({ borderSpacing: 90 }, {
			step: function (now) {
				$(this).css('transform', 'rotate(' + now + 'deg)');
			},
			duration: 1000,
			complete: function () {
				loading.fadeIn(200);
				var c = '';
				loadingAnimation = setInterval(function () {
					if (opened) {
						clearInterval(loadingAnimation);
					}
					if (c.length > 3) {
						c = '';
					}
					rolling.html(c);
					c += '.';
				}, 500);
			}
		});
	});
});