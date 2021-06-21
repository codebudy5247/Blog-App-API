import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";
import commentCtrl from "../controller/commentController.js"


router.post('/', auth, commentCtrl.createComment)

router.patch('/:id', auth, commentCtrl.updateComment)

router.patch('/:id/like', auth, commentCtrl.likeComment)

router.patch('/:id/unlike', auth, commentCtrl.unLikeComment)

router.delete('/:id', auth, commentCtrl.deleteComment)

export default router;
