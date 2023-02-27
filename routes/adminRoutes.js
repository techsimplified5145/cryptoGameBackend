const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { upload, cloudinary } = require("../middleware/imageUploading");
const UserSchema = require("../models/User");
const InstructionsSchema = require("../models/Instructions");
const OfferSchema = require("../models/Offer.js");
router.post("/login", (req, res) => {
  const { loginId, password } = req.body;
  if (loginId === "I am The Admin") {
    if (password === "I am The Admin") {
      jwt.sign({ id: "111999888" }, "Profit_Outcome@2023", (err, token) => {
        if (err) throw err;
        return res.status(200).json(token);
      });
    } else {
      return res.status(401).json({ error: "Wrong Password" });
    }
  } else {
    return res.status(400).json({ error: "Wrong login ID" });
  }
});

router.get("/users/profits/", async (req, res) => {
  UserSchema.find()
    .select(["email", "profit_tracker"])
    .then((profit) => {
      return res.status(200).json(profit);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
});

router.get("/premium/users/", async (req, res) => {
  UserSchema.find({ role: "premium" })
    .select(["email", "premium"])
    .then((premium) => {
      return res.status(200).json(premium);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
});

router.get("/testing", async (req, res) => {
  return res.status(400).json({ msg: "Server is up and running" });
});

router.get("/offers/:type", (req, res) => {
  OfferSchema.find({ type: req.params.type })
    .sort("order")
    .then((offers) => {
      return res.status(200).json(offers);
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json(err);
    });
});

router.post("/offer/image/upload", upload.single("image"), (req, res) => {
  console.log(req.file.path);
  cloudinary.v2.uploader.upload(
    req.file.path,
    {
      use_filename: true,
      folder: "connor",
    },
    async function (err, result) {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }
      if (result) {
        return res.status(200).json(result.secure_url);
      }
    }
  );
});

router.post("/offer", auth, async (req, res) => {
  console.log(req.body);
  const count = await OfferSchema.countDocuments({ type: req.body.type });
  let data = {
    ...req.body,
    order: count + 1,
  };

  const offer = new OfferSchema(data);
  offer
    .save()
    .then((offer) => {
      console.log(offer);
      return res.status(200).json(offer);
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json(err);
    });
});

router.put("/offer/:id", auth, (req, res) => {
  console.log(req.body);
  OfferSchema.findByIdAndUpdate(req.params.id, req.body)
    .then((item) => {
      return res.status(200).json(item);
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
});

router.delete("/offer/:id", auth, (req, res) => {
  OfferSchema.findByIdAndDelete(req.params.id)
    .then(() => {
      return res.status(200).json({ msg: "Deleted Successfully" });
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
});

router.put("/offer/order/up/:type/:order", (req, res) => {
  console.log("ORDER", req.params.order, "TYPE", req.params.type);
  OfferSchema.findOneAndUpdate(
    { type: req.params.type, order: Number(req.params.order) },
    { order: Number(req.params.order) - 1 }
  )
    .then((offer) => {
      OfferSchema.findOneAndUpdate(
        {
          type: req.params.type,
          order: Number(req.params.order) - 1,
          _id: { $ne: offer._id },
        },
        {
          order: Number(req.params.order),
        }
      ).then(() => {
        return res.status(200).json("Order up");
      });
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
});

router.put("/offer/order/down/:type/:order", (req, res) => {
  console.log(req.params.order, Number(req.params.order) + 1);
  OfferSchema.findOneAndUpdate(
    { type: req.params.type, order: Number(req.params.order) },
    { order: Number(req.params.order) + 1 }
  )
    .then((offer) => {
      console.log(offer);
      OfferSchema.findOneAndUpdate(
        {
          type: req.params.type,
          order: Number(req.params.order) + 1,
          _id: { $ne: offer._id },
        },
        {
          order: Number(req.params.order),
        }
      ).then((final) => {
        console.log(final);
        return res.status(200).json("Order down");
      });
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
});

router.get("/instructions/:type", (req, res) => {
  InstructionsSchema.find({ type: req.params.type })
    .sort("order")
    .then((instructions) => {
      return res.status(200).json(instructions);
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json(err);
    });
});

router.post(
  "/instructions/image/upload",
  upload.single("image"),
  (req, res) => {
    console.log(req.file.path);
    cloudinary.v2.uploader.upload(
      req.file.path,
      {
        use_filename: true,
        folder: "instructions",
      },
      async function (err, result) {
        if (err) {
          console.log(err);
          return res.status(500).json({
            error: err,
          });
        }
        if (result) {
          console.log(result);
          return res.status(200).json(result.secure_url);
        }
      }
    );
  }
);

router.post("/instructions", auth, async (req, res) => {
  console.log(req.body);
  const count = await InstructionsSchema.countDocuments({
    type: req.body.type,
  });
  let data = {
    ...req.body,
    order: count + 1,
  };

  const instructions = new InstructionsSchema(data);
  instructions
    .save()
    .then((instructions) => {
      console.log(instructions);
      return res.status(200).json(instructions);
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json(err);
    });
});

router.put("/instructions/:id", auth, (req, res) => {
  console.log(req.body);
  InstructionsSchema.findByIdAndUpdate(req.params.id, req.body)
    .then((item) => {
      return res.status(200).json(item);
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
});

router.delete("/instructions/:id", auth, (req, res) => {
  InstructionsSchema.findByIdAndDelete(req.params.id)
    .then(() => {
      return res.status(200).json({ msg: "Deleted Successfully" });
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
});

router.put("/instructions/order/up/:type/:order", (req, res) => {
  InstructionsSchema.findOneAndUpdate(
    { type: req.params.type, order: Number(req.params.order) },
    { order: Number(req.params.order) - 1 }
  )
    .then((offer) => {
      InstructionsSchema.findOneAndUpdate(
        {
          type: req.params.type,
          order: Number(req.params.order) - 1,
          _id: { $ne: offer._id },
        },
        {
          order: Number(req.params.order),
        }
      ).then(() => {
        return res.status(200).json("Order up");
      });
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
});

router.put("/instructions/order/down/:type/:order", (req, res) => {
  console.log(req.params.order, Number(req.params.order) + 1);
  InstructionsSchema.findOneAndUpdate(
    { type: req.params.type, order: Number(req.params.order) },
    { order: Number(req.params.order) + 1 }
  )
    .then((offer) => {
      console.log(offer);
      InstructionsSchema.findOneAndUpdate(
        {
          type: req.params.type,
          order: Number(req.params.order) + 1,
          _id: { $ne: offer._id },
        },
        {
          order: Number(req.params.order),
        }
      ).then((final) => {
        return res.status(200).json("Order down");
      });
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
});

router.get("/instruction/details/:id", (req, res) => {
  InstructionsSchema.findById(req.params.id)
    .then((instruction) => {
      return res.status(200).json(instruction);
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json(err);
    });
});

router.get("/offer/details/:id", (req, res) => {
  OfferSchema.findById(req.params.id)
    .then((offer) => {
      return res.status(200).json(offer);
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json(err);
    });
});

module.exports = router;
