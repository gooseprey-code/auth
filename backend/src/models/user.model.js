import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, "first name required"],
        lowercase: true,
    },
    lastName: {
        type: String,
        trim: true, 
        required: [true, "last name required"],
        lowercase: true,
    },
    username: {
        type: String,
        trim: true,
    },
    usernameLowerCase: {
        type: String,
        trim: true,
        lowercase: true,
        match: /^[A-Za-z][A-Za-z0-9._]{3,19}$/,
    },
    email: {
        type: String,
        trim: true, 
        required: true,
        unique: [true, "email required"],
        lowercase: true,
    },
    password: {
        type: String,
        required: function () {
            return this.provider === "local";
        }
    },
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ["adnin", "customer"],
        default: "customer"
    },
    avatar: {
        type: String,
    },
    verificationToken: {type: String},
    verificationTokenExpiresAt: { type: Date },
    resetPasswordToken: {type: String},
    resetPasswordTokenExpiresAt: {type: Date}
}, {
    timestamps: true,
}); 

userSchema.index({ usernameLowerCase: 1 },{unique: true,  partialFilterExpression: { usernameLowerCase: { $exists: true } } } );

userSchema.index({ 
    email: "text",
    usernameLowerCase: "text",
    firstName: "text",  
    lastName: "text",
},
{weights: { firstName: 5, lastName: 5, usernameLowerCase: 3, email: 1 }}
);    

userSchema.pre("save", async function () {
    if (this.isModified("username") && this.username) {
        this.usernameLowerCase = this.username.toLowerCase();
    }
})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;