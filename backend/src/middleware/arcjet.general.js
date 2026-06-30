// middleware/generalProtection.js

import arcjet, {
  shield,
  detectBot,
  tokenBucket,
} from "@arcjet/node";
import ENV from "../lib/env.js";

const generalProtection = arcjet({
  key: ENV.ARCJET_KEY,

  characteristics: ["ip.src"],

  rules: [
    shield({
      mode: "LIVE",
    }),

    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),

    tokenBucket({
      mode: "LIVE",
      refillRate: 100,
      interval: 60,
      capacity: 100,
     
    }),
  ],
});

export const protectGeneral = async (
  req,
  res,
  next
) => {
  try {const decision =
    await generalProtection.protect(req, {
  requested: 1,
});

  if (
    decision.isDenied()
  ) {
    return res.status(429).json({
      message: "Suspicious request blocked",
    });
  }

  next();
  }catch (error) {console.error(error)
  next()
}

};


const authProtection = arcjet({
  key: ENV.ARCJET_KEY,

  characteristics: [
    "ip.src",
  ],

  rules: [
    shield({
      mode: "LIVE",
    }),

    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),

    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 300,
      capacity: 5,
 
   }),
  ],
});

export const protectAuth = async (
  req,
  res,
  next
) => {
  try {const decision =
    await authProtection.protect(req, {
  requested: 1,
});

  if (
    decision.isDenied()
  ) {
    return res.status(429).json({
      message: "Suspicious request blocked",
    });
  }

  next();
  }catch (error) {console.error(error)
  next()
}
};


const forgotPasswordProtection =
  arcjet({
    key: ENV.ARCJET_KEY,

    characteristics: ["ip.src"],

    rules: [
      shield({
      mode: "LIVE",
    }),

      tokenBucket({
        mode: "LIVE",
        refillRate: 5,
        interval: 900,
        capacity: 5,
 
     }),
    ],
  });

  export const ProtectForgotPassword = async (req, res, next) => {
    try {const decision =
      await forgotPasswordProtection.protect(
        req
      );

    if (
    decision.isDenied()
  ) {
      return res.status(429).json({
        message: "Suspicious request blocked",
      });
    }
    next();
    }catch (error) {console.error(error)
      next()
    }
  };


const refreshProtection =
  arcjet({
    key: ENV.ARCJET_KEY,

    characteristics: [
      "ip.src",
    ],

    rules: [
      tokenBucket({
        mode: "LIVE",
        refillRate: 20,
        interval: 60,
        capacity: 20,

requested: 1,      }),
    ],
  });

export const ProtectRefresh = async (
  req,
  res,
  next
) => {
  try {const decision =
    await refreshProtection.protect(req, {
  requested: 1,
}); 

  if (
    decision.isDenied()
  ) {
    return res.status(429).json({
      message: "Suspicious request blocked",
    });
  }

  next();
  }catch (error) {console.error(error)
  next()
}
};


const resetPasswordProtection =
  arcjet({
    key: ENV.ARCJET_KEY,

    characteristics: ["ip.src"],

    rules: [
      shield({
      mode: "LIVE",
    }),

      tokenBucket({
        mode: "LIVE",
        refillRate: 5,
        interval: 900,
        capacity: 5,
 
     }),
    ],
  });

  export const ProtectResetPassword = async (req, res, next) => {
    try {const decision = await resetPasswordProtection.protect(req, {
  requested: 1,
});
    
    if (
    decision.isDenied()
  ) {
      return res.status(429).json({
        message: "Suspicious request blocked"
      });
    }   

    next();
    }catch (error) {console.error(error)
  next()
}
};

const emailVerificationProtection =
  arcjet({
    key: ENV.ARCJET_KEY,

    characteristics: ["ip.src"],

    rules: [
      tokenBucket({
        mode: "LIVE",
        refillRate: 5,
        interval: 3600,
        capacity: 5,
 
     }),
    ],
  });

  export const protectEmailVerification = async (req, res, next) => {
    try {const decision = await emailVerificationProtection.protect(req, {
  requested: 1,
});

    if (
    decision.isDenied()
  ) {
      return res.status(429).json({
        message: "Suspicious request blocked"
      });
    }   

}catch (error) {console.error(error)
  next()
}    next();
}


