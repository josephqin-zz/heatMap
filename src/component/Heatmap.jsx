import React from 'react'
import * as utility from '../utility'



const linksStyle = {stroke:'#000000',strokeWidth:'1px',fill:'none'}
const textStyle = {textAnchor:'start',dominantBaseline:'middle',fill:'#000000'};

const Cellframe = function(props){

	  const fontSize = Math.min(Math.floor(props.frame.width)*1,16)
	  const stroke = props.selected?'#fff6b2':'none';
      return (
      	<g>
      		<rect transform = {utility.tranSlate(0-props.frame.width/2,0)} {...{...props.frame,stroke}}  />
      		<text transform = {utility.tranSlate(0,props.frame.height)+'rotate(90)'} style={{...textStyle,fontSize}}>{props.text}</text>
      	</g>
      	);


} 


class Node extends React.Component{
    

     componentDidMount() {
        this.nodeCircle.addEventListener('click', this.props.onClick );
       
    }

    componentWillUnmount(){
        this.nodeCircle.removeEventListener('click', this.props.onClick );
        
    }

    render(){
	    const d = this.props.data.children?utility.drawBraceLine({x:0,y:0},this.props.data.children.map((t)=>({x:t.x-this.props.data.x,y:t.y-this.props.data.y}))):''
		return (
			<g transform={utility.tranSlate(this.props.data.x,this.props.data.y)} >
				<path d={d} style={linksStyle} />
				{ !this.props.data.children && <Cellframe frame={this.props.frame} text={this.props.data.data.text} selected={this.props.selected} />}
				<circle ref={ref=>this.nodeCircle=ref} r={2} />
			</g>
			);	
    }
	 
}



class Dendrogram extends React.Component{
    constructor(props){
    	super(props);
    	this.state = {selected:[]}
    };

    selectNode(node){
    	// console.log(node)
    	this.setState({selected:node.leaves()})
    }
    
    render(){
		
		const nodes = this.props.data.descendants().map((node,index)=>(<Node key={index} onClick={()=>this.selectNode(node)} data={node} frame={this.props.frame} selected={this.state.selected.includes(node)?true:false}/>))
    
		return (<g transform={this.props.transform}>{ nodes }</g>)

    }
    
}


class Cell extends React.Component{
    
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

   const rowDendrogramData = utility.dendrogram(props.dataset.rows,props.height*0.65,props.width*0.20).each(function(n){
   		 if( n.data.label )n.data.text = props.dataset.values[+n.data.label].compound; 
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