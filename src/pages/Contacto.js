import React, { useState } from 'react';
import { Form, Formik, Field } from 'formik';
import * as Yup from 'yup';
import Card from '../components/common/Card';
import GradientButton from '../components/common/GradientButton';
import emailjs from 'emailjs-com';
//import Hyperlink from '../components/common/Hyperlink';
import Label from '../components/common/Label';
import FormInput from '../components/FormInput';
import GradientBar from './../components/common/GradientBar';
import FormError from './../components/FormError';
import FormSuccess from './../components/FormSuccess';
import logo from './../images/logo.png';
import { Redirect } from 'react-router-dom';
import ApiKey from './ApiKey'; 

//VALIDACIONES DE CAMPOS DEL FORMULARIO
const ContactoSchema = Yup.object().shape({
  //Validamos el nombre
  firstName: Yup.string().required(
    'Es obligatorio ingresar el nombre'),
  //Validamos el apellido
  lastName: Yup.string().required('Es obligatorio ingresar el apellido'),
  //Validamos el email
  email: Yup.string()
    .email('Dirección de correo inválida')
    .required('Es obligatorio ingresar el email'),
  //Validamos el mensaje para que no sea vaccío
  message: Yup.string()
    .required('El mensaje no puede ser vacio')
});

const Contacto = () => {
  const [signupSuccess, setSignupSuccess] = useState();
  const [signupError, setSignupError] = useState();
  const [redirectOnContact, setRedirectOnContact] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  
 function enviarCorreo (e) {

    setLoginLoading(true);
    emailjs.sendForm(ApiKey.SERVICE_ID, ApiKey.TEMPLATE_ID, '#contact-form', ApiKey.USER_ID)
      .then(
        result => {
          setLoginLoading(false);
          setSignupSuccess('Correo enviado correctamente');
          setSignupError('');
          setTimeout(() => {
            setRedirectOnContact(true);
          }, 1000);
        },
        error => {
          setLoginLoading(false);
          setSignupError('Ocurrio un error, intente nuevamente');
          setSignupSuccess('');
            }
    )
}
 
  return (
    <>
    {redirectOnContact && <Redirect to="/" />}
      <section className="w-full h-screen m-auto p-8 sm:pt-10">
        <GradientBar />
        <Card>
          <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
              <div>
                <div className="w-56 m-auto mb-6">
                  <img src={logo} alt="Logo" />
                </div>
                <h2 className="mb-2 text-center text-3xl leading-9 font-extrabold text-gray-900">
                  Formulario de contacto
                </h2>
                <p className="text-gray-600 text-center">
                  Envíenos un mensaje y nos pondremos en contacto{' '}
                </p>
              </div>
              <Formik
                initialValues={{
                  firstName: '',
                  lastName: '',
                  email: '',
                  mensaje: ''
                }}
                onSubmit={enviarCorreo}
                validationSchema={ContactoSchema}
              >
                {() => (
                  <Form id="contact-form" className="mt-8">
                    {signupSuccess && (
                      <FormSuccess text={signupSuccess} />
                    )}
                    {signupError && (
                      <FormError text={signupError} />
                    )}
                    <input
                      type="hidden"
                      name="remember"
                      value="true"
                    />
                    <div>
                      <div className="flex">
                        <div className="mb-2 mr-2 w-1/2">
                          <div className="mb-1">
                            <Label text="Nombre" />
                          </div>
                          <FormInput
                            ariaLabel="Nombre"
                            name="firstName"
                            type="text"
                            placeholder="Nombre"
                          />
                        </div>
                        <div className="mb-2 ml-2 w-1/2">
                          <div className="mb-1">
                            <Label text="Apellido" />
                          </div>
                          <FormInput
                            ariaLabel="Apellido"
                            name="lastName"
                            type="text"
                            placeholder="Apellido"
                          />
                        </div>
                      </div>
                      <div className="mb-2 ml-2 w-1/2">
                        <div className="mb-1">
                          <Label text="Email" />
                        </div>
                        <FormInput
                          ariaLabel="Email"
                          name="email"
                          type="email"
                          placeholder="Email"
                        />
                      </div>
                      <div>
                        <div className="mb-1">
                          <Label text="Mensaje" />
                      </div>
                        <Field
                         className="rounded p-1 w-full h-56 mb-2"
                         component="textarea"
                         name="message"
                         placeholder="Mensaje"
              />
                      </div>
                    </div>

                    <div className="mt-6">
                      <GradientButton
                        type="submit"
                        text="Enviar mensaje"
                        loading={loginLoading}
                      />
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
};

export default Contacto;
