/*!
 * Start Bootstrap - Agnecy Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {

	$('a[href*=#]:not([href=#])').click(function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				$('html,body').animate({
					scrollTop: target.offset().top
				}, 1000);
				return false;
			}
		}
	});

});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
	target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
	$('.navbar-toggle:visible').click();
});

var app = angular.module('mainApp', [])
.controller('mainCtrl', function($scope, $rootScope){

	$scope.usuarios=[];

	var c = ["success", "error", "info", "warning"];

	$scope.m = {};
	$scope.m.color= c[Math.floor(Math.random() * 4)];
	$scope.m.type = "forgein";
	$scope.logged = false;

	var socket = io.connect();

	socket.on('newMsg', function(data){
		$scope.msgs.push(data);
		$rootScope.$apply();
		$(".panel-body").animate({ scrollTop: $(".media-list").height() }, "slow");
		return false;
	});

	socket.on('userInUse', function(){
		console.log('no Entro')
		$('#modalError').modal('show');
	});

	socket.on('refreshChat', function(m){
		var msj = {};
		msj.texto = m;
		msj.nickname = "SYSTEM";
		var d = new Date();
		msj.time  = d.toLocaleString();
		$scope.msgs.push(msj);
		$scope.logged = true;
		$rootScope.$apply();
	});	

	socket.on('updateSidebarUsers', function(data){
		$scope.usuarios = data;
		$rootScope.$apply();
		console.log(data);
	});

	$scope.msgs = [];

	$scope.send= function(m){
		var tmp = {};

		angular.copy(m, tmp)
		var d = new Date();
		var n = d.toLocaleString();
		tmp.time = n;
		m.time = n;
		$scope.msgs.push(tmp);

		var elem = $('data');
		elem.scrollTop = elem.scrollHeight;
		tmp.type = "local";
		socket.emit('msg', m);
		$(".panel-body").animate({ scrollTop: $(".media-list").height() }, "fast");
		return false;
	}

	$scope.login = function (n){
		socket.emit('loginUser', n);
	}



});