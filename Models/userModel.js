const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { boolean } = require('joi');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists'],
        lowercase: true
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false,
        minlength: 8
    },
    isActive: {
        type: Boolean,
        default: true,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    },
    passwordUpdatedAt: {
        type: Date,
        default: Date.now,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword, password) {
    return await bcrypt.compare(candidatePassword, password);
};

module.exports = mongoose.model('User', userSchema);