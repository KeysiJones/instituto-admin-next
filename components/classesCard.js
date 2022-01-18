import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const ClassesCard = ({ urls, aulas, diaSemana, setRefresh }) => {
  const [value, setValue] = useState({});
  const [inserting, setInserting] = useState(false);
  const [editableRow, setEditableRow] = useState(0);
  const [edit, setEdit] = useState(false);
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
    aulas.forEach((curso) => {
      cursoArray[`${diaSemana}-horario-${curso.id}`] = curso.horario;
      cursoArray[`${diaSemana}-link-${curso.id}`] = curso.link;
      cursoArray[`${diaSemana}-nome-${curso.id}`] = curso.nome;
    });

    setValue(cursoArray);
  }, [aulas, diaSemana]);
  const dia = {
    terca: "Terça",
    quarta: "Quarta",
    quinta: "Quinta",
    sabado: "Sábado",
  };

  return (
    <div id={diaSemana}>
      <p className="my-12 text-4xl text-blue-400">{dia[diaSemana]}</p>
      <button
        onClick={() => handleInsertion()}
        className="bg-blue-500 p-1 text-white rounded-t-xl outline-none font-bold"
      >
        Cadastrar nova aula de {dia[diaSemana]}
      </button>
      <div
        border
        className="-t-8 border-blue-500 mx-12 mb-12 rounded-lg"
        style={{ textAlignLast: "center" }}
      >
        <table className="w-full">
          <thead>
            <tr className="bg-blue-500" style={{ backgroundColor: "#3B82F6" }}>
              <th>Curso</th>
              <th>Horário</th>
              <th>Link</th>
              <th>Ações</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {inserting ? (
              <tr>
                <td className="p-1">
                  <input
                    autocomplete="off"
                    name="nome-novo-curso"
                    placeholder="Ex: Doutrina e Convênios"
                    type="text"
                    onChange={handleChange}
                    className="text-black rounded-md p-1 outline-none"
                  />
                </td>
                <td className="p-1">
                  <input
                    autocomplete="off"
                    name="horario-novo-curso"
                    placeholder="Ex: 09h30"
                    type="text"
                    onChange={handleChange}
                    className="text-black rounded-md p-1 w-32 outline-none"
                  />
                </td>
                <td className="p-1">
                  <input
                    autocomplete="off"
                    name="link-novo-curso"
                    placeholder="Ex: https://zoom.us/j/95927244033?"
                    type="text"
                    onChange={handleChange}
                    className="text-black rounded-md p-1 w-full outline-none"
                  />
                </td>
                <td className="p-1">
                  <button
                    onClick={() => {
                      if (
                        // eslint-disable-next-line no-restricted-globals
                        confirm("Deseja salvar as alterações realizadas ?")
                      ) {
                        setInserting(false);
                        let payload = {
                          diaSemana: diaSemana,
                          novaAula: {
                            link: value["link-novo-curso"],
                            nome: value["nome-novo-curso"],
                            horario: value["horario-novo-curso"],
                          },
                        };

                        const authToken =
                          localStorage.getItem("authToken") || "";
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
                    }}
                    className="p-1 bg-blue-500 rounded-2xl m-2 font-bold"
                  >
                    Salvar
                  </button>
                </td>
                <td className="p-1">
                  <button
                    onClick={() => setInserting(false)}
                    className="p-1 bg-red-400 rounded-2xl m-2 font-bold"
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ) : null}
            {aulas.map((curso) => {
              return (
                <tr key={curso.id}>
                  <td id={`${diaSemana}-${curso.id}`} className="p-1">
                    {editableRow === `${diaSemana}-${curso.id}` && edit ? (
                      <input
                        autocomplete="off"
                        placeholder="digite o novo nome do curso"
                        name={`${diaSemana}-nome-${curso.id}`}
                        type="text"
                        onChange={handleChange}
                        value={value[`${diaSemana}-nome-${curso.id}`]}
                        className="text-black rounded-md p-1 outline-none"
                      />
                    ) : (
                      <p>
                        {value[`${diaSemana}-nome-${curso.id}`] ?? curso.nome}
                      </p>
                    )}
                  </td>
                  <td id={`horario-${diaSemana}-${curso.id}`} className="p-1">
                    {editableRow === `${diaSemana}-${curso.id}` && edit ? (
                      <input
                        autocomplete="off"
                        id={`input-${diaSemana}-${curso.id}`}
                        placeholder="digite o novo horário do curso"
                        name={`${diaSemana}-horario-${curso.id}`}
                        type="text"
                        onChange={handleChange}
                        value={value[`${diaSemana}-horario-${curso.id}`] ?? ""}
                        className="text-black rounded-md p-1 w-32 outline-none"
                      />
                    ) : (
                      <p>
                        {value[`${diaSemana}-horario-${curso.id}`] ??
                          curso.horario}
                      </p>
                    )}
                  </td>
                  <td id={`link-${diaSemana}-${curso.id}`} className="p-1">
                    {editableRow === `${diaSemana}-${curso.id}` && edit ? (
                      <input
                        autocomplete="off"
                        placeholder="novo link"
                        name={`${diaSemana}-link-${curso.id}`}
                        type="text"
                        onChange={handleChange}
                        value={value[`${diaSemana}-link-${curso.id}`] ?? ""}
                        className="text-black rounded-md p-1 w-full outline-none"
                      />
                    ) : (
                      <a
                        className="underline"
                        href={
                          value[`${diaSemana}-link-${curso.id}`] ?? curso.link
                        }
                      >
                        Assistir aula
                      </a>
                    )}
                  </td>
                  <td className="p-1">
                    <button
                      onClick={(e) => {
                        setEdit(!edit);
                        setEditableRow(`${diaSemana}-${curso.id}`);
                        if (e.target.innerText === "Salvar") {
                          if (
                            // eslint-disable-next-line no-restricted-globals
                            confirm("Deseja salvar as alterações realizadas ?")
                          ) {
                            let novasAulas = {
                              id: curso.id,
                              link: value[`${diaSemana}-link-${curso.id}`],
                              nome: value[`${diaSemana}-nome-${curso.id}`],
                              horario:
                                value[`${diaSemana}-horario-${curso.id}`],
                            };

                            let updatedData = {
                              diaSemana: diaSemana,
                              novasAulas: novasAulas,
                            };

                            const authToken =
                              localStorage.getItem("authToken") || "";

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
                      }}
                      className="p-2 bg-blue-500 rounded-2xl m-2 font-bold"
                    >
                      {edit && editableRow === `${diaSemana}-${curso.id}`
                        ? "Salvar"
                        : "Editar"}
                    </button>
                  </td>
                  <td className="p-1">
                    <button
                      onClick={() => {
                        if (
                          // eslint-disable-next-line no-restricted-globals
                          confirm(
                            `Tem certeza que deseja deletar o curso ${curso.nome} ?`
                          )
                        ) {
                          let updatedData = {
                            diaSemana: diaSemana,
                            aula: { id: curso.id },
                          };

                          const authToken =
                            localStorage.getItem("authToken") || "";

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
                      }}
                      className="p-2 bg-red-400 rounded-2xl m-2 font-bold"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              );
            })}
            <tr className="mx-12 mb-12 rounded-b-lg" />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { ClassesCard };
