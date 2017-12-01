import React from 'react'
import ReactDom from 'react-dom'
import Heatmap from './componentV2/Heatmap.jsx'
// import tableApp from './reducers'
// import { Provider } from 'react-redux'
// import { createStore } from 'redux'

var width = 1000,
	height = 1000,
	dataset = {},
	containerID = null,
	entriesNum = 10;



var renderModule = function(){
// let store = createStore(tableApp,{rawData:dataset,colList:dataset.reduce((acc,d)=>[...acc,...Object.keys(d)],[]).filter((d,i,self)=>self.indexOf(d)===i)})     

ReactDom.render(
	<Heatmap width={width} height={height} dataset={dataset} divID={containerID}/>,
	document.getElementById(containerID)
	)

}

renderModule.setContainer = function(data){
	if(!arguments.length) return containerID;
	containerID = data;
	return this;
}

renderModule.bindData = function(data){
	if(!arguments.length) return dataset;
	dataset = Object.assign({},data);
	return this;
}


renderModule.setHeight = function(data){
	if(!arguments.length) return height;
	height = data;
	return this;
}

renderModule.setWidth = function(data){
	if(!arguments.length) return dataset;
	width = data;
	return this;
}

renderModule.remove = function(){
	ReactDom.unmountComponentAtNode(document.getElementById(containerID));
}


module.exports = renderModule