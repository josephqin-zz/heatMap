import React from 'react'
import * as utility from '../utility'
import Dendrogram from './Dendrogram.jsx'
import Heatdata from './Heatdata.jsx'

class Heatmap extends React.Component{
   constructor(props){
      super(props)
      this.state={
         rowDendrogramData:utility.createHierarchy(this.props.dataset.rows),
         colDendrogramData:utility.createHierarchy(this.props.dataset.cols),
         zoomTransform:{x:0,y:0,xRatio:1,yRatio:1}
      }
      this.changeRowNode = this.changeRowNode.bind(this)
      this.changeColNode = this.changeColNode.bind(this)
   }

   changeRowNode(node){
         if(node.y===0 && node.parent){this.setState({rowDendrogramData:node.parent})}
         else{this.setState({rowDendrogramData:node,zoomTransform:{x:0,y:0,xRatio:1,yRatio:1}})}
         
      }
   changeColNode(node){
        if(node.y===0 && node.parent){this.setState({colDendrogramData:node.parent})}
        else{this.setState({colDendrogramData:node,zoomTransform:{x:0,y:0,xRatio:1,yRatio:1}})}
       
   }

   zoomHandler(selectedBox){
       let coordinationX = Object.values(selectedBox).map((d)=>d.x-this.props.width*0.20).sort((a,b)=>a-b);
       let coordinationY = Object.values(selectedBox).map((d)=>d.y-this.props.width*0.20).sort((a,b)=>a-b);
      
       this.setState((prestate)=>{
             
          let xRatio = this.props.width*0.65/(coordinationX.reduce((acc,d)=>d-acc,0));
          let yRatio = this.props.height*0.65/(coordinationY.reduce((acc,d)=>d-acc,0));
          
          return {zoomTransform:{x:coordinationX[0]*xRatio+prestate.zoomTransform.x*xRatio,y:coordinationY[0]*yRatio+prestate.zoomTransform.y*yRatio,xRatio:xRatio*prestate.zoomTransform.xRatio,yRatio:yRatio*prestate.zoomTransform.yRatio}}
       })
   }
   


   render(){
      const rowDendrogramData = utility.updateCluster(this.state.rowDendrogramData,this.props.height*0.65,this.props.width*0.20).each((n)=>{
          if( n.data.label >= 0 )n.data.text = this.props.dataset.rowName[+n.data.label]; 
      });
      const colDendrogramData = utility.updateCluster(this.state.colDendrogramData,this.props.width*0.65,this.props.height*0.10).each((n)=>{
          if( n.data.label >= 0 )n.data.text = this.props.dataset.colName[+n.data.label]; 
      });
      const xMap = colDendrogramData.leaves().reduce((acc,d)=>{ acc[d.data.label]=d.x;return acc},{})
      const yMap = rowDendrogramData.leaves().reduce((acc,d)=>{ acc[+d.data.label]=this.props.height*0.65-d.x;return acc},{})
      const values = this.props.dataset.values.reduce((acc,d)=>[...acc,...d],[])
      const color = utility.colorFn(values);
      
      const cellHeight = this.props.height*0.65/rowDendrogramData.leaves().length;
      const cellWidth = this.props.width*0.65/colDendrogramData.leaves().length;
      const cellsData= this.props.dataset.values.reduce((acc,d,index)=>[...acc,...d.map((t,i)=>({width:cellWidth,height:cellHeight,x:xMap[i],y:yMap[index],bgColor:color(t)}))],[])
      const colFrame = {width:cellWidth,height:this.props.height*0.65,fill:'none'}
      const rowFrame = {width:cellHeight,height:this.props.width*0.65,fill:'none'}
      const {x,y,xRatio,yRatio} = this.state.zoomTransform;
      return ( 
               <svg width={this.props.width} height={this.props.height}>
                  <defs>
                    <clipPath id={'heatDataBox'}>
                       <rect x={0} y={0} height={this.props.height*0.65} width={this.props.width*0.65}/>
                    </clipPath>
                    <clipPath id={'coldenBox'}>
                       <rect x={0} y={0} height={this.props.height} width={this.props.width*0.65}/>
                    </clipPath> 
                    <clipPath id={'rowdenBox'}>
                       <rect x={0} y={0} height={this.props.width} width={this.props.height*0.65}/>
                    </clipPath>                     
                  </defs>
                  <Heatdata data={cellsData} transform={utility.tranSlate(this.props.width*0.20,this.props.height*0.10)} clipPathURL={'url(#heatDataBox)'} zoomHandler={this.zoomHandler.bind(this)} zoomTransform={utility.tranSlate(0-x,0-y)+utility.tranScale(xRatio,yRatio)}/>
                  <Dendrogram key={0} data={colDendrogramData} transform={utility.tranSlate(this.props.width*0.20,0)} frame={colFrame} onClick={this.changeColNode} clipPathURL={'url(#coldenBox)'} zoomTransform={utility.tranSlate(0-x,0)+utility.tranScale(xRatio,1)}/>
                  <Dendrogram key={1} data={rowDendrogramData} transform={utility.tranSlate(0,this.props.height*0.75)+'rotate(-90)'} frame={rowFrame} onClick={this.changeRowNode} clipPathURL={'url(#rowdenBox)'}  zoomTransform={utility.tranSlate(0-((this.props.height*0.65*(yRatio-1))-y),0)+utility.tranScale(yRatio,1)}/>
               </svg>
              )
   }
   

}

export default Heatmap;