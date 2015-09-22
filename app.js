var fs = require('fs');
var path = require('path');
var async = require('async');
var express = require('express');
var client = require('ssh2').Client;
var favicon = require('serve-favicon');

var app = express();
var connection = new client();
var sftp = require('./src/controllers/sftp.js');
var factory = require('./src/controllers/sftp.js');

// ******************************************************************************** //
// Express.js Stuff //

// Make the page respond with the follow for requests to the homepage ('/')
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname+'/index.html'));
});

// uncomment after placing your favicon in /src
// app.use(favicon(path.join(__dirname, 'src', 'favicon.ico')));

app.use(express.static(path.join(__dirname, 'src')));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/sounds', express.static(path.join(__dirname, 'sounds')));
app.use('/src/views', express.static(path.join(__dirname, 'src/views')));
app.use('/src/controllers', express.static(path.join(__dirname, 'src/controllers')));
app.use('/src/stylesheets', express.static(path.join(__dirname, 'src/stylesheets')));
app.use('/socket.io/socket.io.js', express.static(path.join(__dirname, '/socket.io/socket.io.js')));

// ******************************************************************************** //
// Socket.io client-server communication stuff //
// Start a server and listen on port 1337 for connection
var server = app.listen(process.env.PORT || 1337, function () {
	var port = server.address().port;
	var io = require('socket.io').listen(server);
	console.log('Listening at http://'+(server.address().address || 'localhost')+':'+port);
	
	// Upon a successful server connection
	io.on('connect', onConnect);
});

// ******************************************************************************** //
// A nice bread crumb trail of callbacks 
var gSocket;
function onConnect(socket) {	
	// Receive an input from the client 
	gSocket = socket;
	var ipaddr = socket.request.socket.remoteAddress;

	console.log("IP Address: "+ipaddr);
	socket.on('message', onClientMessage); 
	socket.on('error', function (err) {
		console.log("Socket error! "+err);
		error(err);
	});
}

// Upon the retrieval of inputs from the client
function onClientMessage(input) {
	// console.log("Received input from the client: "+JSON.stringify(input, null, 2)); 
	
	// Assign method chain upon a successful sftp connection 
	connection
		.on('ready', sftpReady) 
		.on('close', sftpClose)
		.on('error', error)
		.connect({
			host: input.hostname,
			port: input.port,
			username: input.username,
			password: input.password
		});			
}
 
function error(err) {
	console.log('error: '+JSON.stringify(err));
	connection.end();
}

// Upon the ready status of the sftp connection 
function sftpReady() {
	gSocket.emit('status', 'success');
	console.log('Client :: ready');
	connection.sftp(sftpStart);
}

// Upon either a disconnect or an exit
function sftpClose() {
	console.log('SFTP session closed!');
	connection.end();
}

var gSFTP;
// Start executing sftp commands within the current session
function sftpStart(err, sftp) {
	gSFTP = sftp;
	// Send a status message to the client
	if(err) { gSocket.emit('status', 'Failed to start session: '+err.message); }

	// Get the home directory listing of the local host 
	var localFiles = [];
	var home = (process.env.HOME) ? process.env.HOME+'/' : '/';
	var temp = fs.readdirSync(home);
	for(var i = 0; i < temp.length; i++) 
		localFiles.push({ 'filename' : temp[i], 'longname' : '', 'attrs' : {} });
	for(var i = 0; i < localFiles.length; i++) {
		var stats = fs.statSync(home+'/'+localFiles[i].filename);
		localFiles[i].attrs = stats; 
		localFiles[i].attrs.isDirectory = stats.isDirectory(); 
	}
	
	// Get the root directory listing of the remote host
	sftp.readdir('/', function(err, remoteFiles) {
			
		// Iterate through the remoteFiles and determine which files are directories
		var fileIndex = 0; 
		async.each(remoteFiles, async.ensureAsync(function(file, done) {
			// Execute a file stat callback per iteration of the remoteFiles
			sftp.stat('/'+file.filename, function(err, stats) {
				// Append to the attrs section of the file 
				remoteFiles[fileIndex].attrs.isDirectory = stats.isDirectory();
				fileIndex++;
				done();
			});
		}), function() {
			// Callback function upon finish
			var view = {
				'ui'	: 'hosts',
				'local' : {
					'cwd': home,
					'files' : localFiles
				},
				'remote' : {
					'cwd': '/',
					'files' : remoteFiles 
				}
			};

			// Send the file attribute information to the client
			gSocket.emit('view', view);
		});

	});

	// Run sftp command based on the user's interaction with the ui 
	gSocket.on('command', function(command, file1, file2) {
		factory.run(gSocket, gSFTP, command, file1, file2);
	}); 

	gSocket.on('refresh', function(panel, path) {
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
		// Change the directory of the local host
		var retrieve = require('./src/controllers/retrieve.js');
		if(panel === 'local') {
			var data = retrieve.localFiles(path);
			// Send the file attribute information to the client
			if(data) gSocket.emit('update', data);
			else return;
		}
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
		// Change the directory of the remote host
		else if(panel === 'remote') {
			// Send the file attribute information to the client
			retrieve.remoteFiles(sftp, path).then(function(data) {
				gSocket.emit('update', data);
			}).catch( function(reason) {
				console.log("Error (retrieve.remoteFiles): "+reason);
				gSocket.emit('error', reason);
			});
		}		
	});
}
