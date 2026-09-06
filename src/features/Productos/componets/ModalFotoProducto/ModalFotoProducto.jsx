import { useEffect, useRef, useState } from "react";
import "./ModalFotoProducto.css";

import { db, storage } from "../../../../firebase";
import { updateDoc, doc} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { Camera, Check, ImagePlus, LoaderCircle, Upload, CircleX } from "lucide-react";

export default function ModalFotoProducto({ producto, modalAbierto, onCerrarModal }) {}