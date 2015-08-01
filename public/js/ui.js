// **************************************************************** //
// Scripts involving the user interface	

// Switch from the login view to the local/remote host display
function showAppView(path, files) {
	// Hide the login inputs (set opacity to zero, then set vis to 'hidden')
	console.log("--> in hideLoginView()");
	document.getElementById('loginView').style.opacity = '0';

	// Wait for the opacity transition to finish, then display the filesystem
	$(".centered").on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() { showInterface(path, files); $(this).off(); });
}

// Switch from the local/remote host display to the view 
function showLoginView() {
	console.log("--> in showLoginView()");
}

function showInterface(path, files) {
	console.log("--> in showInterface()");

	// First set the visibility of the login view to hidden
	document.getElementById('loginView').style.display = 'none';

	var localWindow = document.createElement('div');
	var remoteWindow = document.createElement('div');
	var localView = document.createElement('div');
	var remoteView = document.createElement('div');
	var localToolbar = document.createElement('div');
	var remoteToolbar = document.createElement('div');

	// Local window attributes
	localWindow.id = 'localWindow';
	localWindow.className = 'window';
	localToolbar.id = 'localToolbar';
	localToolbar.className = 'toolbar';
	localToolbar.innerHTML = 'Local Host'; 
	localToolbar.fontSize = '10px';

	// Remote window attributes
	remoteWindow.id = 'remoteWindow';
	remoteWindow.className = 'window';
	remoteToolbar.id = 'remoteToolbar';
	remoteToolbar.className = 'toolbar';
	remoteToolbar.innerHTML = 'Remote Host'; 
	remoteToolbar.fontSize = '10px';

	// Local view attributes
	localView.id = 'localView';
	localView.className = 'hostView';
	localView.style.display = 'block';
	localView.style.backgroundColor = 'white';
	localView.style.overflow = 'scroll';

	// Remote view attributes
	remoteView.id = 'remoteView';
	remoteView.className = 'hostView';
	remoteView.style.display = 'block';
	remoteView.style.backgroundColor = 'white';
	remoteView.style.overflow = 'scroll';
	
	// Append to the DOM
	localWindow.appendChild(localToolbar);
	localWindow.appendChild(localView);
	remoteWindow.appendChild(remoteToolbar);
	remoteWindow.appendChild(remoteView);
	document.getElementById('app').appendChild(localWindow);
	document.getElementById('app').appendChild(remoteWindow);

	showDirectory(path, files);
}

// **************************************************************** //

function showDirectory(path, files) {
	console.log('--> in showDirectory()');
	
	var list = document.createElement('ul');

	// Display the file listing for the current directory 
	for(var i = 0; i < files.length; i++) {
		var file = document.createElement('li');
		file.style.color = '#545454';
		// file.style.color = 'darkcyan';
		file.innerHTML = files[i].filename;
		list.appendChild(file);
	}

	document.getElementById('remoteView').appendChild(list);
	console.log("Should be done by now...");
}	