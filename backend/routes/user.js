const { Router } = require("express");
// const User = require("../db");
const { Account } = require("../db");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const JWT_Secret = require("../config");
const router = Router();
const zod = require("zod");
const authMiddleware = require("../middleware");

//zod verification for signup
const signupSchema = zod.object({
    username: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})

router.post("/signup", async (req, res) => {
    const signupBody = req.body;

    const schemaResponse = signupSchema.safeParse(signupBody)
    
    if (schemaResponse.success != true) {
        return res.status(411).json({
            message: "Incorrect Input"
        })
    }

    const response = await User.find({username: signupBody.username}).exec();

    if (response.length != 0) {
        return res.status(411).json({
            message: "Email already taken",
        })
    } else {
        try {
            const user = await User.create({firstName: signupBody.firstName, lastName: signupBody.lastName, password: signupBody.password, username: signupBody.username});
            const userId = user._id;

            const account = await Account.create({userId: userId, balance: Math.floor(Math.random() * 1000) + 1});

            let token = jwt.sign({userId}, JWT_Secret.JWT_Secret);
            return res.status(200).json({
                message: "User successfully created",
                token: token,
            })
        } catch(err) {
            console.log(err);
            return res.status(500).json({
                message: "An error occured while trying make your account, please try again",
            })
        }
    }
});

//zod verification
const signinBodySchema = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

router.post("/signin", async (req, res) => {
    const signinBody = req.body;

    const { success }= signinBodySchema.safeParse(req.body);
    if (!success) {
        return res.json({
            message: "Invalid input",
        })
    }

    const response = await User.find({username: signinBody.username, password: signinBody.password}).exec();
    
    if (response.length == 0) {
        return res.status(411).json({
            message: "Wrong username or password",
        })
    } else {
        const userId = response[0]._id;
        const token = jwt.sign({userId}, JWT_Secret.JWT_Secret);
        return res.status(200).json({
            token: token,
        })
    }

});

router.get("/me", authMiddleware, async (req, res) => {
    const response = await User.findById(req.userId).exec();
    return res.json({
        firstName: response.firstName,
        lastName: response.lastName,
    })
})

router.put("/", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const newBody = req.body;

    const response = await User.findById(userId).exec();

    
    if ("password" in newBody) {
        response.password = newBody.password;
    }
    if ("firstName" in newBody) {
        response.firstName = newBody.firstName;
    }
    if ("lastName" in newBody) {
        response.lastName = newBody.lastName;
    }

    await response.save();
    
    return res.status(200).json({
        message: "Updated successfully",
    })
    
});

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";
  
    const users = await User.find({
      $or: [
        {
          firstName: {
            $regex: filter,
          },
        },
        {
          lastName: {
            $regex: filter,
          },
        },
      ],
    });
  
    res.json({
      user: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  });

module.exports = router;