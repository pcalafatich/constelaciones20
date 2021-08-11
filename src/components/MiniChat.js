import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
const socket  = require('../connection/socket').socket

// const Page = styled.div`
//   display: flex;
//   height: 100vh;
//   width: 100%;
//   align-items: center;
//   background-color: #46516e;
//   flex-direction: column;
// `;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 500px;
  max-height: 500px;
  overflow: auto;
  width: 500px;
  border: 2px solid #FFA74F;
  border-radius: 10px;
  padding-bottom: 10px;
  margin-top: 12px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 70px;
  border-radius: 10px;
  margin-top: 10px;
  padding-left: 10px;
  padding-top: 10px;
  font-size: 17px;
  background-color: transparent;
  border: 2px solid #FFA74F;
  outline: none;
  color: black;
  letter-spacing: 1px;
  line-height: 20px;
  ::placeholder {
    color: black;
  }
`;

const Button = styled.button`
  background-color: #FFA74F;
  width: 100%;
  border: none;
  height: 50px;
  border-radius: 10px;
  color: #46516e;
  font-size: 17px;
`;

const Form = styled.form`
  width: 500px;
`;

const MyRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const MyMessage = styled.div`
  width: 45%;
  background-color: pink;
  color: #46516e;
  padding: 10px;
  margin-right: 5px;
  text-align: left;
  border-top-right-radius: 10%;
  border-bottom-right-radius: 10%;
`;

const PartnerRow = styled(MyRow)`
  justify-content: flex-start;
`;

const PartnerMessage = styled.div`
  width: 45%;
  background-color: aquamarine;
  color: white;
  border: 2px solid lightblue;
  padding: 10px;
  margin-left: 5px;
  text-align: center;
  border-top-left-radius: 10%;
  border-bottom-left-radius: 10%;
`;

const Chat = ({nombre}) => {
  
  //const [miNombre, setMiNombre] = useState(nombre);
  const [mensajes, setMensajes] = useState([]);
  const [mensaje, setMensaje] = useState("");

  //const socketRef = useRef();

  useEffect(() => {
    console.log('Chat: Usuario conectado');
    socket.emit("conectado", nombre);
  }, [nombre]);

  useEffect(() => {
    socket.on("mensajes", (mensaje) => {
      console.log("here");
      receivedMessage(mensaje);
    })
  }, []);

  function receivedMessage(mensaje) {
    setMensajes(prevMensajes => [...prevMensajes, mensaje]);
  }

  function enviarMensaje(e) {
    e.preventDefault();
    // const chat_mensaje = {
    //   body: mensaje,
    //   id: miNombre,
    // };
       socket.emit("mensaje", nombre, mensaje);
       setMensaje("");
  }

  function handleChange(e) {
    setMensaje(e.target.value);
  }

  return (
    <>
      <Container>
        {mensajes.map((mensaje, index) => {
          if (mensaje.nombre === nombre) {
            return (
              <MyRow key={index}>
                <MyMessage>
                {mensaje.nombre}: {mensaje.mensaje}
                </MyMessage>
              </MyRow>
            )
          }
          return (
            <PartnerRow key={index}>
              <PartnerMessage>
              {mensaje.nombre}: {mensaje.mensaje}
              </PartnerMessage>
            </PartnerRow>
          )
        })}
      </Container>
      <Form onSubmit={enviarMensaje}>
        <TextArea value={mensaje} onChange={handleChange} placeholder="Escribir algo..." />
        <Button>Enviar</Button>
      </Form>
    </>
  );
};

export default Chat;