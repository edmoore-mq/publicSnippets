function renderPagination(){
	if( $('#pagination').data("twbs-pagination") )
		$('#pagination').twbsPagination('destroy');


	numPages = Math.ceil(items.length/$("#itemsPerPage").val());
	$('#pagination').twbsPagination({
        totalPages: numPages,
        visiblePages: Math.ceil(numPages, 7),
        onPageClick: function (event, page) {
            renderTable((page-1)*$("#itemsPerPage").val()+1);
        }
    });
}

// Request the first page of results (and force the jPut table to render)
function renderTable(start){
	$("#tbody").html('');


	$("#tbody").jPut({
		// ajax_url:'api/latest/getAllUsers',
		jsonData: items.slice(start-1),
		// dataName:'data',
		name:"tbody_template",
		limit: $("#itemsPerPage").val(),
		done:function(e){
			// Hide all elements that are conditionally shown
			$("*[showValue]").each(function(){
				$(this).hide();
				if( $(this).parent().parent().attr('data-active') == $(this).attr('showValue') )
					$(this).show();
			})

			// Permission specific hide/show
			$("table#mainTable [data-permID]").each(function(){
				var roleid = $(this).parent().parent().attr('data-id');
				var permID = $(this).attr('data-permid');
				var index = -1;

				// Find the right array value
				$.each(e, function(i, item){
					if( item.roleid == roleid ){
						index = i;
					}
				});

				if(e[index].permissions !== false){
					if (e[index].permissions.indexOf(permID) >= 0){
						$(this).css('color', '#5cb85c');
					}else{
						$(this).css('color', '#CCCCCC');
					}
				}else{
					$(this).css('color', '#CCCCCC');
				}
			});

			// Disable the buttons for the first user/role
			$("table.disableFirst tr[data-id=1] a").addClass('disabled', true);

			$.LoadingOverlay("hide");
		},
		error:function(msg){
			alert("There was an error loading the page!");
			$.LoadingOverlay("hide");
		}
	});
};