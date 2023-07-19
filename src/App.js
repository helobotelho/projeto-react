import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from "react-router-dom";
import "./App.css";
import axios from "axios";
import Chart from "chart.js/auto";

const API_BASE_URL = "https://propulse.voltdata.info:9500";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    accept: "application/json",
    "content-type": "application/x-www-form-urlencoded"
  }
});

// Função para obter o token de autenticação
async function fetchToken() {
  try {
    const response = await axiosInstance.post("/login", "", {
      params: {
        username: "heloisa",
        password: "senha_da_heloisa"
      }
    });

    return response.data.token;
  } catch (error) {
    console.error("Erro ao obter o token:", error);
    throw error;
  }
}

function useApi(endpoint) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = await fetchToken();
        const response = await axiosInstance.get(`${API_BASE_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(JSON.parse(response.data));
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        setError(
          "Erro ao carregar os dados. Verifique sua conexão e tente novamente."
        );
        setLoading(false);
      }
    }

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
}

function QuantidadeTramitesPorTermo() {
  const { data, loading } = useApi("/v1/get_tramites_by_termos");
  const chartRef = useRef(null);

  useEffect(() => {
    if (!loading && chartRef.current) {
      const chart = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: Object.keys(data),
          datasets: [
            {
              label: "Quantidade de Trâmites por Termo",
              data: Object.values(data),
              backgroundColor: "rgba(153, 102, 255, 0.4)",
              borderColor: "rgba(153, 102, 255, 1)",
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            x: {
              type: "category"
            }
          }
        }
      });

      return () => {
        chart.destroy();
      };
    }
  }, [data, loading]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1 style={{ color: "#6600cc" }}>Quantidade de Trâmites por Termo</h1>
      <canvas ref={chartRef} />
    </div>
  );
}

function QuantidadeTramitesPorOrgaos() {
  const { data, loading } = useApi("/v1/get_tramites_by_orgaos");
  const chartRef = useRef(null);

  useEffect(() => {
    if (!loading && chartRef.current) {
      const chart = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: Object.keys(data),
          datasets: [
            {
              label: "Quantidade de Trâmites por Órgãos",
              data: Object.values(data),
              backgroundColor: "rgba(51, 204, 255, 0.4)",
              borderColor: "rgba(51, 204, 255, 1)",
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            x: {
              type: "category"
            }
          }
        }
      });

      return () => {
        chart.destroy();
      };
    }
  }, [data, loading]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1 style={{ color: "#0099cc" }}>Quantidade de Trâmites por Órgãos</h1>
      <canvas ref={chartRef} />
    </div>
  );
}

function QuantidadeTermosPorOrgaos() {
  const { data, loading } = useApi("/v1/get_termos_by_orgaos");
  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  const chart3Ref = useRef(null);

  useEffect(() => {
    if (
      !loading &&
      chart1Ref.current &&
      chart2Ref.current &&
      chart3Ref.current
    ) {
      const chart1 = new Chart(chart1Ref.current, {
        type: "bar",
        data: {
          labels: Object.keys(data.dou),
          datasets: [
            {
              label: "Quantidade de Termos por Órgãos (DOU)",
              data: Object.values(data.dou),
              backgroundColor: "rgba(153, 102, 255, 0.4)",
              borderColor: "rgba(153, 102, 255, 1)",
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            x: {
              type: "category"
            }
          }
        }
      });

      const chart2 = new Chart(chart2Ref.current, {
        type: "bar",
        data: {
          labels: Object.keys(data.senado),
          datasets: [
            {
              label: "Quantidade de Termos por Órgãos (Senado)",
              data: Object.values(data.senado),
              backgroundColor: "rgba(51, 204, 255, 0.4)",
              borderColor: "rgba(51, 204, 255, 1)",
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            x: {
              type: "category"
            }
          }
        }
      });

      const chart3 = new Chart(chart3Ref.current, {
        type: "bar",
        data: {
          labels: Object.keys(data.camara),
          datasets: [
            {
              label: "Quantidade de Termos por Órgãos (Câmara)",
              data: Object.values(data.camara),
              backgroundColor: "rgba(0, 102, 204, 0.4)",
              borderColor: "rgba(0, 102, 204, 1)",
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            x: {
              type: "category"
            }
          }
        }
      });

      return () => {
        chart1.destroy();
        chart2.destroy();
        chart3.destroy();
      };
    }
  }, [data, loading]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1 style={{ color: "#0066cc" }}>
        Quantidade de Termos por Órgãos baseados nos Trâmites
      </h1>
      <div>
        <h2>DOU</h2>
        <canvas ref={chart1Ref} />
      </div>
      <div>
        <h2>Senado</h2>
        <canvas ref={chart2Ref} />
      </div>
      <div>
        <h2>Câmara</h2>
        <canvas ref={chart3Ref} />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul className="navbar">
            <li>
              <Link to="/quantidade-tramites-termo">Trâmites por Termo</Link>
            </li>
            <li>
              <Link to="/quantidade-tramites-orgaos">Trâmites por Órgãos</Link>
            </li>
            <li>
              <Link to="/quantidade-termos-orgaos">
                Termos por Órgãos baseados nos Trâmites
              </Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route
            path="/"
            element={<Navigate to="/quantidade-tramites-termo" />}
          />
          <Route
            path="/quantidade-tramites-termo"
            element={<QuantidadeTramitesPorTermo />}
          />
          <Route
            path="/quantidade-tramites-orgaos"
            element={<QuantidadeTramitesPorOrgaos />}
          />
          <Route
            path="/quantidade-termos-orgaos"
            element={<QuantidadeTermosPorOrgaos />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
