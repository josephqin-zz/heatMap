import React from 'react'
import * as utility from '../utility'
import Dendrogram from './Dendrogram.jsx'
// import Dendrogram from './DendrogramV2.jsx'
import Heatdata from './Heatdata.jsx'

const Heatmap = function(props){

   const rowDendrogramData = utility.dendrogram(props.dataset.rows,props.height*0.65,props.width*0.20).each(function(n){
   		 if( n.data.label )n.data.text = n.data.label; 
   });
   const colDendrogramData = utility.dendrogram(props.dataset.cols,props.width*0.65,props.height*0.20).each(function(n){
   		 if( n.data.label )n.data.text = n.data.label; 
   });
   const xMap = colDendrogramData.leaves().reduce((acc,d)=>{ acc[d.data.label]=d.x;return acc},{})
   const yMap = rowDendrogramData.leaves().reduce((acc,d)=>{ acc[+d.data.label]=props.height*0.65-d.x;return acc   },{})
   const heatValues = props.dataset.values.reduce((acc,t)=>[...acc,...Object.keys(xMap).map((k)=>t[k])],[])
   const color = utility.colorFn(heatValues);
   const cellHeight = props.height*0.65/rowDendrogramData.leaves().length;
   const cellWidth = props.width*0.65/colDendrogramData.leaves().length;
   const cellsData=props.dataset.values.reduce((acc,d,index)=>[...acc,...Object.keys(xMap).map((t)=>({width:cellWidth,height:cellHeight,x:xMap[t],y:yMap[index],bgColor:color(d[t])}))],[])
   const colFrame = {width:cellWidth,height:props.height*0.65,fill:'none'}
   const rowFrame = {width:cellHeight,height:props.width*0.65,fill:'none'}
   
   return ( 
   			<svg width={props.width} height={props.height}>
   				<Heatdata data={cellsData} transform={utility.tranSlate(props.width*0.20,props.height*0.20)} />
   	        	<Dendrogram key={0} data={colDendrogramData} transform={utility.tranSlate(props.width*0.20,0)} frame={colFrame} />
   	        	<Dendrogram key={1} data={rowDendrogramData} transform={utility.tranSlate(0,props.height*0.85)+'rotate(-90)'} frame={rowFrame} />
   	        </svg>
   	       )

}

export default Heatmap;