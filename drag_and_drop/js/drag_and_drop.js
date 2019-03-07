	//组件拖拽到目标
	function Dragdrop(param){
		//拖拽前 id
		this.drag_id = param.drag_id;
		this.drag_assembly = document.getElementById(this.drag_id);
		//拖拽后 id
		this.final_id = param.final_id;
		this.final_assembly = document.getElementById(this.final_id);
		//目标区域 id
		this.target_id = param.target_id;
		this.target_area = document.getElementById(this.target_id);
		//样式区域 id
		this.style_id = param.style_id;
		this.style_area = document.getElementById(this.style_id);
		//空白框 
		this.placing_box = document.getElementsByClassName("place-box")[0];
	}
	
	Dragdrop.prototype = {
		constructor: Dragdrop,
		isPut: false,
		source: '',
		sourceParent: '',
		dragNum: 0,
		isDouble: false,
		doubleTarget: '',
		init: function() {
			var _this = this;
			for(var i=0;i<this.drag_assembly.children.length;i++){
				this.drag_assembly.children[i].index = i;
				//开始拖拽
				this.drag_assembly.children[i].ondragstart = function(ev){
					//console.log("开始拖拽");
					ev.dataTransfer.setData("index", this.index);
					_this.isPut = false;
					_this.source = this;
				}
				//拖拽中
				this.drag_assembly.children[i].ondrag = function(ev) {
					//console.log("拖拽中");
				}
				//拖拽结束
				this.drag_assembly.children[i].ondragend = function(ev) {
					var target_default = _this.target_area.getElementsByClassName("place-box")[0];
					if(!_this.isPut && target_default) {
						_this.doubleTarget.removeChild(target_default);
					}
					//console.log("拖拽结束");
				}
			}
			this.targetEvent();
			
			for(var i=0;i<this.final_assembly.children.length;i++){
				this.final_assembly.children[i].setAttribute("data-stylenum",i);
			}
			
		},
		targetEvent: function(){
			var _this = this;
			//目标事件
			this.target_area.ondragenter = function(ev) {
				ev.preventDefault();
			}
			this.target_area.ondragover = function(ev) {
				ev.preventDefault();
				//console.log("再次进入目标,,,",ev);
				
				//组件到源
				if(_this.source.parentNode == _this.drag_assembly){
					_this.doubleTarget = _this.target_area;
					//如果进入双栏
					for(var i = 0; i < ev.path.length; i++) {
						if(ev.target != _this.target_area){
							if(ev.path[i].classList&&ev.path[i].classList[0] == "double_column") {
//								console.log("进入双栏",83,ev.target);
								_this.isDouble = true;
								_this.doubleTarget = ev.target;
								if(ev.target.dataset.type == 1) {
									_this.doubleTarget.appendChild(_this.placing_box);
									return;
								}
								_this.doubleTarget = ev.path[i-1];
								var difHeight = ev.clientY - ev.path[0].offsetTop - _this.target_area.offsetTop;
								var ofHeight = ev.path[0].offsetHeight / 2;
//								console.log(difHeight,ofHeight,ev.path[0]);
//								_this.doubleTarget.appendChild(_this.placing_box);
								var target_default = _this.doubleTarget.getElementsByClassName("place-box")[0];
								console.log(ev.path,88);
								var num='';
								/*for(var j = 0; j < ev.path.length; j++){									console.log(ev.path[j])
									if(ev.path[j].dataset && ev.path[j].dataset.stylenum){
										console.log(j);
									}
								}*/
								
								if(difHeight < ofHeight) {
//									console.log("上边",i,target_default);
									_this.doubleTarget.insertBefore(target_default,ev.path[0]);
									return;
								}
								if(ev.path[i-2].nextElementSibling) {
//									console.log("有兄弟");
									_this.doubleTarget.insertBefore(target_default,ev.path[0].nextElementSibling);
									return;
								}
								_this.doubleTarget.appendChild(_this.placing_box);
//								console.log("下边");
								return;
							}
							
						}
					}
					//正常一栏
					if(ev.target != _this.target_area) {
						console.log("正常");
						_this.isDouble = false;
						for(var i = 0; i < ev.path.length; i++) {
							//正常
//							console.log(ev.path,106);
							if(ev.path[i] == _this.target_area) {
								var difHeight = ev.clientY - ev.path[i - 1].offsetTop;
								var ofHeight = ev.path[i - 1].offsetHeight / 2;
								console.log(difHeight,ofHeight,_this.placing_box);

								if(difHeight < ofHeight) {
									_this.target_area.insertBefore(_this.placing_box, ev.path[i - 1]);
									return;
								}
								if(ev.path[i-1].nextElementSibling) {
									_this.target_area.insertBefore(_this.placing_box, ev.path[i - 1].nextElementSibling);
									return;
								}
								_this.target_area.appendChild(_this.placing_box);
								return;
							}
						}
						return;
					}
//					console.log("这里");
					_this.target_area.appendChild(_this.placing_box);
					return;
				}
				//源内换
				if(_this.sourceParent == _this.target_area){
					if(ev.target != _this.target_area) {
						for(var i = 0; i < ev.path.length; i++) {
							if(ev.path[i] == _this.target_area) {
								console.log("我自己",ev.path[i-1],ev);
								var difHeight = ev.clientY - ev.path[i - 1].offsetTop;
								var ofHeight = ev.path[i - 1].offsetHeight / 2;
								var target_default = _this.target_area.getElementsByClassName("place-box")[0];

								if(difHeight < ofHeight) {
									_this.target_area.insertBefore(target_default, ev.path[i - 1]);
									return;
								}
								if(ev.path[i - 1].nextElementSibling) {
									_this.target_area.insertBefore(target_default, ev.path[i - 1].nextElementSibling);
									return;
								}
								_this.target_area.appendChild(target_default);
								return;
							}
						}
						return;
					}
					var target_default = _this.target_area.getElementsByClassName("place-box")[0];
					console.log("目标源");
					_this.target_area.appendChild(target_default);
					
					return;
				}
				console.log("other");
				
			}
			this.target_area.ondragleave = function(ev) {
				ev.preventDefault();
			}
			this.target_area.ondrop = function(ev) {
				if(_this.source.parentNode == _this.drag_assembly){
					var index = ev.dataTransfer.getData('index');
					var dv = _this.final_assembly.children[index];
					var cloneDv = dv.cloneNode(true);
					var target_default = _this.target_area.getElementsByClassName("place-box")[0];
					if(_this.isDouble) {
//						console.log("双栏来了",target_default,cloneDv,156);
						_this.doubleTarget.replaceChild(cloneDv, target_default);
//						document.getElementsByClassName("double_column")[0].style.height = "auto";
					}else{
						_this.target_area.replaceChild(cloneDv, target_default);
					}
					_this.hoverTarget(_this.doubleTarget);
//					_this.doubleTarget = '';
				}else if(_this.sourceParent==_this.target_area){
					console.log(999);
					var target_default = _this.target_area.getElementsByClassName("place-box")[0];
					_this.target_area.replaceChild(_this.source, target_default);
					_this.dragNum = 0;
				}else{
					console.log("other");
				}
				_this.source = '';
				_this.isPut = true;
				_this.dragTarget();
			}
		},
		dragTarget: function(){
			//目标内拖拽
			var _this = this;
			console.log(this.doubleTarget,210);
			if(this.doubleTarget.children.length>0){
				for(var i=0;i<this.doubleTarget.children.length;i++){
					this.doubleTarget.children[i].index=i;
					this.doubleTarget.children[i].style.position = "relative";
					//点击
					this.doubleTarget.children[i].onclick=function(ev){
						ev.stopPropagation();
						for(var j=0;j<_this.doubleTarget.children.length;j++){
							_this.doubleTarget.children[j].style.border = "none";
						}
						this.style.border = "2px dotted red";
						_this.showStyle(this);
					}
					//开始拖拽
					this.doubleTarget.children[i].ondragstart = function(ev){
						for(var j=0;j<_this.doubleTarget.children.length;j++){
							_this.doubleTarget.children[j].style.border = "none";
						}
						this.style.border = "2px dotted red";
						
						_this.isPut = false;
						_this.source = this;
						_this.sourceParent = this.parentNode;
						_this.dragNum = 0;
						
						var cloneDv = _this.placing_box.cloneNode(true);
						_this.doubleTarget.appendChild(cloneDv);
						
					}
					//拖拽中
					this.doubleTarget.children[i].ondrag = function(ev) {
						var target_default = _this.doubleTarget.getElementsByClassName("place-box")[0];
						if(_this.dragNum==0){
							_this.doubleTarget.replaceChild(target_default,_this.source);
						}
						_this.dragNum++;
						//console.log("拖拽中");
					}
					//拖拽结束
					this.doubleTarget.children[i].ondragend = function(ev) {
						var target_default = _this.doubleTarget.getElementsByClassName("place-box")[0];
						if(!_this.isPut && target_default) {
							_this.doubleTarget.replaceChild(_this.source,target_default);
						}
						//console.log("拖拽结束");
					}
				}
			}
		},
		hoverTarget: function(hover_span){
			var _this = this;
			var delete_span = document.createElement("span");
			delete_span.setAttribute("class","delete_span");
			delete_span.innerHTML = "X";
//			console.log(hover_span)
//			console.log(this.doubleTarget.children,232);
			for(var i=0;i<hover_span.children.length;i++){
				hover_span.children[i].onmouseenter = function(ev){
					ev.stopPropagation();
					this.appendChild(delete_span);
					_this.deleteTarget(this);
				}
				hover_span.children[i].onmouseleave = function(ev){
					ev.stopPropagation();
					this.removeChild(this.lastChild);
				}
			}
		},
		deleteTarget: function(that){
			var _this = this;
			that.lastChild.onclick = function(ev){
				ev.stopPropagation();
				console.log(ev.target.parentNode);
				
				if(ev.target.parentNode.parentNode == _this.target_area){
					_this.target_area.removeChild(that);
				}else{
					ev.target.parentNode.parentNode.removeChild(that);
				}
				/*if(ev.target.parentNode.parentNode.dataset.type){
				}else{
				}*/
				
				for(var i=0;i<_this.style_area.children.length;i++){
					_this.style_area.children[i].style.display = "none";
				}
			}
		},
		showStyle: function(that){
			for(var i=0;i<this.style_area.children.length;i++){
				this.style_area.children[i].style.display = "none";
			}
			var changeClick = this.style_area.children[that.dataset.stylenum];
			changeClick.style.display = "block";
			for(var i = 0; i < changeClick.children.length; i++) {
				if(changeClick.children[i].dataset.change){
					switch(changeClick.children[i].dataset.change){
						case "0":
							changeClick.children[i].onclick = function(){
								that.innerHTML = this.outerHTML;
							}
						break;
					}
				}
			}
		}
		
		
	}
	
