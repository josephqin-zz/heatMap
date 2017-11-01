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
	    const d = this.props.data.children?utility.drawBraceLine({x:this.props.data.x,y:this.props.data.y},this.props.data.children.map((t)=>({x:t.x,y:t.y}))):''
		return (
			<g>
				<path d={d} style={linksStyle} />

				{/*{ !this.props.data.children && <Cellframe frame={this.props.frame} text={this.props.data.data.text} selected={this.props.selected} />} */}
				<circle ref={ref=>this.nodeCircle=ref} cx={this.props.data.x} cy={this.props.data.y} r={2} />
        { this.props.data.hasOwnProperty('children') && this.props.data.children.map((node,index)=>(<Node key={index} onClick={()=>this.props.onClick} data={node} />)) }
			</g>
			);	
    }
	 
}




export default class Dendrogram extends React.Component{
    constructor(props){
    	super(props);
    	this.state = {selected:[]}
    };

    selectNode(node){
    	// console.log(node)
    	this.setState({selected:node.leaves()})
    }
    
    render(){
		
		    
		return (
      <g transform={this.props.transform}>
        <Node data={this.props.data} frame={this.props.frame} />
      </g>
      )

    }
    
}