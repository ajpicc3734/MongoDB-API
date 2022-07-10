const router = require("express").Router();

const {
  getAllThoughts,
  getThoughtById,
  addThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
} = require("../../controllers/thought-controller");

router.route("/").get(getAllThoughts);

router.route("/:id").get(getThoughtById).put(updateThought);

router.route("/:userId").post(addThought);

router.route("/:userId/:thoughtId").put(addReaction).delete(deleteThought);

router.route("/:userId/:thoughtId/:reactionId").delete(deleteReaction);

module.exports = router;
