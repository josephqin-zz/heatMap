import * as d3 from 'd3';


export var tranSlate = (x,y)=>'translate('+x+','+y+')';
export var drawCircle = (radius) => 'M '+(0-radius)+' '+0+' a '+radius+' '+radius+', 0, 1, 0, '+(radius*2)+' '+0+' '+'a '+radius+' '+radius+', 0, 1, 0, '+(-radius*2)+' '+0;
export var drawRect = (width,height) => 'M'+(0-width/2)+','+(0-height/2)+' h '+width+' v '+height+' h '+(0-width)+' Z ';
export var drawLine = (sourse,target) => 'M'+sourse.x+','+sourse.y+' L '+target.x+','+target.y;


export var pagination = (oldRange,boundry,step) => (oldRange.length<boundry && oldRange[0]+step >= 0 && oldRange[oldRange.length-1]+step <= boundry)?oldRange.map((d)=>d+step):oldRange ;
export var createArray = d3.range;

//dendrogram
export var dendrogram = function(data,width,height){
	let root = d3.hierarchy(data);
    let cluster = d3.cluster().size([width,height]).separation((a,b)=>a.parent == b.parent?1:1)
    cluster(root);
    return root
}