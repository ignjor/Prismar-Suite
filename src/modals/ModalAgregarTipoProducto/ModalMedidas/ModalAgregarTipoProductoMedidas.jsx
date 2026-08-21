import { useEffect, useRef, useState } from "react";

import "./ModalAgregarTipoProductoMedidas.css";

import { db } from "../../../firebase";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";

import {
    CircleX,
    Check,
    ArrowLeft,
    Save
} from "lucide-react";

export default function ModalAgregarTipoProductoMedidas({ abierto, onCerrar, tipoPrenda, onSiguiente }) {
    const [nombreTipoPrenda, setNombreTipoPrenda] = useState("");
    const [error, setError] = useState("");
    const modalRef = useRef(null);

}