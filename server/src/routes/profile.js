import { Router } from "express";
import db from "../config/db.js";
import { usersTable, pensTable, followsTable } from "../models/schema.js";
import { eq } from "drizzle-orm";
import { verifyFirebase } from "../middlewares/verifyFirebase.js";
import { verifyDB } from "../middlewares/verifyDB.js";

const router = Router();

router.post("/update-email", verifyFirebase, async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  try {
    const uid = req.userId;
    await db.update(usersTable).set({ email }).where(eq(usersTable.id, uid));

    return res.status(200).json({ message: "信箱已更新成功" });
  } catch (error) {
    console.error("更新信箱錯誤：", error);
    return res.status(500).json({ error: "更新失敗" });
  }
});

export default router;
