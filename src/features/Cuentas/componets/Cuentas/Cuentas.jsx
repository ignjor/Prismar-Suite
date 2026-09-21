import { useNavigate } from "react-router-dom"

export default function Cuentas() {
  const navigate = useNavigate();


  return (
      <div>
        <button
        onClick={() => navigate("/cuentas-bancarias")}

        >
          Cuentas Bancarias
        </button>
        
      </div>
  )
};