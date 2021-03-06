// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require_tree .
//= require jquery.turbolinks
//= require jquery_ujs
//= require bootstrap/dropdown
//= require turbolinks
//= require jquery-ui
//= require nprogress
//= require nprogress-turbolinks
//= require nprogress-ajax

NProgress.configure({
  showSpinner: true,
  ease: 'ease',
  speed: 500,
  parent: 'body'
});
var steemaccount;
var gotfollowers;
var gotfollows;
var gotalldata;
var cytoscape = require('cytoscape');
var cxtmenu = require('cytoscape-cxtmenu');
$(document).on('pjax:start', function() { NProgress.start(); });
document.addEventListener('turbolinks:load', function(){
gotfollowers = false;
gotfollows = false;
gotalldata = false;
steemaccount = window.currentUser.steemaccount.toString().toLowerCase();

var cy = window.cy = cytoscape({
    container: document.getElementById('cy'),
    boxSelectionEnabled: false,
    autounselectify: false,
    autoungrabify: true,
    textureOnViewport: false,
    hideEdgesOnViewport: false,
    zoom: 100,
    pixelRatio: 1,
    layout: {
        name: 'cose'
    },
    style: [{
        selector: 'node',
            style: {
                'height': 10,
                'width': 10,
                'background-color': 'yellow',
                'label': 'data(label)',
                'color': '#FFFFFF',
                'text-transform': 'lowercase',
                'font-size': 8,
                'font-weight': 'bold',
                'font-style': 'italic',
                'font-family': '"Times New Roman", Georgia, Serif',
                'text-shadow-blur': 100,
                'shadow-blur': 10,
                'background-opacity': 0.6,
                'min-zoomed-font-size': 12
            }
        }, {
            selector: '.followers',
            style: {
                'background-color': 'yellow',
                'label': 'data(label)',
                'color': '#FFFFFF',
                'text-transform': 'lowercase',
                'font-weight': 'bold',
                'font-style': 'italic',
                'font-family': '"Times New Roman", Georgia, Serif',
                'text-shadow-blur': 100,
                'shadow-blur': 10,
                'background-opacity': 0.6
            }
        }, {
            selector: 'edge',
            style: {
                'line-color': '#FFFF',
                'width': 1,
                'opacity': 0.4
            }
           },
           {
            selector: '.mutual',
            style: {
                'background-color': 'green',
                'label': 'data(label)',
                'color': '#FFFFFF',
                'text-transform': 'lowercase',
                'font-weight': 'bold',
                'font-style': 'italic',
                'font-family': '"Times New Roman", Georgia, Serif',
                'text-shadow-blur': 100,
                'shadow-blur': 10,
                'background-opacity': 0.6
            }
           },
            {
            selector: '.follows',
            style: {
                'background-color': 'blue',
                'label': 'data(label)',
                'color': '#FFFFFF',
                'text-transform': 'lowercase',
                'font-weight': 'bold',
                'font-style': 'italic',
                'font-family': '"Times New Roman", Georgia, Serif',
                'text-shadow-blur': 100,
                'shadow-blur': 10,
                'background-opacity': 0.6
            }
            },
            {
            selector: ':selected',
            style: {
                'height': 20,
                'width': 20,
                'label': 'data(label)',
                'font-size': 8,
                'color': '#FFFFFF',
                'text-transform': 'uppercase',
                'font-weight': 'bold',
                'font-style': 'italic',
                'font-family': '"Times New Roman", Georgia, Serif',
                'text-shadow-blur': 100,
                'shadow-blur': 10,
                'background-opacity': 0.6
            }
            },
            {
            selector: '.parent',
            style: {
                'background-color': 'black',
                'height': 12,
                'width': 12,
                'label': 'data(label)',
                'font-size': 18,
                'color': '#FFFFFF',
                'text-transform': 'lowercase',
                'font-weight': 'bold',
                'font-style': 'italic',
                'font-family': '"Times New Roman", Georgia, Serif',
                'text-shadow-blur': 100,
                'shadow-blur': 10,
                'background-opacity': 0.6
            }
        }
          ],
    elements: [{
            data: {
                id: steemaccount,
                label: steemaccount,
                
                   },
            classes: 'background'
              }]
});
cxtmenu( cytoscape, cxtmenu ); // register extension
cy.cxtmenu({
	selector: 'node',
	commands: [
		{
		content: 'View On Steem',
		select: function(ele)
			{
			var selectedNode = ele.data('label');
            window.open('https://steemit.com/@'+selectedNode,'_blank');
            }
		
		}]
	});
    cy.cxtmenu({
	    selector: 'core',
	    commands: [
	        {
	            content: 'View Legend',
		select: function(ele){
			    document.getElementById('light').style.display='block';
                document.getElementById('fade').style.display='block';
		      }
        }]
    });

addFollowers();
function loadingLoop1(){
if(gotfollowers){
addFollows();
}
else{
    setTimeout(function(){ loadingLoop1(); }, 1000);
};
}
loadingLoop1();
function loadingLoop2(){
if(gotfollowers & gotfollows){
    gotalldata = true;
    //console.log("Completed getting data");
}
else{
    setTimeout(function(){ loadingLoop2(); }, 1000);
};
}
loadingLoop2();
function loadingLoop3(){
if(gotalldata) {
    gotfollowers = false;
    gotfollows = false;
    var currentNode = cy.collection('.mutual');
    currentNode.connectedEdges().addClass('mutualedge');
    cy.getElementById(steemaccount).addClass('parent');
cy.layout({name: 'cose',
            // Called on `layoutstop`
            stop: function() {$(document).on('pjax:end',function() {NProgress.done();});},
            // Number of iterations between consecutive screen positions update
            // (0 -> only updated on the end)
            refresh: 50,
            // Whether to fit the network view after when done
            fit: true,
            // Padding on fit
            padding: 0,
            // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
            boundingBox: false,
            // Randomize the initial positions of the nodes (true) or use existing positions (false)
            randomize: true,
            // Extra spacing between components in non-compound graphs
            componentSpacing: 200,
            // Node repulsion (non overlapping) multiplier
            
            // Node repulsion (overlapping) multiplier
            nodeOverlap: 500,
            // Ideal edge (non nested) length
           
            // Divisor to compute edge forces
            
            // Nesting factor (multiplier) to compute ideal edge length for nested edges
            nestingFactor: 5,
            // Gravity force (constant)
            gravity: 80,
            // Maximum number of iterations to perform
            numIter: 1000,
            // Initial temperature (maximum node displacement)
            initialTemp: 2000,
            // Cooling factor (how the temperature is reduced between consecutive iterations
            coolingFactor: 0.95,
            // Lower temperature threshold (below this point the layout will end)
            minTemp: 1.0,
            // Whether to use threading to speed up the layout
            useMultitasking: true
    });

}
else{
    setTimeout(function(){loadingLoop3();}, 2000);
}
}
loadingLoop3();
$("#closelegend").on("click",function(){
document.getElementById('light').style.display='none';
document.getElementById('fade').style.display='none';
});

});
function addFollowers(){
//console.log("adding followers");
$.getJSON('/accounts/' + steemaccount + '/followers.json', function(followerS) {
   cy.startBatch();
   for (var prop in followerS) {
       cy.add({group: "nodes", data: {id: followerS[prop], label: followerS[prop]}, position: {}});
       cy.add({group: "edges", data: {source: followerS[prop], target: steemaccount}}).addClass('followersedge');
       cy.getElementById(followerS[prop]).addClass('followers')
        };
        cy.endBatch();
        //console.log("Followers:" + followerS.length);
        gotfollowers = true;
    });
}
function addFollows(){
//console.log("adding follows");
$.getJSON('/accounts/' + steemaccount + '/follows.json', function(followS) {
          cy.startBatch();
           for (var prop in followS) {
               if (cy.getElementById(followS[prop]).length==0){
               cy.add({group: "nodes", data: {id: followS[prop], label: followS[prop]}, position: {}});
               cy.add({group: "edges", data: {source: followS[prop], target: steemaccount}}).addClass('followsedge');
               cy.getElementById(followS[prop]).addClass('follows')
               }
               else {
               cy.getElementById(followS[prop]).addClass('mutual')
               cy.getElementById(followS[prop]).removeClass('followers')}
               }
           cy.endBatch();
           //console.log("Follows:" + followS.length);
           gotfollows = true;
    });
}



