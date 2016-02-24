({
    P1UP: 81, //q
    P1DOWN: 65, //a
    P2UP: 79, //o
    P2DOWN: 76, //l
    SPEED: 2,
    VERTICALHEIGHT: 200,
    BARHEIGHT: 60,
    SPACE: 800,
    ANGLEAMOUNT: 15,
    PADDLESPEED: 1,
	startGame : function(component, event, helper) {
        var self = this;
        this.ballDirection = 'left';
        this.ballYDelta = 0;
        this.yCounter = 0;
        this.component = component;

		var svgContainer = d3.select("#pong").append("svg")
                                     .attr("width", 1000)
                                     .attr("height", 600);

        this.p1 = svgContainer.append("rect")
                             	.attr("x", 0)
                             	.attr("y", Math.floor(Math.random() * this.VERTICALHEIGHT))
                            	.attr("width", 10)
                            	.attr("height", this.BARHEIGHT);	
        
        this.p2 = svgContainer.append("rect")
                             	.attr("x", self.SPACE)
                             	.attr("y", Math.floor(Math.random() * this.VERTICALHEIGHT))
                            	.attr("width", 10)
                            	.attr("height", this.BARHEIGHT);
        
        this.ball = svgContainer.append('rect')
        						.attr('x', 100)
        						.attr('y',50)
        						.attr('width', 10)
        						.attr('height', 10);
        
        
        var movePaddles = {};
        
        movePaddles[this.P1UP] = this.moveP1Up;
        movePaddles[this.P1DOWN] = this.moveP1Down;
        movePaddles[this.P2UP] = this.moveP2Up;
        movePaddles[this.P2DOWN] = this.moveP2Down;
        
        window.onkeydown = function(e) {
            console.log(e);
            var functionToRun = movePaddles[e.which];
            
            if (functionToRun) {
                functionToRun(self)
            }
        }
         
        this.runLoop = setInterval(this.animate, 1, this);
		
	},
    moveP1Up: function(self) {
        self.p1Direction = 'up';
        //self.animateP1(self);
    },
    moveP1Down: function(self) {
        self.p1Direction = 'down';
        //self.animateP1(self);
    },
    moveP2Up: function(self) {
        self.p2Direction = 'up';
        //self.animateP2(self);
    },
    moveP2Down: function(self) {
        self.p2Direction = 'down';
        //self.animateP2(self);
    },
    animate: function(self) {
        self.animateP1(self);
        self.animateP2(self);
    	self.animateBall(self);  
    },
    animateP1: function(self) {
        var direction = self.p1Direction;
    	var p1 = self.p1;
        
        var currentPos = {
            x: parseInt(p1.attr('x')),
            y: parseInt(p1.attr('y'))
        };
        
        if (currentPos.y < 0 || currentPos.y > self.VERTICALHEIGHT) {
            self.p1Direction = direction === 'up' ? 'down' : 'up';
            direction = self.p1Direction;
        }
        
        var newPos = {
            x: currentPos.x,
            y: direction === 'up' ? currentPos.y - self.PADDLESPEED : currentPos.y + self.PADDLESPEED
        };
        
        p1.attr('x', newPos.x)
        	.attr('y', newPos.y); 
    },
    animateP2: function(self) {
        var direction = self.p2Direction;
    	var p2 = self.p2;
        
        var currentPos = {
            x: parseInt(p2.attr('x')),
            y: parseInt(p2.attr('y'))
        };
        
        if (currentPos.y < 0 || currentPos.y > self.VERTICALHEIGHT) {
            self.p2Direction = direction === 'up' ? 'down' : 'up';
            direction = self.p2Direction;
        }
        
        var newPos = {
            x: currentPos.x,
            y: direction === 'up' ? currentPos.y - self.PADDLESPEED : currentPos.y + self.PADDLESPEED
        };
        
        p2.attr('x', newPos.x)
        	.attr('y', newPos.y); 
    },
    animateBall: function(self) {
        var yCounter = ++self.yCounter;
        var component = self.component;
        var ball = self.ball;
        var ballDirection = self.ballDirection;
        var	yDirection = self.yDirection;
        var ballYDeltaInterval = self.ballYDeltaInterval;
        var p1 = self.p1;
        var p2 = self.p2;
        
        
        var p1CurrentPos = {
            x: parseInt(p1.attr('x')),
            y: parseInt(p1.attr('y'))
        };
        
        var p2CurrentPos = {
            x: parseInt(p2.attr('x')),
            y: parseInt(p2.attr('y'))
        };
        
        var ballCurrentPos = {
            x: parseInt(ball.attr('x')),
            y: parseInt(ball.attr('y'))
        };
        
        var p1Bounds = {
            x: p1CurrentPos.x + parseInt(p1.attr('width')),
            top: p1CurrentPos.y,
            bottom: p1CurrentPos.y + parseInt(p1.attr('height'))
        };
        
        var didBallHitP1 = ballCurrentPos.x === p1Bounds.x 
        					&& ballCurrentPos.y >= p1Bounds.top
        					&& ballCurrentPos.y <= p1Bounds.bottom;
        var p1Center = p1CurrentPos.y + (p1Bounds.bottom - p1Bounds.top) / 2;

        if (didBallHitP1) {
        	self.ballDirection = 'right';    
            ballDirection = self.ballDirection;
            
            var p1Center = p1CurrentPos.y + (p1Bounds.bottom - p1Bounds.top) / 2;
            var ballDistFromCenter = ballCurrentPos.y - p1Center;

            self.ballYDeltaInterval = Math.round((p1Center - Math.abs(ballDistFromCenter)) / self.ANGLEAMOUNT);
            ballYDeltaInterval = self.ballYDeltaInterval;
            self.yDirection = ballDistFromCenter > 0 ? 'down' : 'up';            
        }
        
		var p2Bounds = {
            x: p2CurrentPos.x,
            top: p2CurrentPos.y,
            bottom: p2CurrentPos.y + parseInt(p2.attr('height'))
        };
        
        var didBallHitP2 = ballCurrentPos.x === p2Bounds.x 
        					&& ballCurrentPos.y >= p2Bounds.top
        					&& ballCurrentPos.y <= p2Bounds.bottom;
        
        if (didBallHitP2) {
        	self.ballDirection = 'left'; 
            ballDirection = self.ballDirection;
            
            var p2Center = p2CurrentPos.y + (p2Bounds.bottom - p2Bounds.top) / 2;
            var ballDistFromCenter = ballCurrentPos.y - p2Center;

            self.ballYDeltaInterval = Math.round((p1Center - Math.abs(ballDistFromCenter)) / self.ANGLEAMOUNT);
            ballYDeltaInterval = self.ballYDeltaInterval;
            self.yDirection = ballDistFromCenter > 0 ? 'down' : 'up'; 
        }
        
		var outOfBounds = false;        
        if (ballCurrentPos.x < p1Bounds.x - parseInt(p1.attr('width'))) {
            outOfBounds = true;
            self.ballDirection = 'right'; 
            ballDirection = self.ballDirection;
            
            var p2score = component.get('v.p2score');
            component.set('v.p2score', p2score + 1);
            if (component.get('v.p2score') == 11) {
                component.set('v.message', 'P2 DA BEST!');
        		clearInterval(self.runLoop);
            }
            
        }
        
        if (ballCurrentPos.x > p2Bounds.x + parseInt(p2.attr('width'))) {
            outOfBounds = true;
            self.ballDirection = 'left'; 
            ballDirection = self.ballDirection;
            var p1score = component.get('v.p1score');
            component.set('v.p1score', p1score + 1);
            if (component.get('v.p1score') == 11) {
                component.set('v.message', 'P1 DA BEST!');
        		clearInterval(self.runLoop);
            }
        }
        
        
        
        var hitTop = ballCurrentPos.y < 0;
        var hitBottom = ballCurrentPos.y > self.VERTICALHEIGHT + self.BARHEIGHT;
        
        if (hitTop) {
            self.yDirection = 'down';
            yDirection = self.yDirection;
        }
        
        if (hitBottom) {
            self.yDirection = 'up';
            yDirection = self.yDirection;
        }
        
        var moveBallUp = yDirection === 'up' && (yCounter % ballYDeltaInterval === 0);
        var moveBallDown = yDirection === 'down' && (yCounter % ballYDeltaInterval === 0);
        var newPos = {
            x: outOfBounds === true ? self.SPACE / 2 : ballDirection === 'left' ? ballCurrentPos.x - self.SPEED : ballCurrentPos.x + self.SPEED,
            y: moveBallUp ? ballCurrentPos.y - 1 : moveBallDown ? ballCurrentPos.y + 1 : ballCurrentPos.y
        };
        ball.attr('x', newPos.x)
        	.attr('y', newPos.y);
    }
})