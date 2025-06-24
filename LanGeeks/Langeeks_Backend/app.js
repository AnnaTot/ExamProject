import express from "express";
import cors from "cors";
import UserRouterUsers from "./routes/users.js";
import UserRouterGroups from "./routes/groups.js";
import UserRouterLanguages from "./routes/languages.js";
import UserRouterGroupMembers from "./routes/groupmembers.js";
import UserRouterRuleBreaks from "./routes/rulebreaks.js";
import UserRouterNotifications from "./routes/notifications.js";
import UserRouterMessages from "./routes/messages.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/", UserRouterUsers);
app.use("/", UserRouterGroups);
app.use("/", UserRouterLanguages);
app.use("/", UserRouterGroupMembers);
app.use("/", UserRouterRuleBreaks);
app.use("/", UserRouterNotifications);
app.use("/", UserRouterMessages);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
