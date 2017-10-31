import React from 'react'
import * as utility from '../utility'

const Node = function(props){
	const d = props.data.parent ? utility.drawLine({x:d.y,y:d.x},{x:d.parent.y,y:d.x}):'' + (props.data.children && d.children && d.children.length > 1 )? utility.drawLine({x:d.y,y:d.children[0].x},{x:d.y,y:d.children[1].x})
	return (
		<g>
			<path d={d}/>
		</g>
		); 
}



const Dendrogram = function(props){
    
    const nodes = data.descendants().slice(1).map((node,index)=>(<Node data={d} />)
    
	return (<g>{ nodes }</g>)
}



const Heatmap = function(props){
   const dendrogramData = utility.dendrogram(props.rows,props.)
   return ( 
   			<svg width={props.width} height={props.hight}>
   	        	<Dendrogram data={dendrogramData}/>
   	        <svg/>
   	       );

}