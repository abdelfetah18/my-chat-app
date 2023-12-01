import { Router } from "express";
import user_by_id from "./user_by_id";

const app = Router();

app.use('/:user_id', user_by_id);

export default app;