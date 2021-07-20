import React from 'react'
import { Image } from 'react-konva';
import useImage from 'use-image'

const Figura = (props) => {
    const [image] = useImage(props.imgurls);
    const isDragged = props.id === props.draggedPieceTargetId


    //console.log("Figura ID: " + props.thisPieceTargetId)
    //console.log("Figura movida ID: " + props.draggedPieceTargetId)

    return <Image image={image}
         x = {props.x - 90}
         y = {props.y - 90}
         draggable = 'true'
         width = {isDragged ? 60 : 55}
         height = {isDragged ? 120 : 100}
         onDragStart = {props.onDragStart}
         onDragEnd = {props.onDragEnd}
         id = {props.id}
         />;
};

export default Figura
