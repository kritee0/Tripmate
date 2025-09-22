import TravelInterest from "../models/InterestModel.js"


export const trackInterest = async (req, res) => {
  try {
    const { interest } = req.body;
    const userId = req.user._id; 

    if (!interest) {
      return res.status(400).json({ success: false, message: "Interest is required" });
    }

    let record = await TravelInterest.findOne({ user: userId, interest });

    if (record) {
   
      record.clicks += 1;
      await record.save();
    } else {
 
      record = await TravelInterest.create({
        user: userId,
        interest,
        clicks: 1,
      });
    }

    res.json({ success: true, message: "Interest tracked", record });
  } catch (err) {
    console.error(" trackInterest error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;

    const topInterests = await TravelInterest.find({ user: userId })
      .sort({ clicks: -1 }) 
      .limit(3); 

    res.json({
      success: true,
      recommendations: topInterests.map((item) => ({
        interest: item.interest,
        clicks: item.clicks,
      })),
    });
  } catch (err) {
    console.error(" getRecommendations error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
