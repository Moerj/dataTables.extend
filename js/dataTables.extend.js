/**
 * [dataTables的自定义扩展]
 * 依赖于：jQuery、datatables
 * @Author   Moer
 */

$.extend( $.fn.dataTable.defaults, {
	// 汉化datatables
    language: {
        "sProcessing": "处理中...",
        "sLengthMenu": "显示 _MENU_ 项结果",
        "sZeroRecords": "没有匹配结果",
        "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
        "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
        "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
        "sInfoPostFix": "",
        "sSearch": "搜索:",
        "sUrl": "",
        "sEmptyTable": "表中数据为空",
        "sLoadingRecords": "载入中...",
        "sInfoThousands": ",",
        "oPaginate": {
            "sFirst": "首页",
            "sPrevious": "上页",
            "sNext": "下页",
            "sLast": "末页"
        },
        "oAria": {
            "sSortAscending": ": 以升序排列此列",
            "sSortDescending": ": 以降序排列此列"
        }
    }
});


(function($){
	$.fn.extend({  

		/**
		 * [添加自定义按钮]
		 * @Author   Moer
		 * @DateTime 2015-09-12T15:18:17+0800
		 * @param    {[type] = object or string}	relateButtons [自定义的按钮或按钮组]
		 * @param    {[type] = string}    			domId     	  [要放置的位置，"top" = 左上角，"top-r" = 右上角，"bottom" = 左下角，"bottom-r" = 右下角]
		 * 
		 * 建议将datatable配置为
		 * DataTable({
		 * 	  "dom": 'frtip'
		 * });
		 */
	    addButtons:function (relateButtons,domId) {
	    	var tableId = "#" + this.attr('id');
	    	var table_wrapper = $(tableId + "_wrapper");//实例化的datatable父容器

	    	// 确保传入的按钮是jQuery对象，这样就可兼容传入id或class字符串
    		relateButtons = $(relateButtons);

	    	//默认的按钮布局方向
			var direction = 'left' ; 
			if (domId.indexOf('-r')>=0) {
				direction = 'right' ; 
			}

			// 将按钮组添加到datatable的左上角或者右下角
			if (domId===undefined || domId.indexOf('top')>=0) {
				if (direction === 'left') {
					domId = table_wrapper.children('.row').first().children('div').first();
				}else{
					domId = table_wrapper.children('.row').first().children('div').last();
				}
			}
			else if (domId.indexOf('bottom')>=0) {
				if (direction === 'left') {
					domId = table_wrapper.children('.row').last().children('div').first();
				}else{
					domId = table_wrapper.children('.row').last().children('div').last();
				}
			}

			// 将按钮组放入
			domId.prepend( relateButtons );

			// 按钮组布局方向调整
			relateButtons.wrap('<div class="btnGroup-wrapper" style="text-align:'+direction+'"></div>');


			return this;
		},


		/*定义全局选中行的类名，默认为bootstrap的info*/
		selectedClass: 'info' ,


		/**
		 * [允许表单行数据被选中，并控制自定义按钮禁用或启用]
		 * @Author   Moer
		 * @DateTime 2015-09-13T16:05:28+0800
		 * @param    {[type] = object or string}    relateButtons 	[有选中状态才会激活的自定义按钮]
		 * @param    {[type] = string}      		selectMode   	[鼠标点选行的模式："single"、"multiple"]
		 * @param    {[type] = string}     			selectedClass   [定义标记选中行的class]
		 */
		allowSelect: function ( relateButtons, selectMode, selectedClass ) {
			var	tbody = this.find('tbody');
			var mouseEvent = 'click';

			// 确保传入的按钮是jQuery对象，这样就可兼容传入id或class字符串
    		relateButtons = $(relateButtons);

			// 选择行的颜色未定义，则取全局定义的颜色
			if ( selectedClass === undefined ) {
				selectedClass = this.selectedClass ;
			}

			// 配置选择模式
			if (selectMode === "single") {//单选模式
				tbody.on( 'click', 'tr', function () {
					var selectedRows = tbody.find( 'tr.' + selectedClass );
					selectedRows.not(this).removeClass( selectedClass );//反选之前已选中的行
				    $(this).toggleClass( selectedClass );
				    relate ();
				} );

			} else if (selectMode === "multiple"){//多选模式，可拖拽连选
				isMousedown = false;//隐式声明开关变量，记录鼠标按下
				tbody.css('user-select', 'none');//禁止拖拽时选中文本
				mouseEvent = 'mousedown';//冒泡事件更改

				// 拖拽事件
				tbody.on( 'mousedown', 'tr', function () {//点击
				    isMousedown = true;
				    $(this).toggleClass( selectedClass );
				    relate ();
				} )
				.on( 'mouseenter', 'tr', function () {//移动拖拽
				    if (isMousedown === true) {
				    	$(this).toggleClass( selectedClass );
				    	relate ();
				    }
				} );

				// 松开鼠标按钮，关闭拖拽
				$(window).on( 'mouseup', function () {
				    isMousedown = false;
				} );

			} else {//默认模式，可多选，但不可拖拽多选
				tbody.on( 'click', 'tr', function () {
				    $(this).toggleClass( selectedClass );
				    relate ();
				} );
			}


			// 防止表格内按钮点击冒泡
			tbody.on( mouseEvent, 'tr button,a,input[type=button]', function(event) {
				// console.log('阻止冒泡');
				return false;
			});


			// 对传入进来的relateButtons进行处理，找出哪些是禁用的
			// 如果它本身非禁用，则判断它为按钮组的父容器，然后在里面继续查找禁用的按钮
			if (relateButtons !== undefined && !relateButtons.is(':disabled')) {
				var childBtn = relateButtons.children('*');
				
				if (childBtn.length > 0) {
					var childBtn_dis = relateButtons.find(':disabled');
					
					if (childBtn_dis.length === 0) {
						childBtn.attr('disabled', true);
						relateButtons = childBtn;

					}else{
						relateButtons = childBtn_dis;
					}

				}else{
					relateButtons.attr('disabled', true);
				}

				// 表格重绘时，重置需要禁用的按钮
				this.on('draw.dt', function() {
					relateButtons.attr('disabled', true);
				});
			}
			

			// 有行选中时激活功能按钮
			function relate () {
				if (relateButtons !== undefined) {
					var selectedRows = tbody.find( 'tr.' + selectedClass );
					if (selectedRows.length > 0) {
						relateButtons.attr('disabled', false);
					}else{
						relateButtons.attr('disabled', true);
					}
				}
			}

			return this;
		}

	});  
})(jQuery);