import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { api } from "../utils/api";
import { useRouter } from "next/router";
import { useState } from "react";
import { Loader } from "../components/loader";

const LoginValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, "O usuário deve ter no mínimo 4 caracteres!")
    .max(10, "O usuário deve ter no máximo 10 caracteres!")
    .required("Informe o seu usuário"),
  password: Yup.string()
    .min(5, "A senha deve ter no mínimo 5 caracteres!")
    .max(10, "A senha não deve ter mais de 10 caracteres!")
    .required("Informe a sua senha"),
});

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <Formik
          validationSchema={LoginValidationSchema}
          validateOnBlur={false}
          initialValues={{ username: "", password: "" }}
          onSubmit={({ username, password }) => {
            setLoading(true);
            api
              .post("login", { json: { username, password } })
              .json()
              .then((resposta) => {
                setLoading(false);
                if (resposta.status === 200 && resposta.token) {
                  localStorage.setItem("authToken", resposta.token);
                  alert("Login realizado com sucesso");
                  router.replace("/");
                }
              })
              .catch((error) => {
                setLoading(false);
                alert("Usuário e/ou senha inválidos, tente novamente");
              });
          }}
        >
          {({ isSubmitting }) => (
            <div className="flex flex-col h-screen justify-center items-center">
              <Form>
                <div>
                  <Field
                    type="text"
                    name="username"
                    placeholder="Usuário"
                    className="border-2 px-2 py-2 rounded-md my-2 outline-none"
                  />
                  <ErrorMessage
                    className="text-red-400"
                    name="username"
                    component="div"
                  />
                </div>
                <div>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Senha"
                    className="border-2 px-2 py-2 rounded-md outline-none"
                  />
                  <ErrorMessage
                    className="text-red-400"
                    name="password"
                    component="div"
                  />
                </div>
                <button
                  className="py-2 last:mt-2 w-full rounded-md bg-blue-400 text-white"
                  type="submit"
                >
                  Login
                </button>
              </Form>
            </div>
          )}
        </Formik>
      )}
    </div>
  );
}
