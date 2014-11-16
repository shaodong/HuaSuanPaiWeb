var g_showWaitingOverlay = false;
var g_suppressAjaxCallOverlay = false;
var g_illegalCharDetected = false;

function ajaxStartCall() {
    g_showWaitingOverlay = true;
       
    if ($.ApplicationSettings.AjaxCallOverlayDelay >= 0 && !g_suppressAjaxCallOverlay) {
        setTimeout(showWaitingDialog, $.ApplicationSettings.AjaxCallOverlayDelay);
    }
}

function ajaxStopCall() {
    if (!g_illegalCharDetected) {
        $.unblockUI();
    }
    g_showWaitingOverlay = false;
    g_suppressAjaxCallOverlay = false;
    g_showAjaxCallOverlayImmediately = false;
}

function showWaitingDialog() {
    if (g_showWaitingOverlay) {
        showWaitingLayer();
    }
}

function showWaitingLayer() {
    $.blockUI({
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            'border-radius': '5px',
            '-webkit-border-radius': '5px',
            '-moz-border-radius': '5px',
            opacity: .6,
            color: '#fff',
        },
        baseZ: 9999,
    });
}

function hideWaitingLayer() {
    $.unblockUI();
}

function formatIllegalCharMsg(errorMsg) {
    return '<div class="alert alert-warning" style="margin-bottom: 0px; cursor: default;"><button class="close" onclick="hideIllegalCharErrorLayer()">&times;</button>'
    + errorMsg + '</div>'
}

function showIllegalCharErrorLayer(errorMsg) {
    g_illegalCharDetected = true;
    $.blockUI({
        message: formatIllegalCharMsg(errorMsg),
        css: {
            border: 'none',
            backgroundColor: '#000',
            'border-radius': '5px',
            '-webkit-border-radius': '5px',
            '-moz-border-radius': '5px',
            opacity: 1,
            width: '50%',
            top: '40%',
            left: '25%'
        },
        baseZ: 9999,
    });
}

function hideIllegalCharErrorLayer() {
    g_illegalCharDetected = false;
    $.unblockUI();
}

window.onerror = ajaxStopCall;
$(document).ajaxStart(ajaxStartCall).ajaxStop(ajaxStopCall);

function ajaxRequest(type, url, async, data, callback) {
    $.ajax({
        type: type,
        url: "http://api.easyzb.com:7070/easyzb/" + url,
        data: ko.toJSON(data),
        dataType: "json",
        async: async,
        xhrFields: { withCredentials: true},
        success: function (response) {
            if(response.status == 10008){
                // to do
                // logout
                // rediret to login page
            } else {
                callback(response);
            }
        },

        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("Ajax call failed");
        }
    });
}