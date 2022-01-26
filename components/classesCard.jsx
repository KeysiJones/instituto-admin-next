import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ButtonTab } from "./buttonTab";
import { Input } from "./input";

const ClassesCard = ({ urls, aulas, setRefresh }) => {
  const [value, setValue] = useState({});
  const [inserting, setInserting] = useState(false);
  const [editableRow, setEditableRow] = useState(0);
  const [edit, setEdit] = useState(false);
  const [selectedDay, setSelectedDay] = useState("terca");
  const router = useRouter();

  const handleChange = (e) => {
    setValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleInsertion = () => {
    setInserting(!inserting);
  };

  useEffect(() => {
    const cursoArray = [];
    aulas[selectedDay].forEach((curso) => {
      cursoArray[`${selectedDay}-horario-${curso.id}`] = curso.horario;
      cursoArray[`${selectedDay}-link-${curso.id}`] = curso.link;
      cursoArray[`${selectedDay}-nome-${curso.id}`] = curso.nome;
    });

    setValue(cursoArray);
  }, [aulas[selectedDay], selectedDay]);

  const saveCourse = () => {
    if (
      // eslint-disable-next-line no-restricted-globals
      confirm("Deseja salvar as alterações realizadas ?")
    ) {
      setInserting(false);
      let payload = {
        diaSemana: selectedDay,
        novaAula: {
          link: value["link-novo-curso"],
          nome: value["nome-novo-curso"],
          horario: value["horario-novo-curso"],
        },
      };

      const authToken = localStorage.getItem("authToken") || "";
      fetch(urls.adicionar, {
        headers: {
          "Content-Type": "Application/json",
          "x-access-token": authToken,
        },
        method: "POST",
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (res.status === 403 || res.status === 401) {
            alert(
              "Você precisa estar logado para cadastrar novos cursos, por favor realize o login e tente novamente."
            );
            router.replace("/login");
          }

          if (res.status === 200) {
            alert("Aula cadastrada com sucesso");
            setRefresh((prevState) => !prevState);
          }
        })
        .then((res) => {
          if (res.ok === 1) {
            alert("Aula cadastrada com sucesso");
          } else {
            alert("Erro ao cadastrar aula");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const deleteCourse = (curso) => {
    if (
      // eslint-disable-next-line no-restricted-globals
      confirm(`Tem certeza que deseja deletar o curso ${curso.nome} ?`)
    ) {
      let updatedData = {
        diaSemana: selectedDay,
        aula: { id: curso.id },
      };

      const authToken = localStorage.getItem("authToken") || "";

      fetch(urls.adicionar, {
        headers: {
          "Content-Type": "Application/json",
          "x-access-token": authToken,
        },
        method: "DELETE",
        body: JSON.stringify(updatedData),
      })
        .then((res) => {
          if (res.status === 403 || res.status === 401) {
            alert(
              "Você precisa estar logado para deletar cursos, por favor realize o login e tente novamente."
            );
            router.replace("/login");
          }

          if (res.status === 200) {
            alert("Registro deletado com sucesso");
            setRefresh((prevState) => !prevState);
          }
        })
        .then((res) => {
          if (res.ok === 1) {
            alert("Registro deletado com sucesso");
          } else {
            alert("Erro ao atualizar registro");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const editCourse = (e, selectedDay, id) => {
    setEdit(!edit);
    setEditableRow(`${selectedDay}-${id}`);
    if (e.target.innerText === "Salvar") {
      if (
        // eslint-disable-next-line no-restricted-globals
        confirm("Deseja salvar as alterações realizadas ?")
      ) {
        let novasAulas = {
          id: id,
          link: value[`${selectedDay}-link-${id}`],
          nome: value[`${selectedDay}-nome-${id}`],
          horario: value[`${selectedDay}-horario-${id}`],
        };

        let updatedData = {
          diaSemana: selectedDay,
          novasAulas: novasAulas,
        };

        const authToken = localStorage.getItem("authToken") || "";

        fetch(urls.aulas, {
          headers: {
            "Content-Type": "Application/json",
            "x-access-token": authToken,
          },
          method: "PUT",
          body: JSON.stringify(updatedData),
        })
          .then((res) => {
            if (res.status === 403 || res.status === 401) {
              alert(
                "Você precisa estar logado para editar registros, por favor realize o login e tente novamente."
              );
              router.replace("/login");
            }

            if (res.status === 200) {
              alert("Registro atualizado com sucesso");
            }
          })
          .then((res) => {
            if (res.ok === 1) {
              alert("Registro atualizado com sucesso");
            } else {
              alert("Erro ao atualizar registro");
            }
          })
          .catch((err) => console.log(err));
      } else {
        setRefresh((prevState) => !prevState);
      }
    }
  };

  return (
    <div id={selectedDay}>
      <div>
        <ButtonTab
          day="terca"
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
        <ButtonTab
          day="quarta"
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
        <ButtonTab
          day="quinta"
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
        <ButtonTab
          day="sabado"
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
      </div>
      <br />
      <button
        onClick={handleInsertion}
        className="bg-crimson hover:bg-red-400 py-1 px-2 text-white rounded-t-md outline-none font-bold"
      >
        Cadastrar novo curso
      </button>
      <div
        className="-t-8 border-blue-600 mx-12 mb-12 rounded-md"
        style={{ textAlignLast: "center" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "crimson" }}>
              <th className="rounded-tl-md">Curso</th>
              <th>Horário</th>
              <th>Link</th>
              <th className="rounded-tr-md">Ações</th>
            </tr>
          </thead>
          <tbody>
            {inserting ? (
              <tr className="bg-blue-100">
                <td className="p-1">
                  <Input
                    name="nome-novo-curso"
                    placeholder="Ex: Doutrina e Convênios"
                    type="text"
                    onChange={handleChange}
                    className="text-black rounded-md p-1 outline-none"
                  />
                </td>
                <td className="p-1">
                  <Input
                    name="horario-novo-curso"
                    placeholder="Ex: 09h30"
                    type="text"
                    onChange={handleChange}
                    className="text-black rounded-md p-1 w-32 outline-none"
                  />
                </td>
                <td className="p-1">
                  <Input
                    name="link-novo-curso"
                    placeholder="Ex: https://zoom.us/j/95927244033?"
                    type="text"
                    onChange={handleChange}
                    className="text-black rounded-md p-1 w-full outline-none"
                  />
                </td>
                <td className="p-1">
                  <td>
                    <button
                      onClick={saveCourse}
                      className="py-1 px-2 bg-green-500 rounded-md m-2 font-bold"
                    >
                      Salvar
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => setInserting(false)}
                      className="p-1 px-2 bg-crimson rounded-md m-2 font-bold"
                    >
                      Cancelar
                    </button>
                  </td>
                </td>
              </tr>
            ) : null}
            {aulas[selectedDay].map((curso) => {
              const isInEditMode =
                editableRow === `${selectedDay}-${curso.id}` && edit;

              return (
                <tr
                  key={curso.id}
                  className={`${isInEditMode ? "bg-blue-100" : "bg-white"}`}
                >
                  <td id={`${selectedDay}-${curso.id}`} className="p-1">
                    {isInEditMode ? (
                      <Input
                        placeholder="digite o novo nome do curso"
                        name={`${selectedDay}-nome-${curso.id}`}
                        type="text"
                        onChange={handleChange}
                        value={value[`${selectedDay}-nome-${curso.id}`]}
                        className="text-black rounded-md p-1 outline-none"
                      />
                    ) : (
                      <p className="text-black px-2">
                        {value[`${selectedDay}-nome-${curso.id}`] ?? curso.nome}
                      </p>
                    )}
                  </td>
                  <td id={`horario-${selectedDay}-${curso.id}`} className="p-1">
                    {isInEditMode ? (
                      <Input
                        id={`input-${selectedDay}-${curso.id}`}
                        placeholder="digite o novo horário do curso"
                        name={`${selectedDay}-horario-${curso.id}`}
                        type="text"
                        onChange={handleChange}
                        value={
                          value[`${selectedDay}-horario-${curso.id}`] ?? ""
                        }
                        className="text-black rounded-md p-1 w-32 outline-none"
                      />
                    ) : (
                      <p className="text-black px-2">
                        {value[`${selectedDay}-horario-${curso.id}`] ??
                          curso.horario}
                      </p>
                    )}
                  </td>
                  <td id={`link-${selectedDay}-${curso.id}`} className="p-1">
                    {isInEditMode ? (
                      <Input
                        placeholder="novo link"
                        name={`${selectedDay}-link-${curso.id}`}
                        type="text"
                        onChange={handleChange}
                        value={value[`${selectedDay}-link-${curso.id}`] ?? ""}
                        className="text-black rounded-md p-1 w-full outline-none"
                      />
                    ) : (
                      <a
                        className="underline text-black px-2"
                        href={
                          value[`${selectedDay}-link-${curso.id}`] ?? curso.link
                        }
                      >
                        Assistir aula
                      </a>
                    )}
                  </td>
                  <td className="p-1">
                    <td>
                      <button
                        onClick={(e) => editCourse(e, selectedDay, curso.id)}
                        className={`py-1 px-2 ${
                          isInEditMode ? "bg-green-500" : "bg-dodger"
                        } rounded-md m-2 font-bold`}
                      >
                        {isInEditMode ? "Salvar" : "Editar"}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => deleteCourse(curso)}
                        className="py-1 px-2 bg-crimson rounded-md m-2 font-bold"
                      >
                        Deletar
                      </button>
                    </td>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { ClassesCard };
