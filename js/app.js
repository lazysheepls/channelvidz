$(document).ready(function(){
	document.addEventListener('deviceready',onDeviceReady, false);
});

function onDeviceReady(){
	// localStorage.setItem('maxResults',10);
	//Check local storage channel
	if(localStorage.channel == null || localStorage.channel == ''){
		// Ask User for Channel
		$('#popupDialog').popup("open");
	} else {
		var channel = localStorage.getItem('channel');
	}
	// var channel = 'TechGuyWeb';

	getPlaylist(channel);

	// Handle Cilck event
	$(document).on('click','#vidlist li',function(){
		showVideo($(this).attr('videoId'));
	});

	$('#channelBtnOk').click(function(){
		var channel = $('#channelName').val();
		setChannel(channel);
		getPlaylist(channel);
	});

	//Option page
	$('#saveOptions').click(function(){
		saveOptions();
	});

	$('#clearChannel').click(function(){
		clearChannel();
	});

	$(document).on('pageinit','#options',function(e){
		console.log("Hre");
		var channel=localStorage.getItem('channel');
		var maxResults=localStorage.getItem('maxResults');

		$('#channelNameOptions').attr('value',channel);
		$('#maxResultsOptions').attr('value',maxResults);
	});
}

function getPlaylist (channel) {
	// clear all the html in the vidlist(ul)
	$('#vidlist').html('');
	// GET Request
	$.get(
			"https://www.googleapis.com/youtube/v3/channels",
			{
				part: 'contentDetails',
				forUsername: channel,
				key:'AIzaSyBa5dwdotGATqLapTz2jl9TC_0IM0XySv4'
			},
			function(data){
				//data items is a array with only 1 element
				// console.log(data);
				$.each(data.items, function(i, item){
					playlistId = item.contentDetails.relatedPlaylists.uploads;
					getVideos(playlistId,localStorage.getItem('maxResults'));
				})
			}
		);
}

function getVideos(playlistId, maxResults){
	$.get(
		"https://www.googleapis.com/youtube/v3/playlistItems",
		{
			part: 'snippet',
			maxResults: maxResults,
			playlistId: playlistId,
			key:'AIzaSyBa5dwdotGATqLapTz2jl9TC_0IM0XySv4'
		},
		function(data){
			var output;
			$.each(data.items, function(i, item){
				id=item.snippet.resourceId.videoId,
				title=item.snippet.title;
				thumb=item.snippet.thumbnails.default.url;
				$('#vidlist').append('<li videoId="'+id+'"><img src="'+thumb+'"><h3>'+title+'</h3></li>');
				$('#vidlist').listview("refresh");
			})
		}
		);
}

function showVideo(id){
	console.log('Showing video'+id);
	$('#logo').hide();
	// store youtube embedded code
	var output='<iframe width="100%" height="250" src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen></iframe>';
	// PUT in the show video section in to the one-page-app
	$('#showvideo').html(output);
}

function setChannel(channel){
	localStorage.setItem('channel',channel);
}

function setMaxResults(maxResults){
	localStorage.setItem('maxResults',maxResults);
}

function saveOptions(){
	var channel=$('#channelNameOptions').val();
	setChannel(channel);
	var maxResults=$('#maxResultsOptions').val();
	setMaxResults(maxResults);
	//Refresh the page is necessary
	$('body').pagecontainer('change','#main',{options});
	//Need to regenerate the list
	getPlaylist(channel);
}


function clearChannel(){
	localStorage.removeItem('channel');
	//Refresh the page is necessary
	$('body').pagecontainer('change','#main',{options});
	//Need to empty the list
	$('#vidlist').html('');
	//Reopen the pop up
	$('#popupDialog').popup('open');
}