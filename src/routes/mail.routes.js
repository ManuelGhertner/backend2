
import { Router} from "express";
import { mailing } from "../controllers/mail.controller.js";
const mailRouter = Router();




mailRouter.get("/mail", mailing)


export default mailRouter;