
$(document).ready(function(){
	var optionImageId=[],id,sumData,presentNum,sumPage, globalTags=[];
	//返回按钮
	$('.voteBtn-js').click(function(){
		window.location.href = "/CircleMerchantManagement/IntegratedCommodityManagement";
	});
	var isPhoto =false; //是否为封面图，默认为不是
	//默认图片的点击效果
	//图片预览
	var id;//上传图片的id
	var file1='#file1';
	var option1= '#option1';
	uploadImage(file1);
	uploadImage(option1);
	function uploadImage(addBtn){
		$(addBtn).off("click").on("click",function (){
			var _this=this;
			$(addBtn).off("change").on("change",function(){
				var files = !!this.files ? this.files : [];
				if(files.length==0)return;
				files= $(this).attr('id');
				//生成缩略图
				$.ajaxFileUpload({
					type:'POST',
					url:'/api/file/',
					fileElementId:files,
					data:{file:files,csrfmiddlewaretoken:getCookie('csrftoken')},
					dataType: 'JSON',
					success:function(data,status){
						if(status ='success'){
							data=JSON.parse(data);
							//上传成功后从服务器获取照片，显示到页面
							id=data.records[0];
							$(addBtn).prev().attr('src',"/api/file/"+data.records[0]).attr('data-id',data.records[0]).css({width:'200px',height:'150px'});
							$(addBtn).remove();
							uploadImage($(_this));
						}
					},
					error:function(xhr,status,error){
						$('#noSelect_tip1 span').text(xhr.responseJSON.error);
						$('.noSelect_tip').show();
						$('.noSelect_tip').fadeOut(4000);
					}
				});
			});
		});
	}

	var imageShow ='#imageShow';
	var img1 ='#img1';
	function deleteImage(pic){
		$('.delete-js').show();
		confirmDeleteImage(pic);
	}
	function confirmDeleteImage(pic){
		$('.sure-js').off('click').on("click",function(){
			$(pic).attr('src','/static/img/photo.png').removeAttr('data-id');
			if(pic == "#imageShow"){
				$(pic).after('<input class="addImgBoxInput" style="margin-left: -200px;" id="file1"  name="file1" accept="image/gif,image/jpeg,image/jpg,image/png" type="file"/>');
				uploadImage(file1);
				}else if(pic == "#img1"){
				$(pic).after('<input class="input-js2" id="option1" name="option1" accept="image/gif,image/jpeg,image/jpg,image/png" type="file">');
				uploadImage(option1);
				}else{
				picc =pic.slice(0,4)+String(parseInt(pic.slice(4))-1);
				$(picc).attr('src','/static/img/photo.png').removeAttr('data-id');
				$('#img'+picc.slice(4)).off('click').on('click',function(){
					deleteImage('#img'+picc.slice(4));
				});
				$(picc).after('<input class="input-js2" id="option'+picc.slice(4)+'"  name="option'+picc.slice(4)+'"  accept="image/gif,image/jpeg,image/jpg,image/png" type="file">');
				uploadImage('#option'+picc.slice(4));
			}
			$('.delete-js').hide();
		});
	}
	$('.cancel-js').click(function(){
		$('.delete-js').hide();
	});
	$('#imageShow').off('click').on('click',function(){
		deleteImage(imageShow);
	});
	$('#img1').off('click').on('click',function(){
		deleteImage(img1);
	});
	uploadImage();
	$("#totalCoin").mouseout(function(){
		$('#totalCoin').val(parseInt($('#totalCoin').val()));
	});
	//保存功能
	$('.release-js').click(function(){
		//获取用户的输入值
		var name = $('#title').val();  //标题
		var remark= $('#discribe').val(); //描述
		var pictureHome =[];
		pictureHome.push($('#imageShow').attr('data-id'));  //封面图
		var totalCoin= parseInt($('#totalCoin').val()); //总需圈币
		if(name.length>0 && remark.length>0 && pictureHome.length>0 && totalCoin>0){
			$.ajax({
				type:'POST',
				url:'/api/mallBalance/',
				data:JSON.stringify({name:name,remark:remark,images:pictureHome,price:totalCoin,selling:true}),
				dataType:'json',
				success:function(data,status){
					if(status ='success'){
						$('.noSelect_tip span').text('新增产品成功！');
						$('.noSelect_tip').show();
						$('.noSelect_tip').fadeOut(4000);
						window.location.href='/CircleMerchantManagement/IntegratedCommodityManagement';
					}
				},
				error:function(xhr,status,error){
					$('.noSelect_tip span').text(xhr.responseJSON.error);
					$('.noSelect_tip').show();
					$('.noSelect_tip').fadeOut(4000);
				}
			});
		}else{
			if(name.length==0){
				$('.noSelect_tip .noSelect_text').text('商品标题不能为空！');
			}else 	if(remark.length==0){
				$('.noSelect_tip .noSelect_text').text('商品描述不能为空！');
			}else if(pictureHome.length==0){
				$('.noSelect_tip .noSelect_text').text('商品图片不能为空！');
			}else{
				$('.noSelect_tip .noSelect_text').text('总需圈币必须为整数！');
			}
			$('.noSelect_tip').show();
			$('.noSelect_tip').fadeOut(4000);
		}
	});
});