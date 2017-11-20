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
         zoomTransform:null
      }
      this.changeRowNode = this.changeRowNode.bind(this)
      this.changeColNode = this.changeColNode.bind(this)
   }

   changeRowNode(node){
         if(node.y===0 && node.parent){this.setState({rowDendrogramData:node.parent})}
         else{this.setState({rowDendrogramData:node})}
         
      }
   changeColNode(node){
        if(node.y===0 && node.parent){this.setState({colDendrogramData:node.parent})}
        else{this.setState({colDendrogramData:node})}
       
   }

   zoomHandler(selectedBox){
       let coordinationX = Object.values(selectedBox).map((d)=>d.x-this.props.width*0.20).sort((a,b)=>a-b);
       let coordinationY = Object.values(selectedBox).map((d)=>d.y-this.props.height*0.20).sort((a,b)=>a-b);
       console.log(coordinationX)
       console.log(coordinationY)
       this.setState((prestate)=>{
             
          let Ratio = Math.min(this.props.width*0.65/(coordinationX.reduce((acc,d)=>d-acc,0)),this.props.height*0.65/(coordinationY.reduce((acc,d)=>d-acc,0)));
          console.log(Ratio)
          return {zoomTransform:d3.zoomIdentity.translate(0-coordinationX[0]*Ratio,0-coordinationY[0]*Ratio).scale(Ratio).toString()}
       })
   }
   


   render(){
      const rowDendrogramData = utility.updateCluster(this.state.rowDendrogramData,this.props.height*0.65,this.props.width*0.20).each((n)=>{
          if( n.data.label >= 0 )n.data.text = this.props.dataset.rowName[+n.data.label]; 
      });
      const colDendrogramData = utility.updateCluster(this.state.colDendrogramData,this.props.width*0.65,this.props.height*0.20).each((n)=>{
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
   
      return ( 
               <svg width={this.props.width} height={this.props.height}>
                  <defs>
                    <clipPath id={'heatDataBox'}>
                       <rect x={0} y={0} height={this.props.height*0.65} width={this.props.width*0.65}/>
                    </clipPath>
                    <clipPath id={'denBox'}>
                       <rect x={0} y={0} height={this.props.height*0.20} width={this.props.width*0.65}/>
                    </clipPath>                     
                  </defs>
                  <Heatdata data={cellsData} transform={utility.tranSlate(this.props.width*0.20,this.props.height*0.20)} clipPathURL={'url(#heatDataBox)'} zoomHandler={this.zoomHandler.bind(this)} zoomTransform={this.state.zoomTransform}/>
                  <Dendrogram key={0} data={colDendrogramData} transform={utility.tranSlate(this.props.width*0.20,0)} frame={colFrame} onClick={this.changeColNode} clipPathURL={'url(#denBox)'}/>
                  <Dendrogram key={1} data={rowDendrogramData} transform={utility.tranSlate(0,this.props.height*0.85)+'rotate(-90)'} frame={rowFrame} onClick={this.changeRowNode} clipPathURL={'url(#denBox)'}/>
               </svg>
              )
   }
   

}

export default Heatmap;