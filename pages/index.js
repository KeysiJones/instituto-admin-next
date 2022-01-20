import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ClassesCard } from "../components/classesCard";
import { Loader } from "../components/loader";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const AULAS_URL = `${BASE_URL}/aulas/6128177affc6504f682dbb81`;
const ADICIONAR_AULAS_URL = `${BASE_URL}/novasAulas/6128177affc6504f682dbb81`;
const LOGIN_URL = `${BASE_URL}/login`;

export async function getServerSideProps() {
  const urls = {
    base: BASE_URL,
    aulas: AULAS_URL,
    adicionar: ADICIONAR_AULAS_URL,
    login: LOGIN_URL,
  };

  return {
    props: {
      urls,
    },
  };
}

export default function Home({ urls }) {
  const [aulasTerca, setAulasTerca] = useState([]);
  const [aulasQuarta, setAulasQuarta] = useState([]);
  const [aulasQuinta, setAulasQuinta] = useState([]);
  const [aulasSabado, setAulasSabado] = useState([]);

  const [refresh, setRefresh] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken") || null;

    if (!token) {
      router.push("/login");
    } else {
      fetch(urls.aulas)
        .then((res) => res.json())
        .then(({ terca, quarta, quinta, sabado }) => {
          setAulasTerca(terca);
          setAulasQuarta(quarta);
          setAulasQuinta(quinta);
          setAulasSabado(sabado);
        });
    }
  }, [refresh, setRefresh]);

  return (
    <div className="App">
      <header className="App-header">
        {aulasTerca[0] ? (
          <ClassesCard
            urls={urls}
            aulas={{
              terca: aulasTerca,
              quarta: aulasQuarta,
              quinta: aulasQuinta,
              sabado: aulasSabado,
            }}
            setRefresh={setRefresh}
          />
        ) : (
          <Loader />
        )}
      </header>
    </div>
  );
}
