$( document ).ready(function(){ 
$(document).bind("contextmenu", function(e) {
    e.preventDefault();
    e.stopPropagation();
});



function Node(id, adj) {
    var self = this;
    self.id = id;
    self.adj = ko.observableArray(adj);
}

function GraphViewModel() {
    var self = this;
    self.from = null;
    self.to = null;
    self.nodeNum = 0;
    self.name = name;
    self.marked = [];
    self.graph = ko.observableArray();
    self.$canvas = $('#nodesearch_canvas');
    

    
    
    
    self.graphTypes = [{
            graphType: "Directed"
        }, {
            graphType: "Undirected"
        }, {
            graphType: "Weighted"
        }];

    self.bindNodeEvents = function(n, index, data) {
        var $n = $(n);
        var mousedownHandle = function(e, ui) {
            if (e.which == 3) {
                self.from = $(this);
            }
        };
        var mouseupHandle = function(e, ui) {
            if (e.which == 3) {
                console.log(e, ui, "mouse up!!");
                self.to = $(this);
                self.addConnection(self.from, self.to);
            }
        };

        var dropFunction = function(e, ui) {
            if (ui.draggable.attr("id") == "bfs") {
                self.bfs($(this).attr('id'));
            } else if (ui.draggable.attr("id") == "dfs") {
                self.dfs($(this).attr('id'));
            }
        };
        var drop = {
            accept: ".token",
            activeClass: 'ui-state-active',
            hoverClass: 'ui-state-hover',
            drop: dropFunction
        };
        
        var drag = {
            stack: ".circle"
        }
        //bind
        jsPlumb.draggable($n);
        $n
            .on('mousedown', mousedownHandle)
            .on('mouseup', mouseupHandle);
        $('.circle').droppable(drop);
        $(".token").draggable(drag);
    };
    self.addNode = function() {
        self.graph.push(new Node(self.nodeNum++, []));
    };
    self.baseConnectionObject = function(e0, e1) {
        return {
            source: e0,
            target: e1,
            connector: "StateMachine",
            paintStyle: {
                lineWidth: 3,
                strokeStyle: "#056"
            },
            anchor: "AutoDefault",
        };
    };
    self.addConnection = function(e0, e1) {
        if ($('#graphTypeId option:selected').text() == "Directed") {
            var obj = {
                endpoint: "Blank",
                overlays: [
                    ["PlainArrow", {
                        location: 1,
                        width: 20,
                        length: 12
                    }]
                ]
            };
            jsPlumb.connect($.extend(obj, self.baseConnectionObject(e0, e1)));
            self.graph()[e0.attr("id")].adj().push(e1.attr("id"));
        }

        if ($('#graphTypeId option:selected').text() == "Undirected") {
            var c = $.extend({
                endpoint: "Dot",
            }, self.baseConnectionObject(e0, e1));

            jsPlumb.connect(c);
            self.graph()[e0.attr("id")].adj().push(e1.attr("id"));
            self.graph()[e1.attr("id")].adj().push(e0.attr("id"));
        }
        if ($('#graphTypeId option:selected').text() == "Weighted") {
            var weight = prompt("Enter a weight for this connection");
            var obj = {
                endpoint: "Blank",
                overlays: [
                    ["PlainArrow", {
                        location: 1,
                        width: 20,
                        length: 12
                    }],
                    ["Label", {
                        label: "",
                        id: "label"
                    }]
                ]
            };
            var c = $.extend(obj, self.baseConnectionObject(e0, e1));
            c.getOverlay("label").setLabel("" + weight);
            jsPlumb.connect(c);
            self.graph()[e0.attr("id")].adj().push({
                id: e1.attr("id"),
                weight: weight
            });
 
        }
    };

    self.dfs = function(start, options) {
        numMarked = 0;
        stack = [];
        rootNode = start;
        stack.push(rootNode);
        while (stack && stack.length > 0) {
            currentNode = stack.pop();
            if (!self.marked[currentNode]) {
                self.marked[currentNode] = true;
                numMarked++;
                $('#' + currentNode).delay(numMarked * 500).animate({
                    opacity: 0.25
                }, 1000);
                adjList = self.graph()[currentNode].adj();
                for (i = 0; i < adjList.length; i++) {
                    stack.push(adjList[i]);
                    console.log("STACK: ", stack);
                }
            }
        }
    };

    self.bfs = function(start, options) {
        numMarked = 0;
        queue = [];
        rootNode = start;
        queue.unshift(rootNode);
        while (queue && queue.length > 0) {
            currentNode = queue.pop();
            if (!self.marked[currentNode]) {
                self.marked[currentNode] = true;
                numMarked++;
                $('#' + currentNode).delay(numMarked * 500).animate({
                    opacity: 0.50
                }, 1000);
                adjList = self.graph()[currentNode].adj();
                for (i = 0; i < adjList.length; i++) {
                    queue.unshift(adjList[i]);
                    console.log("QUEUE: ", queue);
                }
            }
        }
    };

    self.clearConnections = function() {
        jsPlumb.select().detach();
        self.marked = [];
        for (var i = 0; i < self.graph().length; i++) {
            self.graph()[i].adj.removeAll();
        }
        $('.circle').css("opacity", "1");
    };
    self.reset = function() {
        self.clearConnections();
        self.graph([]);
        self.nodeNum = 0;
    };
    self.unmark = function() {
        self.marked = [];
        $('.circle').css("opacity", "1");
    };
}



ko.applyBindings(new GraphViewModel());
});
