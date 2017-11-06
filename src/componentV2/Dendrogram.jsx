import React from 'react'
import * as utility from '../utility'
//flaten D3.hierary strucutre to rend dendrogram

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
        this.nodeCircle.addEventListener('mouseover', ()=>this.props.onMouseover(this.props.data) );
        this.nodeCircle.addEventListener('click', ()=>this.props.onClick(this.props.data) );
       
    }

    componentWillUnmount(){
        this.nodeCircle.removeEventListener('mouseover', ()=>this.props.onMouseover(this.props.data) );
        this.nodeCircle.addEventListener('click', ()=>this.props.onClick(this.props.data) );
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


export default class Dendrogram extends React.Component{
    constructor(props){
    	super(props);
    	this.state = {selected:[]}
      this.selectNode = this.selectNode.bind(this)
    };

    selectNode(node){
    	// console.log(node)
    	this.setState({selected:node.leaves()})
    }
    
    render(){
		
		const nodes = this.props.data.descendants().map((node,index)=>(<Node key={index} onMouseover={this.selectNode} onClick={this.props.onClick} data={node} frame={this.props.frame} selected={this.state.selected.includes(node)?true:false}/>))
    
		return (<g transform={this.props.transform}>{ nodes }</g>)

    }
    
}