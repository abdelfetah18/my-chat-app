import { Router } from "express";
import room_by_id from "./room_by_id";

const app = Router();

app.use('/:room_id', room_by_id);

export default app;