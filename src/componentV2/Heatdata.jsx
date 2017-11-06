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



const Heatdata = function(props){
    
    const cells = props.data.filter((d)=>d.x>=0 && d.y>=0).map((d,index)=>(<Cell key={index} {...d}></Cell>))


    return (<g transform={props.transform}>{cells}</g>)


}

export default Heatdata;