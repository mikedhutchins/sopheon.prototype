
function randomString() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 5; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function CaptchaPassed(dialog) {
	return $(dialog).find("#captcha").text().toLowerCase() ==
		   $(dialog).find("#user-captcha").val().toLowerCase();
};

function AddCaptcha(dialog) {
	$(dialog).find("form input:last")
			 .after('<span style="color: red;">*</span><label>Type this into the box below:</label>' +
					'<span id="captcha" style="font-size: 10pt;padding-left: 5px;">' + randomString() + '</span>' +
					'<input id="user-captcha" maxlength="40" size="20" type="text" />' +
					'<span id="captcha-incorrect" style="display: none; color: red; font-size: 10pt;">Captcha is incorrect!</span>');
}