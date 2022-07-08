const { User, Thought } = require("../models");

const thoughtController = {
  //get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  //get thought by id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params._id })
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  //add thought
  addThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbThoughtData) => {
        console.log(dbThoughtData);
        if (!dbThoughtData) {
          res.status(404).json({ message: "No user found" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  //update thought
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  //delete thought
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then((deleteThought) => {
        if (!deleteThought) {
          return res.status(404).json({ message: "no thought found" });
        }
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
};
