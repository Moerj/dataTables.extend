# dataTables.userExtend
dataTables的自定义扩展

1.汉化datatables。
2.添加自定义按钮。
3.允许表单被选中。

//////////////////
// Getting Started
//////////////////

<!-- jQuery -->
<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
 
<!-- DataTables -->
<script src="http://cdn.datatables.net/1.10.7/js/jquery.dataTables.js"></script>

<!-- dataTables.userExtend -->
<script src="./js/dataTables.userExtend.js"></script>

//////////////
// API文档：
//////////////

<script>

// 实例化datatable，注意这里用的是dataTable()实例化，返回的是jQuery对象，已方便后面调用方法
var table = $('table').dataTable()

	// 添加自定义按钮，并将其布局到datatable中
	.addButtons( btns, direction )
	
	/*
	btns(必须)：将一个或多个自定的按钮加入的datatable的布局当中，你也可以创建一个按钮组，并将父容器传入。
	参数可以用id或class，如"#btn"、".button"，也可以是jQuery对象。
	
	direction(可选)：定义传入的按钮在datatable中的布局，
	"top"左上角、"top-r"右上角、"bottom"左下角、"bottom-r"右下角。
	*/


	// 允许表单被选中，选择行可以启用/禁用自定义按钮
	.allowSelect( relateButtons, selectMode, selectedClass )

	/*
	relateButtons(可选)：指定选中行以后哪些按钮会启用，未选择行则禁用。 
	
	selectMode(可选)：对datatables行进行选中操作的模式，
	"single"只允许单选、"multiple"允许多选并可拖拽连选。默认为可多选，但不支持拖拽。
	
	selectedClass(可选)：定义选中行后对其添加的class类名，以达到行颜色目的，
	默认取公共element.selectedClass定义的类名。
	*/
</script>
