import React from 'react'
import { Image } from 'react-konva';
import useImage from 'use-image'

const Figura = (props) => {
    const [image] = useImage(props.imgurls);
    const isDragged = props.id === props.draggedPieceTargetId
    const bordered = props.id === props.borderedId
    const selected = (props.id === props.selectedId) || (props.id === props.selectedId2)


    //console.log("Figura ID: " + props.thisPieceTargetId)
    //console.log("Figura movida ID: " + props.draggedPieceTargetId)
  
    return <Image image={image}
         x = {props.x - 90}
         y = {props.y - 90}
         draggable = 'true'
         width = {isDragged ? 60 : 50}
         height = {isDragged ? 120 : 100}
         onDragStart = {props.onDragStart}
         onDragEnd = {props.onDragEnd}
         onDblClick = {props.onDblClick}
         onClick = {props.onClick}
         strokeWidth={(bordered || selected) ? 4 : 0} // border width
         stroke={bordered ? "red" : "black"} // border color
         id = {props.id}
         />;
};

export default Figura
