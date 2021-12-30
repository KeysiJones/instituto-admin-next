import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { api } from "../utils/api";
import { useRouter } from "next/router";

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

  return (
    <div>
      <Formik
        validationSchema={LoginValidationSchema}
        validateOnBlur={false}
        initialValues={{ username: "", password: "" }}
        onSubmit={({ username, password }) => {
          api
            .post("login", { json: { username, password } })
            .json()
            .then((resposta) => {
              if (resposta.status === 200 && resposta.token) {
                localStorage.setItem("authToken", resposta.token);
                alert("Login realizado com sucesso");
                router.replace("/");
              }
            })
            .catch((error) =>
              alert("Usuário e/ou senha inválidos, tente novamente")
            );
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="flex flex-col w-screen h-screen justify-center items-center">
              <div>
                <label className="mr-2">Usuário</label>
                <Field
                  type="text"
                  name="username"
                  className="border-2 px-2 rounded-md"
                />
                <ErrorMessage
                  className="text-red-400"
                  name="username"
                  component="div"
                />
              </div>
              <div>
                <label className="mr-2">Senha</label>
                <Field
                  type="password"
                  name="password"
                  className="border-2 px-2 rounded-md"
                />
                <ErrorMessage
                  className="text-red-400"
                  name="password"
                  component="div"
                />
              </div>
              <button
                className="px-2 mt-2 rounded-md bg-green-400 text-white"
                type="submit"
              >
                Enviar
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
