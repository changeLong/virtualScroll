function virtualScroll(option) {
	this.lineHeight = option.lineHeight; //行高
	this.lines = option.lines; //行数
	this.data = option.data || []; //数据
	this.total = option.data.length; //总数
	this.scrollDom = option.scrollDom; //滚动节点
	this.listTemplate = option.listTemplate || new Function("return ''"); //列表模板
	this.currentData = []; //当前数据
	this.curPage = 0; //当前页数
}

virtualScroll.prototype = {
	/**
	 * @desc 初始化事件
	 */
	init: function() {
		var _t = this;
		this.appendDom();
		this.setStyle();
		_t.getData({
			type: 'init'
		})
		this.scrollDom.onscroll = function() {
			_t.getData();
		}
	},
	/**
	 * @desc 补充节点
	 */
	appendDom: function() {
		var _t = this;

		var heightDom = document.createElement('div'); //真实高度dom，撑起滚动条
		heightDom.className = "cnt";
		_t.scrollDom.appendChild(heightDom);
		_t.heightDom = heightDom;

		var clientDom = document.createElement('div'); //可视dom，撑起滚动条
		clientDom.className = "box";
		_t.heightDom.appendChild(clientDom);
		_t.clientDom = clientDom;

		var scrollList = document.createElement('div'); //列表
		scrollList.className = "list";
		_t.clientDom.appendChild(scrollList);
		_t.scrollList = scrollList;
	},
	/**
	 * @desc 设置样式
	 */
	setStyle: function() {
		var _t = this;
		_t.scrollDom.style.height = _t.clientDom.style.height = _t.lineHeight * _t.lines + 'px';
		_t.heightDom.style.height = _t.lineHeight * _t.total + 'px';
	},
	/**
	 * @desc 获取数据
	 */
	getData: function(opt) {
		var _t = this,
			option = opt || {},
			scrollTop = this.scrollDom.scrollTop,
			scrolled = Math.floor(scrollTop / _t.lineHeight), //滚动去多少条数据;
			page = Math.floor(scrolled / _t.lines); //当前页数

		function render(index) {
			_t.currentData = _t.data.slice(index * _t.lines, index * _t.lines + _t.lines * 2);
			_t.scrollList.innerHTML = _t.build();
		}

		if(option.type == 'init') {
			render(0)
		}

		if(page !== _t.curPage) {
			_t.curPage = page;
			//当前页数和记录页数不一致时拿数据
			render(page);
		}
		_t.clientDom.style.marginTop = scrollTop + 'px'; //可视窗口定位
		//可视窗口定位，在当前数据中定位，不用外层一滚动就拿数据；
		//scrollTop 为不规则，page * (lineHeight * lines))为规则，所以会出现 -2-3等情况，模拟真实情况
		_t.scrollList.style.marginTop = -1 * (scrollTop - page * (_t.lineHeight * _t.lines)) + "px";
	},
	/**
	 * @desc 组建数据
	 */
	build: function() {
		var _t = this;

		var html = '';
		for(let i = 0; i < _t.currentData.length; i++) {
			html += _t.listTemplate(i + _t.curPage * _t.lines, _t.currentData[i]);
		}
		return html;
	}
}