import mongoose from "mongoose";

const travelJourneySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

   
    notes: [
      {
        title: { type: String, required: true, trim: true },
        content: { type: String, trim: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      },
    ],

   
    savedPlaces: [
      {
        placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
        addedAt: { type: Date, default: Date.now },
      },
    ],

  
    nextTrip: {
      placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
      startDate: { type: Date },
      endDate: { type: Date },
      checklist: [
        {
          item: { type: String },
          completed: { type: Boolean, default: false },
        },
      ],
      reminderDate: { type: Date },

     
   packingSuggestions: [
    {
      
      item: { type: String },         
      
      season: { type: String },       
      month: { type: Number },      
    },
  ],
    },
  },
  { timestamps: true }
);

export const TravelJourney = mongoose.model(
  "TravelJourney",
  travelJourneySchema
);

