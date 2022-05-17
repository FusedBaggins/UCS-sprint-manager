import { Router } from "express";
import SquadController from "../app/controllers/squad";
import SprintController from "../app/controllers/sprint";
import RankingController from "../app/controllers/ranking";

const routes = Router();

routes.get("/squad", SquadController.list);
routes.get("/sprint", SprintController.list);
routes.get("/ranking", RankingController.list);

routes.get("/squad/:id", SquadController.detail);
routes.get("/sprint/:id", SprintController.detail);
routes.get("/ranking/:id", RankingController.detail);

routes.post("/squad", SquadController.create);
routes.post("/sprint", SprintController.create);
routes.post("/ranking", RankingController.create);

routes.patch("/squad/:id", SquadController.edit);
routes.patch("/sprint/:id", SprintController.edit);
routes.patch("/ranking/:id", RankingController.edit);

routes.delete("/squad/:id", SquadController.delete);
routes.delete("/sprint/:id", SprintController.delete);
routes.delete("/ranking/:id", RankingController.delete);

export default routes;