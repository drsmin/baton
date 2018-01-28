function openSendMsgPop() {
    window.open("/com/pop/sendMsgPop",'sendMsgPop','width='+ 700 +',height='+ 500 +'');
}

function openRegImgPop() {
    window.open("/sys/pop/regImgPop",'sendMsgPop','width='+ 700 +',height='+ 500 +'');
}

function openRegMovPop() {
    window.open("/sys/pop/regMovPop",'sendMsgPop','width='+ 700 +',height='+ 500 +'');
}

isloading = {
	start : function() {
		if (document.getElementById('wfLoading')) {
			return;
		}
		var ele = document.createElement('div');
		ele.setAttribute('id', 'wfLoading');
		ele.classList.add('loading-layer');
		ele.innerHTML = '<span class="loading-wrap"><span class="loading-text"><span>.</span><span>.</span><span>.</span></span></span>';
		document.body.append(ele);

		// Animation
		ele.classList.add('active-loading');
	},
	stop : function() {
		var ele = document.getElementById('wfLoading');
		if (ele) {
			ele.remove();
		}
	}
}

function _viewLoading() {

	isloading.start();
}

function _hideLoading() {

	isloading.stop();
}

function _sendAjax(url, params, cb, cbErr) {
    $.ajax({
        url: url,
        method : "post",
        dataType : "json",
        data : params,
        beforeSend : _viewLoading,
        complete : _hideLoading
    })
    .done(cb)
    .fail(function (xhr, status, errorThrown) {
        
        alert("오류 발생 " + status);
        
        if (cbErr) {
            cbErr(status, erroThorwn);
        }

    })
    .always(_hideLoading);
}

function _validFormItem(formItem, feedback, validMsg, invalidMsg, isValid) {
    if (false == isValid) {
        formItem.removeClass("is-valid").addClass("is-invalid");
        feedback.removeClass().addClass("invalid-feedback").html(invalidMsg);
    } else {
        formItem.removeClass("is-invalid").addClass("is-valid");
        feedback.removeClass().addClass("valid-feedback").html(validMsg);
    }
}