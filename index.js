  // ��ȡԪ��
  var canvas = document.getElementById('myCanvas');
  canvas.ctx = canvas.getContext('2d');
  var all = [],timer,heroX,backgroundFun,personFun,isOverFlag;
  var windowHeight = window.innerHeight;
  var windowWidth = window.innerWidth;

  // �����Դ���
	window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
	window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame;
	var lastTime = 0;
  window.requestAnimationFrame = function (callback) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
    var id = window.setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
  window.cancelAnimationFrame = function (id) {
    clearTimeout(id);
  };

  // ���� CSS3 ��ת �Ը�������ʱ����ת 90 ��
  var detectOrient = function () {
    var width = document.documentElement.clientWidth,
      height = document.documentElement.clientHeight,
      $wrapper = document.getElementById("J_wrapper"),
      style = "";
    if (width >= height) { // ����
      style += "width:" + width + "px;"; // ע����ת��Ŀ���л�
      style += "height:" + height + "px;";
      canvas.height = height;
      canvas.width = width;
    } else { // ����
      style += "width:" + height + "px;";
      style += "height:" + width + "px;";
      canvas.height = width;
      canvas.width = height;
    }
    backgroundFun = new background();
    backgroundFun.w = canvas.width;
    backgroundFun.h = canvas.height;
    $wrapper.style.cssText = style;
  }
  window.onresize = function(){
    detectOrient();
    if (document.querySelector('#page3').classList.contains('active')) {
      init();
    }
  };
  detectOrient();

  // ����
  function background(){
    this.x = 0; //��ʼX��λ��
    this.y = 0; //��ʼY��λ��
		this.w = canvas.width; //���
    this.h = canvas.height; //�߶�
		this.dx = 0; //ͼƬ��ѩ��ͼ��X��λ��
		this.dy = 7546; //ͼƬ��ѩ��ͼ��Y��λ��
    this.mh = 7546; // �������и߶�
    this.speed = 1; //�˶������ٶ�
  }
  // С��
  function person(){
    this.x = canvas.width / 2 - 135 / 2;// С�˳�ʼX��λ��
		this.y = canvas.height - 120;// С�˳�ʼY��λ��
		this.dx = 0;
		this.dy = 740;
		this.w = 135;
    this.h = 159;
    this.blood = 100; //Ѫ��
    this.role = 'person';
    this.state = 1;
    this.stateNum = 0;
  }

  // ѩ��
  function snowBall(){
    this.x = parseInt(Math.random() * 460 + 50);
		this.y = -41.5;
		this.dx = 157;
		this.dy = 0;
		this.w = 81;
    this.h = 83;
    this.speed = 3;
    this.effect = -15;
    this.role = 'snowBall';
  }

  // ѩ��
  function snowBlock(){
    this.x = parseInt(Math.random() * 460 + 50);
		this.y = -31.5;
		this.dx = 70;
		this.dy = 0;
		this.w = 81;
    this.h = 81;
    this.speed = 1;
    this.effect = -8;
    this.role = 'snowBlock';
  }

  // ҩƿ
  function bloodBottle(){
    this.x = parseInt(Math.random() * 460 + 50);
		this.y = -40.5;
		this.dx = 0;
		this.dy = 0;
		this.w = 55;
    this.h = 81;
		this.effect= 10;
    this.speed = 1;
    this.role = 'bloodBottle';
  }

  function init(){
    all = [];
		drawImages.timestamp = 0;
    invasion.m = 0;
    heroX = canvas.width / 2 - 88 / 2; //С�˳�ʼλ�õ�X�����긳ֵ
    document.getElementById('audio').play();
    personFun = new person();
    all.push(backgroundFun);
    all.push(personFun);
    drawImages();
  }

  function drawImages(){
		canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawImages.timestamp += 10;//ˢ�µ�����Ʒ��ʱ��
    if(all != ''){
      invasion(drawImages.timestamp);
      all.forEach(function(item){
        setTimeout(function() {
          if (item.y > windowHeight && all != '') all.remove(item);
        }, 1000);
        canvas.ctx.beginPath();
        canvas.ctx.globalAlpha = 1;
        var total = item.__proto__.constructor.name;
        if(total == 'snowBall'){ // �ж��Ƿ�Ϊѩ��
          item.y += (1.5 * item.speed);
        }else if(total == 'snowBlock'){ // �ж��Ƿ�Ϊѩ��
          item.y += item.speed;
        }else if(total == 'bloodBottle'){//�ж��Ƿ�ΪѪҩ
          item.y += item.speed;
        }else if(total == 'person'){// �ж��Ƿ�ΪС��
          item.x = heroX;
        }
        if(total == 'background'){
          item.dy -= item.speed;
          // ����չʾ
          moveDistance(item);
          function moveDistance(item){
            document.querySelector('.moveNum').innerHTML = parseInt(item.mh-item.dy)+'m';
            document.querySelector('#moveDistance').style.bottom = (item.mh-item.dy)/item.mh*147+ 10 +'px';//ʵʱ��¼Ѫ���仯
          }
          if(item.dy <= 0){
            isOverFlag = true;
            isOver(isOverFlag);
          }
          canvas.ctx.drawImage(raiden_bg,item.dx,item.dy,item.w,item.h,item.x,item.y,item.w,item.h);
        }else if(total == 'person'){
          item.stateNum+=0.1;
          item.blood -= 0.03;
          bloodVolume(item.blood);//ʵʱ��¼Ѫ���仯
          if(item.blood <= 0){
            isOverFlag = false;
            isOver(isOverFlag);
          }
          switch (parseInt(item.state)) {
            case 0: //��������
              personAnimate(item,265);
              break;
            case 1: //δ�ƶ�
              personAnimate(item,430);
              break;
            case 2: //�����ƶ�
              personAnimate(item,100);
              break;
          }
        }else{
          canvas.ctx.drawImage(raiden_props,item.dx,item.dy,item.w,item.h,item.x,item.y,item.w/2,item.h/2);
        }
      })
    }
    try {
			drawImages.timer = requestAnimationFrame(drawImages);
    } catch (error) {}
    all && all.forEach(function (item) {
      drawImages.first = item;
      all && all.forEach(function (other) {
        drawImages.another = other;
        drawImages.another !== drawImages.first && ishit(drawImages.first, drawImages.another);
      });
    });
  }

  // ���ֹ����Ƶ����400����Ϊ��׼����εݼ�
	function invasion(timestamp) {
		invasion.speed = (400 - parseInt(timestamp / 400));
    invasion.t = parseInt(timestamp / invasion.speed);
		if (invasion.t > invasion.m) {
      if(invasion.t % 4 == 0){
        all.push(new snowBall());
      }
      if(invasion.t % 7 == 2){
        all.push(new snowBlock());
      }
      if(invasion.t % 7 == 0){
        all.push(new bloodBottle());
      }
      invasion.m = invasion.t;
    }
  };

  /*
	 *	��ײ��� *
	 */
	function ishit(b,a) {
		var h, v;
		if (a.role !== b.role) {
			// �������ը�� ��ײ���
			if ((a.role === 'snowBall' || a.role === 'snowBlock' || a.role === 'bloodBottle') && b.role === 'person') {
				h = a.x > b.x ? Math.abs(a.x - b.x + a.w/2) : Math.abs(b.x - a.x + b.w/2);
				v = a.y > b.y ? Math.abs(a.y - b.y + a.h/2) : Math.abs(b.y - a.y + b.h/2);
				if (h <= (a.w/2 + b.w/2) && v <= (a.h/2 + b.h/2)) {
          b.blood += premium(a);
          if(b.blood >= 100) b.blood = 100; //��ҩ����100�������ֵ
          isOverFlag = false;
          if (b.blood <= 0) isOver(isOverFlag); //��Ϸʧ�ܽ���
          bloodVolume(b.blood);//ʵʱ��¼Ѫ���仯
				}
			}
		}
	};

	// ����Ч�����ӷ�
	function premium(a) {
    var number = 0;
		explosion(a); //����ը����ը
    number = + a.effect;
		return number;
	};
	// ����ը����ը
	function explosion(o) {
		if (o.role === 'snowBall' || o.role === 'snowBlock') {
			var x = o.x - (213/2 - o.w/2) / 2;
      var y = o.y - (178/2 - o.h/2) / 2;
      canvas.ctx.drawImage(raiden_props, 0, 600, 213, 178, x, y, 213/2, 178/2);
      decelerate();
    }
    all.remove(o);
	}

  	// �ƶ�С��
	var timeOutEventLeft,timeOutEventRight,timerLeft,timerRight;
	left.addEventListener('touchstart',function(e){
		timeOutEventLeft = setTimeout(longPressLeft,0);
    clearInterval(timerRight);
    personFun.state = 0;
		e.preventDefault();
	});
	left.addEventListener('touchmove',function(e){
		clearTimeout(timeOutEventLeft);
		clearInterval(timerLeft);
    timeOutEventLeft = 0;
	});
	left.addEventListener('touchend',function(e){
		clearTimeout(timeOutEventLeft);
    clearInterval(timerLeft);
    personFun.state = 1;
		return false;
	});
	function longPressLeft(){
		timeOutEventLeft = 0;
    //ִ�г����¼�����Ϊ
		clearInterval(timerLeft);
		timerLeft = setInterval(function(){
			if (heroX <= 50) {
				heroX = 50;
			}else{
				heroX -=5;
      }
		}, 50);
  }

	right.addEventListener('touchstart',function(e){
		clearInterval(timerLeft);
    timeOutEventRight = setTimeout(longPressRight,0);
    personFun.state = 2;
		e.preventDefault();
	});
	right.addEventListener('touchmove',function(e){
		clearTimeout(timeOutEventRight);
		clearInterval(timerRight);
    timeOutEventRight = 0;
	});
	right.addEventListener('touchend',function(e){
		clearTimeout(timeOutEventRight);
    clearInterval(timerRight);
    personFun.state = 1;
		return false;
	});
	function longPressRight(){
		//ִ�г����¼�����Ϊ
    timeOutEventRight = 0;
		clearInterval(timerRight);
		timerRight = setInterval(function(){
			if (heroX >= canvas.width - 100) { //640-�����
				heroX = canvas.width - 100;
			}else{
				heroX += 5;
			}
		}, 50);
  }
  function isOver(isOverFlag) {
    cancelAnimationFrame && cancelAnimationFrame(drawImages.timer);
    canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(isOverFlag){ // �ɹ��Ƕ�
      Carousel.showRule(document.querySelector('#page3'),document.querySelector('#page5'));
    }else{ // �Ƕ�ʧ��
      Carousel.showRule(document.querySelector('#page3'),document.querySelector('#page4'));
      all.forEach(function(item){
        var total = item.__proto__.constructor.name;
        if(total == 'background'){ // �ж��Ƿ�Ϊѩ��
          document.querySelector('.p4-t2').innerHTML = parseInt(item.mh - item.dy)+'m';
        }
      })
    }
    document.getElementById('audio').pause();
    all = '';
  };

  // С�˶���
  function personAnimate(item,dy){
    item.dx = parseInt(item.stateNum) % 6 * 135;
    item.dy = dy;
    canvas.ctx.drawImage(raiden_props,item.dx,item.dy,item.w,item.h,item.x,item.y,item.w/2,item.h/2);
  }
  // ��ײ����
  function decelerate(){
    all.forEach(function(item){
      var total = item.__proto__.constructor.name;
      if(total == 'bloodBottle' || total == 'snowBlock' || total == 'background'){
        item.speed -= 0.5;
        setTimeout(function(){
          item.speed = 1;
        }, 500);
      }
    })
  }
  // Ѫ��չʾ
  function bloodVolume(blood){
    document.querySelector('#bloodVolume').style.height = blood/100*140 +'px';//ʵʱ��¼Ѫ���仯
  }
  // ����չʾ
  function moveDistance(y){
    document.querySelector('#moveDistance').style.bottom = y/100*140 + 10+'px';//ʵʱ��¼Ѫ���仯
  }
  // ��ȡС�˵ĵ�ǰ�ƶ�״̬
  function personStateGet(num){
    var _num = num;
    all.forEach(function(item){
      var total = item.__proto__.constructor.name;
      if(total == 'person'){ // �ж��Ƿ�Ϊѩ��
        item.state = _num;
      }
    })
  }