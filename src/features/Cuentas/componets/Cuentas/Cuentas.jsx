import { useNavigate } from "react-router-dom"

export default function Cuentas() {
    const navigate = useNavigate();

    return (
      <main>
        <div>
          <button
          onClick={() => navigate("/cuentas-bancarias")}
          >
            Cuentas Bancarias
          </button>
        </div>
      </main>
    )
};