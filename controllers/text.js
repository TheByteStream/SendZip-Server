const connectToDB = require("../db");

function generateSixDigitRandom() {
  return Math.floor(100000 + Math.random() * 900000);
}

const sendText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ message: "Invalid text input" });
    }

    const code = generateSixDigitRandom();

    const db = await connectToDB();

    await db.collection("texts").insertOne({
      text,
      code,
      createdAt: new Date(),
    });

    return res.status(200).json({ code, message: "Text sent successfully" });
  } catch (error) {
    console.error("Error inserting text:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getText = async (req, res) => {
  try {
    const { code } = req.params;
    const db = await connectToDB();

    const text = await db
      .collection("texts")
      .find({ code: Number(code) })
      .sort({ createdAt: -1 })
      .limit(1)
      .next();

    if (!text) {
      return res.status(200).json({
        success: false,
        message: "No texts found!!!",
      });
    }

    return res.status(200).json({ success: true, text: text.text });
  } catch (error) {
    console.error("Error fetching text:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendTextWithoutCode = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ message: "Invalid text input" });
    }
    const db = await connectToDB();
    await db.collection("plainText").insertOne({
      text,
      createdAt: new Date(),
    });
    return res.status(200).json({ message: "Text sent successfully" });
  } catch (error) {
    console.error("Error inserting text:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const getTextWithoutCode = async (req, res) => {
  try {
    const db = await connectToDB();
    const text = await db
      .collection("plainText")
      .find()
      .sort({ createdAt: -1 })
      .limit(1)
      .next();
    if (!text) {
      return res.status(404).json({ message: "No texts found" });
    }
    return res.status(200).json({ text: text.text });
  } catch (error) {
    console.error("Error fetching text:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  sendText,
  getText,
  sendTextWithoutCode,
  getTextWithoutCode,
};
