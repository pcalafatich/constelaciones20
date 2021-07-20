import React, { useContext, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Card from '../components/common/Card';
import GradientButton from '../components/common/GradientButton';
import Hyperlink from '../components/common/Hyperlink';
import Label from '../components/common/Label';
import FormInput from '../components/FormInput';
import { AuthContext } from '../context/AuthContext';
import GradientBar from './../components/common/GradientBar';
import FormError from './../components/FormError';
import FormSuccess from './../components/FormSuccess';
import { publicFetch } from './../util/fetch';
import logo from './../images/logo.png';
import { Redirect } from 'react-router-dom';

const SignupSchema = Yup.object().shape({
  //Validamos el nombre
  firstName: Yup.string().required(
    'Es obligatorio ingresar el nombre'
  ),
  //Validamos el apellido
  lastName: Yup.string().required('Es obligatorio ingresar el apellido'),
  //Validamos el email
  email: Yup.string()
    .email('Dirección de correo inválida')
    .required('Es obligatorio ingresar el email'),
  password: Yup.string().required('La contraseña es obligatoria')
});

const Signup = () => {
  const authContext = useContext(AuthContext);
  const [signupSuccess, setSignupSuccess] = useState();
  const [signupError, setSignupError] = useState();
  const [redirectOnLogin, setRedirectOnLogin] = useState(
    false
  );
  const [loginLoading, setLoginLoading] = useState(false);

  const submitCredentials = async credentials => {
    try {
      setLoginLoading(true);
      const { data } = await publicFetch.post(
        `signup`,
        credentials
      );

      authContext.setAuthState(data);
      setSignupSuccess(data.message);
      setSignupError('');

      setTimeout(() => {
        setRedirectOnLogin(true);
      }, 700);
    } catch (error) {
      setLoginLoading(false);
      const { data } = error.response;
      setSignupError(data.message);
      setSignupSuccess('');
    }
  };

  return (
    <>
      {redirectOnLogin && <Redirect to="/dashboard" />}
      <section className="w-1/2 h-screen m-auto p-8 sm:pt-10">
        <GradientBar />
        <Card>
          <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
              <div>
                <div className="w-56 m-auto mb-6">
                  <img src={logo} alt="Logo" />
                </div>
                <h2 className="mb-2 text-center text-3xl leading-9 font-extrabold text-gray-900">
                  Formulario de Registro
                </h2>
                <p className="text-gray-600 text-center">
                  Ya posee una cuenta?{' '}
                  <Hyperlink to="login" text="Ingrese ahora" />
                </p>
              </div>
              <Formik
                initialValues={{
                  firstName: '',
                  lastName: '',
                  email: '',
                  password: ''
                }}
                onSubmit={values =>
                  submitCredentials(values)
                }
                validationSchema={SignupSchema}
              >
                {() => (
                  <Form className="mt-8">
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
                      <div className="mb-2">
                        <div className="mb-1">
                          <Label text="Email address" />
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
                          <Label text="Password" />
                        </div>
                        <FormInput
                          ariaLabel="Contraseña"
                          name="password"
                          type="password"
                          placeholder="Contraseña"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <GradientButton
                        type="submit"
                        text="Guardar"
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

export default Signup;
