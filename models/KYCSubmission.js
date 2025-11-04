const mongoose = require("mongoose");

const kycSubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscriber", // or "User" — match your main user collection
      required: true,
    },

    // Store all sections of the KYC form inside one structured object
    kycData: {
      personalDetails: {
        name: { type: String, required: true },
        dob: { type: String },
        email: { type: String },
        phone: { type: String },
        altPhone: { type: String },
      },

      businessDetails: {
        businessName: { type: String },
        businessType: { type: String },
        category: { type: String },
        year: { type: String },
        gst: { type: String },
        website: { type: String },
      },

      documentDetails: {
        pan: { type: String },
        aadhaar: { type: String },
        udyam: { type: String },
        tradeLicense: { type: String },
      },

      addressDetails: {
        address: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        pincode: { type: String },
      },

      documentUploads: {
        aadhaarFront: { type: String },
        aadhaarBack: { type: String },
        panCard: { type: String },
        gstCertificate: { type: String },
        businessLogo: { type: String },
        shopPhoto: { type: String },
      },
    },

    // Optional: Add status tracking
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    // Optional: Add admin remarks for rejection/verification notes
    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("KYCSubmission", kycSubmissionSchema);
