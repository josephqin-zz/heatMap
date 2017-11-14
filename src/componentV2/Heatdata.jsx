import React from 'react'
import * as utility from '../utility'

const linksStyle = {stroke:'#000000',strokeWidth:'1px',fill:'none'}
const textStyle = {textAnchor:'start',dominantBaseline:'middle',fill:'#000000'};

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



class Heatdata extends React.Component{

	constructor(props){
		super(props)
		this.state={startPoints:null,endPoints:null}
	}
    
    componentDidMount() {
        this.canvas.addEventListener('mousedown', this.startDraw.bind(this) );
        this.canvas.addEventListener('mousemove', this.drawing.bind(this) );
        this.canvas.addEventListener('mouseup', this.endDraw.bind(this) );
    }

    componentWillUnmount(){
        this.canvas.removeEventListener('mousedown', this.startDraw.bind(this) );
        this.canvas.removeEventListener('mousemove', this.drawing.bind(this) );
        this.canvas.removeEventListener('mouseup', this.endDraw.bind(this) );
        
    }

    startDraw(e){
    	this.setState({startPoints:{x:e.pageX,y:e.pageY}})
    	
    	e.stopPropagation()
        e.preventDefault()
    }

    drawing(e){
    	this.setState({endPoints:{x:e.pageX,y:e.pageY}})
    	e.stopPropagation()
        e.preventDefault()
    }

    endDraw(e){
    	this.setState({startPoints:null,endPoints:null})
    	e.stopPropagation()
        e.preventDefault()
    } 

    render(){
    	const cells = this.props.data.filter((d)=>d.x>=0 && d.y>=0).map((d,index)=>(<Cell key={index} {...d}></Cell>))
	    var line = null
	    if( this.state.startPoints !== null && this.state.endPoints !== null ){
	    	line = (<path d={utility.drawRectV2(this.state.startPoints,this.state.endPoints)} style={linksStyle} />)
	    }
	    return (
	    		<g>
		    	    <g ref={ (ref)=>this.canvas=ref } transform={this.props.transform}>
		    	        {cells}
		    	    </g>
	    			{line}
	    		</g>
	    		)
    }
    

}

export default Heatdata;