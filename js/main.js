		var getBuildsURL = "";
		var getProjectsURL = "";
		var getRunningBuildsURL = "";

		var buildTypesUrl = {};

		var buildTypesUrl2 = {};

		$(document).ready(startBuildScreen);

		function startBuildScreen() {
			getProjectsInfo();
		};

		var getProjectsInfo = function(){
			getBuildtypes(processProjectInfo);
		};

		var getBuildtypes = function(varFunction){
			$.each( buildTypesUrl2, function(key, value){getRequest(value[0], varFunction, key, value[1]);});
		};

		var getRequest = function(href, funcToCall, index, sizeIndex){
			$.get(href, function(response){funcToCall(response, index, sizeIndex);});
		};

		var processProjectInfo = function(buildType){
			var projectID = $(buildType.documentElement).find('project').attr('id');
			createProjectTile(projectID);
		};

		var createProjectTile = function(projectID){
			if($('#' + projectID).length){
			}else{
			var projectTile = createTile(projectID, "projects_span span12");
			$(projectTile).append($('<h1>', {class: "fg-lightBlue"}).text(projectID));
			appendTile(projectTile, '#projects-container');
			setInterval(displayBuildTypes, 1000);
			};
		};

		var createTile = function(tileID, tileParams){
			var tile = $('<div>', {class: tileParams, id: tileID});
			return tile;
		};

		var appendTile = function(tile, element){
			$(element).append(tile);
		};

		function displayBuildTypes() {
			getBuildtypes(processBuildType);
		};

		var processBuildType = function(buildType, index, sizeIndex){
			createBuildTypeTile($(buildType.documentElement), index, sizeIndex);
			var buildTypeHref = $(buildType.documentElement).attr('href');
			getRequest(buildTypeHref + '/builds/?locator=running:true', hasRunningBuilds);
		};

		var createBuildTypeTile = function(buildType, index, sizeIndex){
			var typeId = buildType.attr('id');
			if($('#' + typeId).length){
			} else {
				var projectTileToAppend = $('#' + buildType.attr('projectId'));
				var buildTile = createTile(typeId, buildTileClassMaker(sizeIndex));
				$(buildTile).attr("data-pid", index);
				$(buildTile).prepend($('<h2>').text(buildType.attr('id')));
				$(buildTile).append($('<div>', {id: 'last_' + typeId, class: 'build_id'}));
				appendTile(buildTile, projectTileToAppend);
				$(projectTileToAppend).find(".buildType_tile").sort(function(a, b) {return $(a).data('pid') - $(b).data('pid');}).appendTo(projectTileToAppend);
			};
		};

		var parseBuilds = function(builds) {
			$(builds.documentElement).find('build').each(getAttributes);
		};

		var getAttributes = function(build)	{
			var attributes = extractAttributes(this);
			processBuildEntry(attributes);
		};

		var extractAttributes = function(build) {
			var attributesObj = new Object();
			$.each(build.attributes, function(){attributesObj[this.name] = this.nodeValue});
			return attributesObj;
		};

		var processBuildEntry = function(attributes){
			var isRunning = checkIfRunning(attributes.state);
			$('#last_' + attributes.buildTypeId).text(attributes.number);
			if(isRunning){
				processRunningBuild(attributes);
			}else{
				removeProgress(attributes.buildTypeId);
				setFinishedBuildColor(attributes);
			};
		};

		var setFinishedBuildColor = function(attributes){
			if(attributes.status == 'SUCCESS'){
				$('#' + attributes.buildTypeId).switchClass('bg-orange', 'bg-lime');
				$('#' + attributes.buildTypeId).switchClass('bg-red', 'bg-lime');
			}else{
				$('#' + attributes.buildTypeId).switchClass('bg-orange', 'bg-red');
				$('#' + attributes.buildTypeId).switchClass('bg-lime', 'bg-red');
			};
		};

		var checkIfRunning = function(state){
			if(state == "running"){
				return true;
			}else{
				return false;
			};
		};

		var processRunningBuild = function(attributes){
			getRequest(attributes.href, createProgressBar)
		};

		var hasRunningBuilds = function(builds){
			var attr = $(builds.documentElement).attr('count');
			if(typeof attr !== 'undefined' && attr !== false){
				parseBuilds(builds);
			}else{
				var tempHref = $(builds.documentElement).attr('href');
				var finalHref = tempHref.replace("running:true", "count:1" );
				getRequest(finalHref, parseBuilds);
			};
		};

		var createProgressBar = function(runningBuild){
			var percentageComplete = $(runningBuild.documentElement).find('running-info').attr('percentageComplete');
			if ($("#progress_bar_" + $(runningBuild.documentElement).attr('buildTypeId')).length){
				$("#progress_bar_" + $(runningBuild.documentElement).attr('buildTypeId')).progressbar('value', percentageComplete);
			}else{
			    var progressBarDiv = $('<div>', { class: "progress-bar large", 'data-role': 'progress-bar', id: "progress_bar_" + $(runningBuild.documentElement).attr('buildTypeId') })
				$(progressBarDiv).progressbar({
					value: 0,
					color: "bg-pink"
				});
				$('#' + $(runningBuild.documentElement).attr('buildTypeId')).append(progressBarDiv);
			};
		};

		var removeProgress = function(buildTypeId){
			$("#progress_bar_" + buildTypeId).remove();
		};

		var buildTileClassMaker = function(buildSizeIndex) {
		    var size;
		    switch(buildSizeIndex){
		        case 0:
		            size = 'tile half';
		            break;
		        case 1:
		            size = 'tile';
		            break;
		        case 2:
		            size= 'tile double double-vertical';
		            break;
		        default:
		            console.log('Error, size index ' + buildSizeIndex +' not recognized!')
		    }
		    return "buildType_tile " + size;
		};
