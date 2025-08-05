import express from "express";
import { addMovie, getMovies } from "../controllers/movie.controller.js";

const router = express.Router();

router.post("/", addMovie);
router.get("/", getMovies);

export default router;


