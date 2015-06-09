var getProjectsURL = "http://localhost:80/guestAuth/app/rest/projects"

$(document).ready(getProjectList);

function getProjectList(){
	$.get(getProjectsURL, parseProjectList);
};

var parseProjectList = function(list) {
$(list.documentElement).find('project').each(getProjectAttributes);
};

var getProjectAttributes = function(project){
	if(this.id !== "_Root"){
		createListElement($(this).attr('href'), $(this).attr('name'));
	};
};

var createListElement = function(href, name){
	var listElement = $('<li>', {class: 'project'}).append($('<a>', {href: "#"}).attr('data-name', name).attr('data-href', href).text(name));
	appendListElement(listElement);
	$(listElement).click(function(){alert("hui");});
};

var appendListElement = function(element){
	$('#projects').append(element);
};
