import { useEffect, useRef, useState } from "react";
import "./ModalAgregarTipoProducto.css";

import { db } from "../../firebase";

import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
