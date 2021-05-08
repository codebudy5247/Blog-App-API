import express from "express";
const router = express.Router();

import { signin, signup ,followUser} from "../controller/userController.js";

router.post("/signin", signin);
router.post("/signup", signup);
router.put("/follow",followUser)

export default router;
