import { ApiDataController } from "./controller.js";
import { ScreenController } from "./DOM.js";
import "./styles.css";

const controller = ApiDataController();
ScreenController(controller);
