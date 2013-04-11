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
    //self.connectionsMatrix = [];
   // jsPlumb.Defaults.Container = 'nodesearch_canvas';
    

    
    self.graphTypes = [{
            graphType: "Directed"
        }, {
            graphType: "Undirected"
        }, {
            graphType: "Weighted"
        }];
   
    //SETUP
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
    self.baseConnectionObject = function(src, trgt) {
        return {
            source: src,
            target: trgt,
            connector: "StateMachine",
            paintStyle: {
                lineWidth: 3,
                strokeStyle: "#fff",
                               
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
            self.graph()[e0.attr("id")].adj().push({id:e1.attr("id")});
        }

        if ($('#graphTypeId option:selected').text() == "Undirected") {
            var c = $.extend({
                endpoint: "Dot",
            }, self.baseConnectionObject(e0, e1));

            jsPlumb.connect(c);
            self.graph()[e0.attr("id")].adj().push({id:e1.attr("id")});
            self.graph()[e1.attr("id")].adj().push({id:e0.attr("id")});
        }
        if ($('#graphTypeId option:selected').text() == "Weighted") {
            var weight = prompt("Enter a weight for this connection");
            var obj = {
       
                endpoint: "Dot",
                overlays: [
                    
                    ["Label", {
                        label: "",
                        id: "label",
                        cssClass: "weightLabels"
                    }]
                ]
            };
            var c = $.extend(obj, self.baseConnectionObject(e0, e1));
            var d = $.extend(obj, self.baseConnectionObject(e1, e0));
            

            var connection = jsPlumb.connect(c);
               connection.getOverlay("label").setLabel("" + weight);
            var connection2 = jsPlumb.connect(d);
            
            
              

            self.graph()[e0.attr("id")].adj().push({
                id: e1.attr("id"),
                weight: weight,
                gui: connection
            });
            console.log(self.graph()[e0.attr("id")].adj())
            self.graph()[e1.attr("id")].adj().push({
                id: e0.attr("id"),
                weight: weight,
                gui:connection2

            });
            console.log(self.graph()[e1.attr("id")].adj())
 
        }
    };

    //ALGORITHMS
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
                    stack.push(adjList[i].id);
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
                console.log(adjList);
                for (i = 0; i < adjList.length; i++) {
                    queue.unshift(adjList[i].id);
                    console.log("QUEUE: ", queue);
                }
            }
        }
    };

    self.kruskal = function () {
        E = [];
        p = [] //parentArray

        for (var i = 0;i < self.graph().length; i++) {
                  p[i] = null;
        }

        var find = function (  element ){
            while ( p[element] != null) { 
                console.log("element = p[element]:", element, " = ", p[element]);
                element = p[element];
               
                
            }
            return element
        }

        var union = function (setA, setB) {
           var setB = parseInt(setB)
            console.log("Union of ", setA, " and ", setB);
            var rootA = find(setA);
            console.log("rootA: ", rootA );

            var rootB = find(setB);
            console.log("rootB: ", rootB);
            if ( rootA == rootB ){
                return
            }
            else {
                p[rootA] = rootB;
                console.log("Coloring: ", setA, setB);
                
                jsPlumb.select({ source: "" + setA, target: "" + setB }).setPaintStyle({ strokeStyle: "black", lineWidth: 15});
               jsPlumb.select({ source: "" + setB, target: "" + setA }).setPaintStyle({ strokeStyle: "black", lineWidth: 15});
               // if (p[setA] != null) self.graph()[setB].adj()[p[setA]].gui.getOverlay("label").setLabel("XXXXXX");
            }
        

        }// end func

        for (var i = 0; i < self.graph().length; i++) {
            for(j = 0; j < self.graph()[i].adj().length; j++){
                
                E.push({from:i,to:self.graph()[i].adj()[j].id,w:self.graph()[i].adj()[j].weight});
            }
            
        }
        // sort E;
        E.sort(function (a, b) {
            return a.w - b.w
        });
        E.reverse();

        var num = 0;
        while (E.length > 0) {
            var currentEdge = E.pop();
            console.log(currentEdge);
            union(currentEdge.from,currentEdge.to);
            console.log("P during", num++,"th Iteration of while: ",p);
           
        }
        console.log("P after while:", p);
        for (var i = 0; i < p.length; i++) {
            var blue = {
                paintStyle: {
                    lineWidth: 30,
                    strokeStyle: "#056"
                }
            };
            
          

       
        }
 
    }

    //TEAR DOWN
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
