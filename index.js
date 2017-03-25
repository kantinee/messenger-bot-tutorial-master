//This is still work in progress
/*
Please report any bugs to nicomwaks@gmail.com

i have added console.log on line 48 




 */
'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
let xhistory  =""

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	} else {
		res.send('Error, wrong token')
	}
})

// to post data
app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			let fntext = text.substring(0, 200) 
			if (text === 'Generic'){ 
				console.log("welcome to chatbot")
				//sendGenericMessage(sender)
				continue
			}
			//----Test HandY
			sendTextMessage(sender, "ying Processing..." + fntext) 
			var exec = require('child_process').exec, child;
			child.stdout.pipe(process.stdout)
			child.on('exit', function() {
			  process.exit()
			})
			child = exec('/usr/bin/java -jar ~/TunTREND_M1_SentimentCurrent.jar fntext' ,
			  function (error, stdout, stderr){
			    console.log('stdout: ' + stdout);
			    console.log('stderr: ' + stderr);
			    sendTextMessage(sender, stdout + "-" + stderr) 
			    if(error !== null){
			      console.log('exec error: ' + error);
			      sendTextMessage(sender, error) 
			    }
			});
			
			sendTextMessage(sender, "ying End.") 
			//sendImg(sender)
			//-----End Test Handy
			
			//xhistory = xhistory + text.substring(0, 200)
			//sendTextMessage(sender, "TunTrend says :  " + xhistory)
		    //sendGenericMessage(sender)
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
			continue
		}
	}
	res.sendStatus(200)
})


// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.FB_PAGE_ACCESS_TOKEN
const token = "EAANX2ObyZCAMBAPWPW4W1EzZB2zZCkjvAibgwpPXrkRD3XmRnsWZAAOBahvefTEymgH8Yhubsu92sWnLE6IYm5fADdue0F2PYKoUb5AH5tZA5BLmOyXGZAuYD3ZAhxlv6pZBPNnrZAdG3cRh2OgXaODsqynZCFtVMsIwrDlRLbdyqa0gZDZD"

function sendTextMessage(sender, text) {
	let messageData = { text:text }
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}
//Handy
function sendImg(sender,xurl) {
	
	let messageData = {
		"attachment": {
			"type": "image",
			"payload": {"url": "https://www.google.co.th/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"}
	}}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

//end handy

function sendGenericMessage(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "First card",
					"subtitle": "Element #1 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/rift.png",
					"buttons": [{
						"type": "web_url",
						"url": "https://www.messenger.com",
						"title": "web url"
					}, {
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for first element in a generic bubble",
					}],
				}, {
					"title": "Second card",
					"subtitle": "Element #2 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
					"buttons": [{
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for second element in a generic bubble",
					}],
				}]
			}
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
