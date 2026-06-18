import ENV from "./env.js"

export const setCookies = async (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: ENV.MODE_DEV === "production"? true : false,
        sameSite: "strict",
        maxAge: 15 * 60 * 60 * 1000
    })
     res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: ENV.MODE_DEV === "production"? true : false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}