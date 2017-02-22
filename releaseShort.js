$(document).ready(function(){
	$('.releaseRtn-js').click(function(){
		window.location.href = "/contentManagement/shortArticle";
	});
	var images=[],id=[],i=1;
	function addImage(){
		$('#file1').click(function (){
			$(this).off("change").on("change",function(){
				var files= $(this).attr('id');

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
								//将图片路径存入src中，显示出图片
								$('#file1').parent().remove();
						//上传成功后在其后面增加一个上传按钮；
								$('.addImgWrap').prepend('<div class="addImgBox">'+
										'<img src="/static/img/photo1.png" id="img1" alt="">'+
										'<input class="addImgBoxInput" id="file1" type="file" name="file1" multiple="" accept="image/gif,image/jpeg,image/jpg,image/png">'+
										'</div>');
						//上传成功后从服务器获取照片，显示到页面
								$('#file1').parent().after($('<img src="/api/file/'+data.records[0]+'" data-id="'+data.records[0]+'" class="image1 addImages" style="float:left;margin-bottom:20px;width: 200px;height: 150px;margin-right: 20px;" alt="">'));
								addImage();
								deleteImage(data.records[0]);

						}
					},
					error:function(xhr,status,error){
						$('#noSelect_tip1 span').text(xhr.responseJSON.error);
						$('#noSelect_tip1').show();
						$('#noSelect_tip1').fadeOut(2000);
					}
				});
			});
		});
	}
	addImage();
	function deleteImage(imageId){
		$('.image1[data-id="'+imageId+'"]').click(function(){
			var _this =this;
			$('.delete-js').show();
			$('.sure-js').click(function(){
				$(_this).remove();
				$('.delete-js').hide();
			});
			$('.cancel-js').click(function(){
				$('.delete-js').hide();
			});

		});
	}
	//创建新的添加照片按钮
	function addImageButton(ele){
		var html= '<div class="addImgBox">' +
				'<img src="/static/img/photo1.png" id="img'+i+'" alt="">' +
				'<input class="addImgBoxInput" id="file'+i+'" type="file" name="file1'+i+'" multiple="" accept="image/gif,image/jpeg,image/jpg,image/png">' +
				'</div>';
		ele.insertAfter(html);
	}
	//图片自动缩小函数
	function autoSmall(picBox){
		picBox.each(function(){
			var x = 400;  //图片展示区域的宽
			var y = 160;  //图片展示区域的高
			var w = picBox.width();  //要压缩的图片的宽
			var	h = picBox.height(); //要压缩的图片的高
			if(w>x){  //图片宽度大于展示区域宽度
				var w_original = w,
						h_original = h;
				h = h*(x/w); //根据展示高度按比例计算出图片缩小后的高度
				w = x;
				if( h < y){  //图片缩小后的高度若小于展示区域的高度时s
					w = w_original * (y/h_original); //按照展示区域的高度重新按比例计算图片的宽度
					h = y;
				}
			}
			picBox.attr({'width':w,'height':h});
		});
	}
	$('#VCode').on('mouseout',function(){
		if($('#VCode').val().length>0 && $('#VCode').val().replace(/\'/g,'"').match(/http[s]?\:\/\/[^\"]+/) == null){
			$('#noSelect_tip1 span').text('长文视频格式错误,请重新填写！');
			$('#VCode').val('');
			$('#noSelect_tip1').show();
			$('#noSelect_tip1').fadeOut(2000);
		}
	});
	var url = '';
	$('#release').click(function(){
		//腾讯视频代码正则表达式
		if($('#VCode').val() &&　$('#VCode').val().replace(/\'/g,'"') && $('#VCode').val().replace(/\'/g,'"').match(/http[s]?\:\/\/[^\"]+/)){
			var vCode =　$('#VCode').val().replace(/\'/g,'"') ;
			 url = vCode.match(/http[s]?\:\/\/[^\"]+/)[0];
		}else{
			 url = '';
		}
		var word=$('.content-box').val();
		for(var i=0;i<$('.addImages').length;i++){
		 id.push($('.addImages').eq(i).attr('data-id'));
		}
		if(word.length>0){
			$.ajax({
				type:'POST',
				url:'/api/timeLine/article/',
				data:JSON.stringify({longText:false,word:word,images:id,video:url}),
				dataType:'json',
				success:function(data,status){
					if(status=='success'){
						$('#noSelect_tip1 span').text('短文发表成功！');
						window.location.href='/contentManagement/shortArticle';
					}
				},
				error:function(xhr,status,error){
					$('#noSelect_tip1 span').text(xhr.responseJSON.error);
					$('#noSelect_tip1').show();
					$('#noSelect_tip1').fadeOut(2000);
				}
			});
		}else {
			$('#noSelect_tip1 span').text('短文内容不能为空！')
			$('#noSelect_tip1').show();
			$('#noSelect_tip1').fadeOut(2000);
		}

	});

});