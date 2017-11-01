import React from 'react'
import * as utility from '../utility'



const linksStyle = {stroke:'#000000',strokeWidth:'1px',fill:'none'}

const Node = function(props){
	const d = props.data.children?utility.drawBraceLine({x:0,y:0},props.data.children.map((t)=>({x:t.x-props.data.x,y:t.y-props.data.y}))):''
	return (
		<g transform={utility.tranSlate(props.data.x,props.data.y)} >
			<path d={d} style={linksStyle} />
			<circle r={0.5} />
		</g>
		); 
}



const Dendrogram = function(props){
    
    const nodes = props.data.descendants().map((node,index)=>(<Node key={index} data={node} />))
    
	return (<g transform={props.transform}>{ nodes }</g>)
}


export class Cell extends React.Component{
    
    // componentDidMount() {
    //     this.tCell.addEventListener('click', this.props.onClick );
       
    // }

    // componentWillUnmount(){
    //     this.tCell.removeEventListener('click', this.props.onClick );
        
    // }


    render(){
	    let attrs = {d:utility.drawRect(this.props.width,this.props.height),fill:this.props.bgColor,stroke:'none'}
	    // let textstyle = (this.props.text && this.props.text.length > 0)?{...textStyle,fontSize:fontSize(this.props.text,this.props.width)}:textStyle;
		return (
			<g ref={ ref=>this.tCell=ref } transform={utility.tranSlate(this.props.x,this.props.y)}>
			 	<path {...attrs}/>
			 	{/* <text style={textstyle}>{ this.props.text }</text> 	*/}
			</g>
		)
	}
}



const Heatdata = function(props){
    
    const cells = props.data.map((d,index)=>(<Cell key={index} {...d}></Cell>))


    return (<g transform={props.transform}>{cells}</g>)


}



const Heatmap = function(props){

   const rowDendrogramData = utility.dendrogram(props.dataset.rows,props.height*0.65,props.width*0.20);
   const colDendrogramData = utility.dendrogram(props.dataset.cols,props.width*0.65,props.height*0.20);
   const xMap = colDendrogramData.leaves().reduce((acc,d)=>{ acc[d.data.label]=d.x;return acc},{})
   const yMap = rowDendrogramData.leaves().reduce((acc,d)=>{ acc[+d.data.label]=props.height*0.65-d.x;return acc   },{})
   const heatValues = props.dataset.values.reduce((acc,t)=>[...acc,...Object.keys(xMap).map((k)=>t[k])],[])
   const color = utility.colorFn(heatValues);
   const cellHeight = props.height*0.65/rowDendrogramData.leaves().length;
   const cellWidth = props.width*0.65/colDendrogramData.leaves().length;
   const cellsData=props.dataset.values.reduce((acc,d,index)=>[...acc,...Object.keys(xMap).map((t)=>({width:cellWidth,height:cellHeight,x:xMap[t],y:yMap[index],bgColor:color(d[t])}))],[])

   return ( 
   			<svg width={props.width} height={props.height}>
   	        	<Dendrogram key={0} data={colDendrogramData} transform={utility.tranSlate(props.width*0.20,0)}/>
   	        	<Dendrogram key={1} data={rowDendrogramData} transform={utility.tranSlate(0,props.height*0.85)+'rotate(-90)'}/>
   	        	<Heatdata data={cellsData} transform={utility.tranSlate(props.width*0.20,props.height*0.20)} />
   	        </svg>
   	       )

}

export default Heatmap;