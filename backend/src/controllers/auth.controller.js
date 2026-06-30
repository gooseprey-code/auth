import User from "../models/user.model.js"
import { v4 as uuid } from "uuid";
import { hashToken } from "../utils/hashToken.js";
import crypto from "crypto"
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../lib/jwt.js";
import { redis } from "../lib/redis.js";
import { setCookies } from "../lib/setCookies.js";
import { RESERVED_USERNAMES } from "../lib/reserved.words.js";
import { containsBadWords } from "../lib/badwords.js";
import ENV from "../lib/env.js";
import formatBufferToDataUri from "../utils/dataUri.js"
import cloudinary from "../lib/cloudinary.js";
import client from "../lib/google.auth.js";
import { sendVerificationEmail, sendWelcomeEmail, sendResetPasswordEmail } from "../lib/sendEmail.js";


export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "All fields required",
    });
  }

  try {
    const sessionId = uuid();

    // ADD await
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken(user._id);

    const refreshToken = generateRefreshToken({
      userId: user._id,
      sessionId,
    });

    await redis.set(
      `refresh_token:${user._id}:${sessionId}`,
      hashToken(refreshToken),
      "EX",
      7 * 24 * 60 * 60
    );

    setCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isVerified: user.isVerified,
        username: user.username,
        avatar: user.avatar
      },
      message: "Login successful",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    if(!firstName || !lastName || !password || !email) return res.status(400).json({ message: "All fields required" })

    const normalizedEmail = email.toLowerCase()

    if(
        password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/\d/.test(password) ||
        !/[^A-Za-z0-9]/.test(password)
    ){
        return res.status(400).json({ message: "Password must be at least 8 characters and include an uppercase, lowercase, a number and a special character" })
    }

    try {
        const existingUser = await User.exists({email})
        if (existingUser) return res.status(409).json({message: "Email already in use"})
        const verificationToken = crypto.randomInt(100000, 999999).toString()
        // hashToken

        const verificationTokenExpiresAt = new Date(Date.now() + ( 15 * 60 * 1000 ))
        const newUser = await User.create({
            firstName,
            lastName,
            password,
            provider: "local",
            email: email.toLowerCase(),
            verificationToken,
            verificationTokenExpiresAt,
            isVerified: false
        })
        await sendVerificationEmail(newUser.email, newUser.firstName, newUser.verificationToken)

        res.status(201).json({
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                verificationTokenExpiresAt: newUser.verificationTokenExpiresAt,
                isVerified: newUser.isVerified,
            },
            message: "New user created successfully"
        })
    } catch (error) {
        console.error("SIGNUP ERROR:", error);
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const signupGoogle = async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    if(!firstName || !lastName || !password || !email) return res.status(400).json({ message: "All fields required" })

    const normalizedEmail = email.toLowerCase()

    if(
        password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/\d/.test(password) ||
        !/[^A-Za-z0-9]/.test(password)
    ){
        return res.status(400).json({ message: "Password must be at least 8 characters and include an uppercase, lowercase, a number and a special character" })
    }

    try {
        const existingUser = await User.exists({email})
        if (existingUser) return res.status(409).json({message: "Email already in use"})
        const verificationToken = crypto.randomInt(100000, 999999).toString()
        // hashToken

        const verificationTokenExpiresAt = new Date(Date.now() + ( 15 * 60 * 1000 ))
        const newUser = await User.create({
            firstName,
            lastName,
            password,
            provider: "google",
            email: email.toLowerCase(),
            verificationToken,
            verificationTokenExpiresAt,
            isVerified: false
        })

        res.status(201).json({
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                verificationTokenExpiresAt: newUser.verificationTokenExpiresAt,
                isVerified: newUser.isVerified
            },
            message: "New user created successfully"
        })
    } catch (error) {
        console.error("SIGNUP ERROR:", error);
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const verifyEmail = async (req, res) => {
  const code = req.body.code?.trim();

  if (!code) {
    return res.status(400).json({
      message: "Please enter the verification code sent to your email",
    });
  }

  const sessionId = uuid();

  try {
    const user = await User.findOneAndUpdate(
      {
        verificationToken: code.toString(),
        verificationTokenExpiresAt: { $gt: new Date() },
        isVerified: false,
      },
      {
        $set: { isVerified: true },
        $unset: {
          verificationToken: "",
          verificationTokenExpiresAt: "",
        },
      },
      { returnDocument: "after" }
    );

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification token",
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken({
      userId: user._id,
      sessionId,
    });

    const hashedRefreshToken = hashToken(refreshToken);

    await redis.set(
      `refresh_token:${user._id}:${sessionId}`,
      hashedRefreshToken,
      "EX",
      7 * 24 * 60 * 60
    );

    setCookies(res, accessToken, refreshToken);

    res.status(200).json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isVerified: user.isVerified,
        username: user.username,
        avatar: user.avatar,  
      },
      message: "User verified successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

export const resendVerificationToken = async (req, res) => {
  const { email} = req.body
  if (!email) return res.status(400).json({ message: "email needed" })
  
  try {
    const user = await User.findOne({ email }).select("-password")

    const expiry = new Date(user.verificationTokenExpiresAt).getTime()

    if (expiry > Date.now()) return res.status(400).json({ message: "Verification token is still active" })

    const newVerificationToken = crypto.randomInt(100000, 999999).toString()

    const newVerificationTokenExpiresAt = new Date (Date.now() + (15 * 60 * 1000))

    user.verificationToken = newVerificationToken

    user.verificationTokenExpiresAt = newVerificationTokenExpiresAt
    
    await user.save()

    await sendVerificationEmail(user.email, user.firstName, user.verificationToken)

    res.status(201).json({ user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        verificationTokenExpiresAt: user.verificationTokenExpiresAt,
        isVerified: user.isVerified
    },message: "A new token has been sent to your email" })

  } catch (error) {
    res.status(500).json({ message: "Internal server error" })
  }
}

export const addUsername = async (req, res) => {
  const { username } = req.body
  const userId = req.user._id

  if (!username)
    return res.status(400).json({ message: "Please add a username" })

  const regex = /^[A-Za-z][A-Za-z0-9._]{3,19}$/

  if (!regex.test(username))
    return res.status(400).json({ message: "Invalid username format" })

  const usernameLowerCase = username.toLowerCase()

  const isReserved = [...RESERVED_USERNAMES].some((reserved) =>
    usernameLowerCase === reserved ||
    usernameLowerCase.startsWith(reserved)
  )

  if (isReserved)
    return res.status(409).json({ message: "Username is reserved" })

  const hasBadWords = containsBadWords(usernameLowerCase)

  if (hasBadWords)
    return res.status(409).json({ message: "Username contains unacceptable words" })

  try {
    const existingUsername = await User.exists({
      usernameLowerCase,
      _id: { $ne: userId }
    })

    if (existingUsername)
      return res.status(409).json({ message: "Username already taken" })

    const user = await User.findById(userId)

    if (!user)
      return res.status(401).json({ message: "Unauthorized" })

    user.username = username

    await user.save()

    res.status(200).json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        isVerified: user.isVerified,
        avatar: user.avatar
      },
      message: "Username added successfully"
    })

  } catch (error) {
    if (error.code === 11000)
      return res.status(409).json({ message: "Username already taken" })

    res.status(500).json({
      message: "Error adding username",
      error: error.message
    })
  }
}

export const usernameAvailability = async (req, res) => {
  const { username } = req.body

  const regex = /^[A-Za-z][A-Za-z0-9._]{3,19}$/

  const usernameLowerCase = username.toLowerCase()

  if (!username || !regex.test(username)) {
    return res.status(400).json({
      success: false,
      message: "Invalid username format"
    })
  }

  try {
    const userExists = await User.exists({
      usernameLowerCase
    })

    if (userExists) {
      return res.status(200).json({
        success: false,
        message: "Unavailable"
      })
    }

    return res.status(200).json({
      success: true,
      message: "Available"
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error"
    })
  }
}

export const suggestedUsernames = async (req, res) => {
  const { firstName } = req.body;

  if (!firstName) {
    return res.status(400).json({
      message: "First name is required"
    });
  }


  const suggestedNames = [];
  let attempts = 0;

  try {
    while (suggestedNames.length < 4 && attempts < 50) {
      const username = `${firstName}_${crypto.randomInt(10, 9999)}`;
      const lowerUsername = username.toLowerCase();

      const existingUsername = await User.exists({
        usernameLowerCase: lowerUsername
      });

      const isReserved = [...RESERVED_USERNAMES].some((reserved) =>
        lowerUsername === reserved ||
        lowerUsername.startsWith(reserved)
      )
      const isValid =
        !existingUsername &&
        !containsBadWords(lowerUsername) &&
        !isReserved &&
        username.length >= 4 &&
        username.length <= 20;

      if (isValid && !suggestedNames.includes(username)) {
        suggestedNames.push(username);
      }

      attempts++;
    }

    return res.status(200).json({
      suggestedNames
    });
  } catch (error) {
    console.error("Error generating suggested usernames:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  const userId = req.user._id
  try {
    if(token){
      const decoded = jwt.verify(token, ENV.REFRESH_TOKEN_SECRET)
      await redis.del(
        `refresh_token:${decoded.userId}:${decoded.sessionId}`
      )
    }
    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")
    res.status(500).json({ message: "logout successful" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        message: "No refresh token",
      });
    }

    const payload = jwt.verify(
      token,
      ENV.REFRESH_TOKEN_SECRET
    );

    const key = `refresh_token:${payload.userId}:${payload.sessionId}`;

    const storedHash = await redis.get(key);

    if (!storedHash) {
      const stream = redis.scanStream({
        match: `refresh_token:${payload.userId}:*`,
      });

      stream.on("data", (keys) => {
        if (keys.length) redis.del(keys);
      });

      return res.status(403).json({
        message: "Refresh token reuse detected",
      });
    }

    if (hashToken(token) !== storedHash) {
      return res.status(403).json({
        message: "Invalid refresh token",
      });
    }

    const accessToken = generateAccessToken(payload.userId);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Token refreshed",
    });

  } catch (error) {
    if (
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.JsonWebTokenError
    ) {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body

  const normalisedEmail = email.toLowerCase()

  if (!email) return res.status(400).json({message: "email required"})


  try {
    const user = await User.findOne({email})
    if(!user) return res.status(400).json({message: "User does not exist"})
    if(user.resetPasswordTokenExpiresAt && user.resetPasswordTokenExpiresAt.getTime() >  Date.now()) return res.status(400).json({message: "Reset password link already sent to your email"})
    const resetToken = crypto.randomBytes(20).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    const resetTokenExpiry = Date.now() + (15 * 60 * 1000)

    user.resetPasswordToken = hashedToken
    user.resetPasswordTokenExpiresAt = resetTokenExpiry

    await user.save()

    const resetURL = `${ENV.CLIENT_URL}reset-password/${resetToken}`

    await sendResetPasswordEmail(user.email, user.firstName, resetURL)

    res.status(200).json({message: "Password reset sent to your email"})

  } catch (error) {
    res.status(400).json({message: error.message})
  }
}

export const resetPassword = async(req, res) => {

  const {token} = req.params

  const {password} = req.body

  if (!password) return res.status(400).json({message: "Password required"})

  if(
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/\d/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
  ){
      return res.status(400).json({ message: "Password must be at least 8 characters and include an uppercase, lowercase, a number and a special character" })
  }

  const hashedResetToken = crypto.createHash("sha256").update(token).digest("hex")

  try {
    const user = await User.findOne(
      {
        resetPasswordToken: hashedResetToken,
        resetPasswordTokenExpiresAt: {$gt: new Date()}
      }
    )
    if(!user)return res.status(400).json({message: "Invalid or expired reset token"})

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;

    await user.save()

    res.status(200).json({message: "Password changed successfully"})

  } catch (error) {
    res.status(400).json({message: error.message})
  }

}

export const uploadImage = async (req, res) => {
  const userId = req.user._id
  const file = req.file
  try {
    if (!file) {
      return res.status(400).json({
        message: "No image uploaded",
      })
    }

    const file64 = formatBufferToDataUri(file)
    
    const uploadResponse = await cloudinary.uploader.upload(
      file64.content,
      {
        folder: "auth_uploads",
      }
    )

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: uploadResponse.secure_url },
      { new: true }
    )

    res.status(200).json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        isVerified: user.isVerified,
        avatar: user.avatar
      },
      message: "Avatar added successfully"
    })

  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({
        message: "Invalid Google token",
      });
    }

    const {
      email,
      name,
      picture,
      sub: googleId,
    } = payload;

    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        firstName,
        lastName,
        provider: "google",
        avatar: picture,
        googleId,
        isVerified: true,
      });
      try {
        await sendWelcomeEmail(user.email, user.firstName, ENV.CLIENT_URL)
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }
    }

    const sessionId = uuid();

    const accessToken = generateAccessToken(user._id);

    const refreshToken = generateRefreshToken({
      userId: user._id,
      sessionId,
    });

    const hashedRefreshToken = hashToken(refreshToken);

    await redis.set(
      `refresh_token:${user._id}:${sessionId}`,
      hashedRefreshToken,
      "EX",
      7 * 24 * 60 * 60
    );

    setCookies(res, accessToken, refreshToken);

    res.status(200).json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
        username: user.username,
      },
      message: "User authenticated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Google authentication failed",
    });
  }
};