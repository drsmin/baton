function openSendMsgPop(div) {
    window.open("/com/pop/sendMsgPop/" + div,'sendMsgPop','width='+ 700 +',height='+ 500 +'');
}

function openRegImgPop(div, width, height) {
    
    if (!width) {
        width = "1";
    }
    
    if (!height) {
        height = "1";
    }
    
    window.open("/sys/pop/regImgPop/" + div + "/" + width + "/" + height,'sendMsgPop','width='+ 900 +',height='+ 700 +'');
}

function openRegMovPop(div) {
    window.open("/sys/pop/regMovPop/" + div,'sendMsgPop','width='+ 700 +',height='+ 500 +'');
}

var isloading = {
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
};

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