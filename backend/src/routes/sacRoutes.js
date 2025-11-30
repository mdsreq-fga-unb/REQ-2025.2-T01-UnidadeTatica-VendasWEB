import { Router } from "express";
import { abrirSac } from "../controllers/sacController.js";

const router = Router();

router.get("/sac", abrirSac);

export default router;
