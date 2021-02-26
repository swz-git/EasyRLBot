//./dist/BotClient.js
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.BotClient = void 0;
require("colors");
var net_1 = __importDefault(require("net"));
var flatbuffers_1 = require("flatbuffers");
var rlbot_generated_1 = require("./flat/rlbot_generated");
var ControllerManager_1 = require("./ControllerManager");
var RenderManager_1 = require("./RenderManager");
var utils = __importStar(require("./utils"));
var BotClient = /** @class */ (function () {
    function BotClient(botIndex, ws) {
        var _this = this;
        if (ws === void 0) { ws = null; }
        this.renderer = new RenderManager_1.RenderManager(this);
        this.controller = new ControllerManager_1.ControllerManager(this);
        this.GameTickPacketRate = 0;
        if (botIndex == null)
            throw new Error("Give bot index");
        this.botIndex = botIndex;
        this.internalName = "BOT-" + this.botIndex;
        this.logger = new utils.Logger(this.internalName);
        this.standalone = ws == null;
        if (this.standalone) {
            var port = 23234;
            var host = "localhost";
            this.ws = new net_1["default"].Socket();
            this.logger.log("Socket", "Connecting...".yellow);
            this.ws.connect({ port: port, host: host }, function () {
                _this.start();
            });
        }
        else {
            this.ws = ws || new net_1["default"].Socket();
            this.start();
        }
        this.ws.on("data", function (f) {
            _this.messageHandler(f);
        });
        this.readyMessageAccepted = false;
        this.latestFieldInfo = null;
        this.latestBallPrediction = null;
        this.latestMatchSettings = null;
    }
    BotClient.prototype.onReady = function () { };
    BotClient.prototype.getOutput = function (gameTickPacket, fieldInfo, ballPrediction, matchSettings) { };
    BotClient.prototype.onGameTickPacket = function (gameTickPacket) { };
    BotClient.prototype.onFieldInfo = function (fieldInfo) { };
    BotClient.prototype.onMatchSettings = function (matchSettings) { };
    BotClient.prototype.onQuickChat = function (quickChat) { };
    BotClient.prototype.onBallPrediction = function (ballPrediction) { };
    BotClient.prototype.messageHandler = function (raw) {
        var _this = this;
        if (!this.readyMessageAccepted) {
            this.readyMessageAccepted = true;
            this.logger.log("Socket", "Server accepted ready message and is now sending GameTickPackets".green);
            this.onReady();
        }
        var parsedLoad;
        try {
            parsedLoad = utils.decodeFlat(raw);
        }
        catch (_a) {
            return this.logger.log("Socket", "Recived incorrect data, socket is unstable.");
        }
        var cleanLoad;
        switch (parsedLoad.type) {
            case 1:
                this.GameTickPacketRate++;
                setTimeout((function () {
                    _this.GameTickPacketRate--;
                }).bind(this), 1000);
                cleanLoad = new utils.flatstructs.GameTickPacket(parsedLoad.root);
                this.onGameTickPacket(cleanLoad);
                this.getOutput(cleanLoad, this.latestFieldInfo, this.latestBallPrediction, this.latestMatchSettings);
                break;
            case 2:
                cleanLoad = new utils.flatstructs.FieldInfo(parsedLoad.root);
                this.onFieldInfo(cleanLoad);
                this.latestFieldInfo = cleanLoad;
                break;
            case 3:
                cleanLoad = new utils.flatstructs.MatchSettings(parsedLoad.root);
                this.onMatchSettings(cleanLoad);
                this.latestMatchSettings = cleanLoad;
                break;
            case 9:
                cleanLoad = new utils.flatstructs.QuickChat(parsedLoad.root);
                this.onQuickChat(cleanLoad);
                break;
            case 10:
                cleanLoad = new utils.flatstructs.BallPrediction(parsedLoad.root);
                this.onBallPrediction(cleanLoad);
                this.latestBallPrediction = cleanLoad;
                break;
        }
    };
    BotClient.prototype.setGameState = function (newGameState) {
        var builder = new flatbuffers_1.flatbuffers.Builder(1024);
        var finishedGameState = newGameState.convertToFlat(builder);
        builder.finish(finishedGameState);
        var buf = builder.asUint8Array();
        this.ws.write(utils.encodeFlat(7, buf));
    };
    BotClient.prototype.setMatchSettings = function (newMatchSettings) {
        this.logger.log("MatchSettings", "This feature is not supported yet. Support is comming when json support is comming to RLBot.");
    };
    BotClient.prototype.sendQuickChat = function (QuickChatSelection, teamOnly) {
        if (teamOnly === void 0) { teamOnly = false; }
        var quickChat = rlbot_generated_1.rlbot.flat.QuickChat;
        var builder = new flatbuffers_1.flatbuffers.Builder(1024);
        quickChat.startQuickChat(builder);
        quickChat.addQuickChatSelection(builder, QuickChatSelection);
        quickChat.addPlayerIndex(builder, this.botIndex);
        quickChat.addTeamOnly(builder, teamOnly);
        var quickchatOffset = quickChat.endQuickChat(builder);
        builder.finish(quickchatOffset);
        var buf = builder.asUint8Array();
        this.ws.write(utils.encodeFlat(9, buf));
    };
    BotClient.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var builder, readyMessage, readyMsgBuf;
            return __generator(this, function (_a) {
                if (this.standalone)
                    this.logger.log("Socket", "Connected".green);
                builder = new flatbuffers_1.flatbuffers.Builder(1024);
                rlbot_generated_1.rlbot.flat.ReadyMessage.startReadyMessage(builder);
                rlbot_generated_1.rlbot.flat.ReadyMessage.addWantsBallPredictions(builder, true);
                rlbot_generated_1.rlbot.flat.ReadyMessage.addWantsGameMessages(builder, true);
                rlbot_generated_1.rlbot.flat.ReadyMessage.addWantsQuickChat(builder, true);
                readyMessage = rlbot_generated_1.rlbot.flat.ReadyMessage.endReadyMessage(builder);
                builder.finish(readyMessage);
                readyMsgBuf = builder.asUint8Array();
                this.ws.write(utils.encodeFlat(11, readyMsgBuf));
                return [2 /*return*/];
            });
        });
    };
    return BotClient;
}());
exports.BotClient = BotClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm90Q2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0JvdENsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0JBQWdCO0FBQ2hCLDRDQUFzQjtBQUN0QiwyQ0FBMEM7QUFFMUMsMERBQStDO0FBRS9DLHlEQUFvRTtBQUVwRSxpREFBZ0Q7QUFDaEQsNkNBQWlDO0FBRWpDO0lBb0JFLG1CQUFZLFFBQWdCLEVBQUUsRUFBNEI7UUFBMUQsaUJBNkJDO1FBN0I2QixtQkFBQSxFQUFBLFNBQTRCO1FBUDFELGFBQVEsR0FBa0IsSUFBSSw2QkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xELGVBQVUsR0FBc0IsSUFBSSxxQ0FBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU1RCx1QkFBa0IsR0FBVyxDQUFDLENBQUM7UUFLN0IsSUFBSSxRQUFRLElBQUksSUFBSTtZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsWUFBWSxHQUFHLFNBQU8sSUFBSSxDQUFDLFFBQVUsQ0FBQztRQUMzQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFbEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLElBQUksSUFBSSxDQUFDO1FBQzdCLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixJQUFNLElBQUksR0FBRyxLQUFLLENBQUM7WUFDbkIsSUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDO1lBRXpCLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxnQkFBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzNCLElBQUksQ0FBQyxN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
//./dist/BotManager.js
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.BotManager = void 0;
require("colors");
var net_1 = __importDefault(require("net"));
var utils = __importStar(require("./utils"));
var BotManager = /** @class */ (function () {
    function BotManager(BotClass, agentPort) {
        var _this = this;
        this.logger = new utils.Logger("Manager");
        this.Bot = BotClass;
        this.bots = {};
        this.agentPort = agentPort;
        this.agentIP = "localhost";
        var port = 23234;
        var host = "localhost";
        this.ws = new net_1["default"].Socket();
        this.logger.log("Socket", "Connecting...".yellow);
        this.ws.connect({ port: port, host: host }, function () {
            _this.logger.log("Socket", "Connected".green);
            _this.start();
        });
        this.ws.on("error", function () {
            _this.logger.log("Socket", "Error when connecting to RLBot, make sure RLBot is running.".red);
            process.exit(0);
        });
    }
    BotManager.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var server, logger;
            var _this = this;
            return __generator(this, function (_a) {
                server = net_1["default"].createServer(function (socket) {
                    socket.setEncoding("ascii");
                    socket.on("data", function (data) {
                        var message = data.toString().split("\n");
                        var type = message[0];
                        var index = message[1];
                        switch (type) {
                            case "add":
                                if (_this.bots[index] != undefined)
                                    return;
                                _this.bots[index] = new _this.Bot(Number(index), _this.ws);
                                _this.bots[index].logger.enabled = false;
                                _this.logger.log("AgentConnection", ("Added bot with index " + index).green);
                                break;
                            case "remove":
                                delete _this.bots[index];
                                _this.logger.log("AgentConnection", ("Removed bot with index " + index).red);
                                break;
                            default:
                                break;
                        }
                    });
                });
                logger = this.logger;
                server.listen(this.agentPort, this.agentIP, function () {
                    logger.log("AgentConnection", "Listening to data from Agent");
                    server.on("close", function () {
                        logger.log("AgentConnection", "Connection closed");
                    });
                    server.on("error", function (error) {
                        logger.log("AgentConnection", "Error: " + error);
                    });
                });
                server.on("error", function (e) {
                    if (e.code == "EADDRINUSE") {
                        _this.logger.log("AgentConnection", "Connection closed, port already in use");
                        throw new Error("Port is already in use: " + _this.agentIP);
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    return BotManager;
}());
exports.BotManager = BotManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm90TWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Cb3RNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrQkFBZ0I7QUFDaEIsNENBQXNCO0FBRXRCLDZDQUFpQztBQU1qQztJQVFFLG9CQUFZLFFBQWEsRUFBRSxTQUFpQjtRQUE1QyxpQkF3QkM7UUExQkQsV0FBTSxHQUFpQixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFHakQsSUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUM7UUFDcEIsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7UUFFZixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQztRQUUzQixJQUFNLElBQUksR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDO1FBRXpCLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxnQkFBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRTNCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLE1BQUEsRUFBRSxJQUFJLE1BQUEsRUFBRSxFQUFFO1lBQzlCLEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDN0MsS0FBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2YsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUU7WUFDbEIsS0FBSSxD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
//./dist/Controller.js
"use strict";
// This file is copied from RLBotJS by SuperVK. It is translated into typescript and some minor changes were made to make it compatible with this codebase.
exports.__esModule = true;
var Controller = /** @class */ (function () {
    function Controller() {
        this.throttle = 0;
        this.steer = 0;
        this.pitch = 0;
        this.roll = 0;
        this.yaw = 0;
        this.boost = false;
        this.jump = false;
        this.handbrake = false;
        this.useItem = false;
    }
    return Controller;
}());
exports["default"] = Controller;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Db250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwySkFBMko7O0FBRTNKO0lBVUU7UUFDRSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUMsQUFyQkQsSUFxQkM7QUFFRCxxQkFBZSxVQUFVLENBQUMifQ==
//./dist/ControllerManager.js
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
exports.ControllerManager = exports.Controller = void 0;
var rlbot_generated_1 = require("./flat/rlbot_generated");
var flatbuffers_1 = require("flatbuffers");
var utils = __importStar(require("./utils"));
var Controller = /** @class */ (function () {
    function Controller() {
        this.throttle = 0;
        this.steer = 0;
        this.pitch = 0;
        this.roll = 0;
        this.yaw = 0;
        this.boost = false;
        this.jump = false;
        this.handbrake = false;
        this.useItem = false;
    }
    return Controller;
}());
exports.Controller = Controller;
var ControllerManager = /** @class */ (function () {
    function ControllerManager(client) {
        this.client = client;
    }
    ControllerManager.prototype.sendInput = function (controller) {
        if (!(controller instanceof Controller)) {
            throw new Error("Expected Controller.");
        }
        var controllerState = rlbot_generated_1.rlbot.flat.ControllerState;
        var playerInput = rlbot_generated_1.rlbot.flat.PlayerInput;
        var builder = new flatbuffers_1.flatbuffers.Builder(1024);
        controllerState.startControllerState(builder);
        controllerState.addThrottle(builder, controller.throttle);
        controllerState.addSteer(builder, controller.steer);
        controllerState.addPitch(builder, controller.pitch);
        controllerState.addYaw(builder, controller.yaw);
        controllerState.addRoll(builder, controller.roll);
        controllerState.addBoost(builder, controller.boost);
        controllerState.addJump(builder, controller.jump);
        controllerState.addHandbrake(builder, controller.handbrake);
        controllerState.addUseItem(builder, controller.useItem);
        var finishedControllerState = controllerState.endControllerState(builder);
        playerInput.startPlayerInput(builder);
        playerInput.addPlayerIndex(builder, this.client.botIndex);
        playerInput.addControllerState(builder, finishedControllerState);
        var finishedPlayerInput = controllerState.endControllerState(builder);
        builder.finish(finishedPlayerInput);
        var buf = builder.asUint8Array();
        this.client.ws.write(utils.encodeFlat(4, buf));
    };
    return ControllerManager;
}());
exports.ControllerManager = ControllerManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udHJvbGxlck1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvQ29udHJvbGxlck1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDBEQUErQztBQUMvQywyQ0FBMEM7QUFDMUMsNkNBQWlDO0FBRWpDO0lBVUU7UUFDRSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUMsQUFyQkQsSUFxQkM7QUEyQ1EsZ0NBQVU7QUF6Q25CO0lBRUUsMkJBQVksTUFBaUI7UUFDM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUNELHFDQUFTLEdBQVQsVUFBVSxVQUFzQjtRQUM5QixJQUFJLENBQUMsQ0FBQyxVQUFVLFlBQVksVUFBVSxDQUFDLEVBQUU7WUFDdkMsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBQ3pDO1FBQ0QsSUFBSSxlQUFlLEdBQUcsdUJBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO1FBQ2pELElBQUksV0FBVyxHQUFHLHVCQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUV6QyxJQUFJLE9BQU8sR0FBRyxJQUFJLHlCQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTVDLGVBQWUsQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QyxlQUFlLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDMUQsZUFBZSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BELGVBQWUsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwRCxlQUFlLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEQsZUFBZSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xELGVBQWUsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwRCxlQUFlLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEQsZUFBZSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVELGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV4RCxJQUFJLHVCQUF1QixHQUFHLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUxRSxXQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxRCxXQUFXLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLHVCQUF1QixDQUFDLENBQUM7UUFFakUsSUFBSSxtQkFBbUIsR0FBRyxlQUFlLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFdEUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBRXBDLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVqQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBdkNELElBdUNDO0FBRW9CLDhDQUFpQiJ9
//./dist/GameState.js
"use strict";
// This file is copied from RLBotJS by SuperVK. It is translated into typescript and some minor changes were made to make it compatible with this codebase.
exports.__esModule = true;
exports.GameState = exports.CarState = exports.GameInfoState = exports.BoostState = exports.BallState = exports.Physics = exports.Rotator = exports.Vector3 = void 0;
var flatbuffers_1 = require("flatbuffers");
var rlbot_generated_1 = require("./flat/rlbot_generated");
var flat = rlbot_generated_1.rlbot.flat;
var RotatorPartial = flat.RotatorPartial, DesiredPhysics = flat.DesiredPhysics, DesiredBallState = flat.DesiredBallState, DesiredCarState = flat.DesiredCarState, DesiredBoostState = flat.DesiredBoostState, DesiredGameInfoState = flat.DesiredGameInfoState, DesiredGameState = flat.DesiredGameState, Float = flat.Float, Vector3Partial = flat.Vector3Partial;
var Vector3 = /** @class */ (function () {
    function Vector3(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Vector3.prototype.convertToFlat = function (builder) {
        if (this.x == null && this.y == null && this.z == null)
            return null;
        return flat.Vector3.createVector3(builder, this.x, this.y, this.z);
    };
    Vector3.prototype.convertToFlatPartial = function (builder) {
        if (this.x == null && this.y == null && this.z == null)
            return null;
        Vector3Partial.startVector3Partial(builder);
        if (this.x != null)
            Vector3Partial.addX(builder, Float.createFloat(builder, this.x));
        if (this.y != null)
            Vector3Partial.addY(builder, Float.createFloat(builder, this.y));
        if (this.z != null)
            Vector3Partial.addZ(builder, Float.createFloat(builder, this.z));
        return Vector3Partial.endVector3Partial(builder);
    };
    return Vector3;
}());
exports.Vector3 = Vector3;
var Rotator = /** @class */ (function () {
    function Rotator(pitch, yaw, roll) {
        this.pitch = pitch;
        this.yaw = yaw;
        this.roll = roll;
    }
    Rotator.prototype.convertToFlat = function (builder) {
        if (this.pitch == null && this.yaw == null && this.roll == null)
            return null;
        RotatorPartial.startRotatorPartial(builder);
        if (this.pitch != null)
            RotatorPartial.addPitch(builder, Float.createFloat(builder, this.pitch));
        if (this.yaw != null)
            RotatorPartial.addYaw(builder, Float.createFloat(builder, this.yaw));
        if (this.roll != null)
            RotatorPartial.addRoll(builder, Float.createFloat(builder, this.roll));
        return RotatorPartial.endRotatorPartial(builder);
    };
    return Rotator;
}());
exports.Rotator = Rotator;
var Physics = /** @class */ (function () {
    function Physics(location, rotation, velocity, angularVelocity) {
        this.location = location;
        this.rotation = rotation;
        this.velocity = velocity;
        this.angularVelocity = angularVelocity;
    }
    Physics.prototype.convertToFlat = function (builder) {
        var locationFlat = this.location
            ? this.location.convertToFlatPartial(builder)
            : null;
        var rotationFlat = this.rotation
            ? this.rotation.convertToFlat(builder)
            : null;
        var velocityFlat = this.velocity
            ? this.velocity.convertToFlatPartial(builder)
            : null;
        var angularVelocityFlat = this.angularVelocity
            ? this.angularVelocity.convertToFlatPartial(builder)
            : null;
        if (locationFlat == null &&
            rotationFlat == null &&
            velocityFlat == null &&
            angularVelocityFlat == null)
            return null;
        DesiredPhysics.startDesiredPhysics(builder);
        if (locationFlat != null)
            DesiredPhysics.addLocation(builder, locationFlat);
        if (rotationFlat != null)
            DesiredPhysics.addRotation(builder, rotationFlat);
        if (velocityFlat != null)
            DesiredPhysics.addVelocity(builder, velocityFlat);
        if (angularVelocityFlat != null)
            DesiredPhysics.addAngularVelocity(builder, angularVelocityFlat);
        return DesiredPhysics.endDesiredPhysics(builder);
    };
    return Physics;
}());
exports.Physics = Physics;
var BallState = /** @class */ (function () {
    function BallState(physics) {
        this.physics = physics;
    }
    BallState.prototype.convertToFlat = function (builder) {
        var physicsFlat = this.physics ? this.physics.convertToFlat(builder) : null;
        if (physicsFlat == null)
            return null;
        else {
            DesiredBallState.startDesiredBallState(builder);
            DesiredBallState.addPhysics(builder, physicsFlat);
            return DesiredBallState.endDesiredBallState(builder);
        }
    };
    return BallState;
}());
exports.BallState = BallState;
var CarState = /** @class */ (function () {
    function CarState(physics, boostAmount, jumped, doubleJumped) {
        this.physics = physics;
        this.boostAmount = boostAmount;
        this.jumped = jumped;
        this.doubleJumped = doubleJumped;
    }
    CarState.prototype.convertToFlat = function (builder) {
        var physicsFlat = this.physics ? this.physics.convertToFlat(builder) : null;
        DesiredCarState.startDesiredCarState(builder);
        if (physicsFlat != null)
            DesiredCarState.addPhysics(builder, physicsFlat);
        if (this.boostAmount != null)
            DesiredCarState.addBoostAmount(builder, this.boostAmount);
        if (this.jumped != null)
            DesiredCarState.addJumped(builder, Number(this.jumped));
        if (this.doubleJumped != null)
            DesiredCarState.addDoubleJumped(builder, Number(this.doubleJumped));
        return DesiredCarState.endDesiredCarState(builder);
    };
    return CarState;
}());
exports.CarState = CarState;
var BoostState = /** @class */ (function () {
    function BoostState(respawnTime) {
        this.respawnTime = respawnTime;
    }
    BoostState.prototype.convertToFlat = function (builder) {
        DesiredBoostState.startDesiredBoostState(builder);
        if (this.respawnTime != null)
            DesiredBoostState.addRespawnTime(builder, this.respawnTime);
        return DesiredBoostState.endDesiredBoostState(builder);
    };
    return BoostState;
}());
exports.BoostState = BoostState;
var GameInfoState = /** @class */ (function () {
    function GameInfoState(worldGravityZ, gameSpeed) {
        this.worldGravityZ = worldGravityZ;
        this.gameSpeed = gameSpeed;
    }
    GameInfoState.prototype.convertToFlat = function (builder) {
        DesiredGameInfoState.startDesiredGameInfoState(builder);
        if (this.worldGravityZ != null)
            DesiredGameInfoState.addWorldGravityZ(builder, this.worldGravityZ);
        if (this.gameSpeed != null)
            DesiredGameInfoState.addGameSpeed(builder, this.gameSpeed);
        return DesiredGameInfoState.endDesiredGameInfoState(builder);
    };
    return GameInfoState;
}());
exports.GameInfoState = GameInfoState;
var GameState = /** @class */ (function () {
    function GameState(ballState, carStates, boostStates, gameInfoState) {
        this.ballState = ballState;
        this.carStates = carStates;
        this.boostStates = boostStates;
        this.gameInfoState = gameInfoState;
    }
    GameState.prototype.convertToFlat = function (builder) {
        if (builder == null)
            builder = new flatbuffers_1.flatbuffers.Builder(0);
        var ballStateFlat = this.ballState
            ? this.ballState.convertToFlat(builder)
            : null;
        var carStates = this.carStates ? [] : null;
        if (carStates != null) {
            for (var _i = 0, _a = this.carStates; _i < _a.length; _i++) {
                var carState = _a[_i];
                carStates.push(carState ? carState.convertToFlat(builder) : null);
            }
        }
        var carStatesFlat = carStates
            ? DesiredGameState.createCarStatesVector(builder, carStates)
            : null;
        var boostStates = this.boostStates ? [] : null;
        if (boostStates != null) {
            for (var _b = 0, _c = this.boostStates; _b < _c.length; _b++) {
                var boostState = _c[_b];
                boostStates.push(boostState ? boostState.convertToFlat(builder) : null);
            }
        }
        var boostStatesFlat = boostStates
            ? DesiredGameState.createBoostStatesVector(builder, boostStates)
            : null;
        var gameInfoStateFlat = this.gameInfoState
            ? this.gameInfoState.convertToFlat(builder)
            : null;
        DesiredGameState.startDesiredGameState(builder);
        if (ballStateFlat != null)
            DesiredGameState.addBallState(builder, ballStateFlat);
        if (carStatesFlat != null)
            DesiredGameState.addCarStates(builder, carStatesFlat);
        if (boostStatesFlat != null)
            DesiredGameState.addBoostStates(builder, boostStatesFlat);
        if (gameInfoStateFlat != null)
            DesiredGameState.addGameInfoState(builder, gameInfoStateFlat);
        return DesiredGameState.endDesiredGameState(builder);
    };
    return GameState;
}());
exports.GameState = GameState;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2FtZVN0YXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0dhbWVTdGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMkpBQTJKOzs7QUFFM0osMkNBQTBDO0FBQzFDLDBEQUErQztBQUMvQyxJQUFNLElBQUksR0FBRyx1QkFBSyxDQUFDLElBQUksQ0FBQztBQUV0QixJQUFBLGNBQWMsR0FTWixJQUFJLGVBVFEsRUFDZCxjQUFjLEdBUVosSUFBSSxlQVJRLEVBQ2QsZ0JBQWdCLEdBT2QsSUFBSSxpQkFQVSxFQUNoQixlQUFlLEdBTWIsSUFBSSxnQkFOUyxFQUNmLGlCQUFpQixHQUtmLElBQUksa0JBTFcsRUFDakIsb0JBQW9CLEdBSWxCLElBQUkscUJBSmMsRUFDcEIsZ0JBQWdCLEdBR2QsSUFBSSxpQkFIVSxFQUNoQixLQUFLLEdBRUgsSUFBSSxNQUZELEVBQ0wsY0FBYyxHQUNaLElBQUksZUFEUSxDQUNQO0FBRVQ7SUFJRSxpQkFBWSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDekMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUNELCtCQUFhLEdBQWIsVUFBYyxPQUE0QjtRQUN4QyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBQ3BFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUNELHNDQUFvQixHQUFwQixVQUFxQixPQUE0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
//./dist/GameStateManager.js
"use strict";
exports.__esModule = true;
exports.GameStateManager = void 0;
var rlbot_generated_1 = require("./flat/rlbot_generated");
var flatbuffers_1 = require("flatbuffers");
var GameStateManager = /** @class */ (function () {
    function GameStateManager(client) {
        this.gameState = null;
        this.client = client;
    }
    GameStateManager.prototype.get = function () {
        return this.gameState;
    };
    GameStateManager.prototype.set = function (newGameState) {
        this.gameState = newGameState;
        var controllerState = rlbot_generated_1.rlbot.flat.ControllerState;
        var playerInput = rlbot_generated_1.rlbot.flat.PlayerInput;
        var builder = new flatbuffers_1.flatbuffers.Builder(1024);
        this.client.ws.write();
    };
    return GameStateManager;
}());
exports.GameStateManager = GameStateManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2FtZVN0YXRlTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9HYW1lU3RhdGVNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLDBEQUErQztBQUMvQywyQ0FBMEM7QUFHMUM7SUFHRSwwQkFBWSxNQUFpQjtRQURyQixjQUFTLEdBQXFCLElBQUksQ0FBQztRQUV6QyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQsOEJBQUcsR0FBSDtRQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDO0lBQ0QsOEJBQUcsR0FBSCxVQUFJLFlBQXVCO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFDO1FBQzlCLElBQUksZUFBZSxHQUFHLHVCQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUNqRCxJQUFJLFdBQVcsR0FBRyx1QkFBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7UUFFekMsSUFBSSxPQUFPLEdBQUcsSUFBSSx5QkFBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBbEJELElBa0JDO0FBRVEsNENBQWdCIn0=
//./dist/QuickCdhats.js
"use strict";
// This file is copied from RLBotJS by SuperVK. It is translated into typescript and some minor changes were made to make it compatible with this codebase.
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    information: {
        IGotIt: 0,
        NeedBoost: 1,
        TakeTheShot: 2,
        Defending: 3,
        GoForIt: 4,
        Centering: 5,
        AllYours: 6,
        InPosition: 7,
        Incoming: 8,
        NiceShot: 9,
        GreatPass: 10,
        Thanks: 11,
        WhatASave: 12,
        NiceOne: 13,
        WhatAPlay: 14,
        GreatClear: 15,
        NiceBlock: 16,
    },
    compliments: {
        NiceShot: 9,
        GreatPass: 10,
        Thanks: 11,
        WhatASave: 12,
        NiceOne: 13,
        WhatAPlay: 14,
        GreatClear: 15,
        NiceBlock: 16,
    },
    reactions: {
        OMG: 17,
        Noooo: 18,
        Wow: 19,
        CloseOne: 20,
        NoWay: 21,
        HolyCow: 22,
        Whew: 23,
        Siiiick: 24,
        Calculated: 25,
        Savage: 26,
        Okay: 27,
    },
    apologies: {
        Cursing: 28,
        NoProblem: 29,
        Whoops: 30,
        Sorry: 31,
        MyBad: 32,
        Oops: 33,
        MyFault: 34,
    },
    postGame: {
        Gg: 35,
        WellPlayed: 36,
        ThatWasFun: 37,
        Rematch: 38,
        OneMoreGame: 39,
        WhatAGame: 40,
        NiceMoves: 41,
        EverybodyDance: 42,
    },
    custom: {
        /// Waste of CPU cycles
        Toxic_WasteCPU: 44,
        /// Git gud*
        Toxic_GitGut: 45,
        /// De-Allocate Yourself
        Toxic_DeAlloc: 46,
        /// 404: Your skill not found
        Toxic_404NoSkill: 47,
        /// Get a virus
        Toxic_CatchVirus: 48,
        /// Passing!
        Useful_Passing: 49,
        /// Faking!
        Useful_Faking: 50,
        /// Demoing!
        Useful_Demoing: 51,
        /// BOOPING
        Useful_Bumping: 52,
        /// The chances of that was 47525 to 1*
        Compliments_TinyChances: 53,
        /// Who upped your skill level?
        Compliments_SkillLevel: 54,
        /// Your programmer should be proud
        Compliments_proud: 55,
        /// You're the GC of Bots
        Compliments_GC: 56,
        /// Are you <Insert Pro>Bot? *
        Compliments_Pro: 57,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVpY2tDZGhhdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUXVpY2tDZGhhdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDJKQUEySjs7QUFFM0osa0JBQWU7SUFDYixXQUFXLEVBQUU7UUFDWCxNQUFNLEVBQUUsQ0FBQztRQUNULFNBQVMsRUFBRSxDQUFDO1FBQ1osV0FBVyxFQUFFLENBQUM7UUFDZCxTQUFTLEVBQUUsQ0FBQztRQUNaLE9BQU8sRUFBRSxDQUFDO1FBQ1YsU0FBUyxFQUFFLENBQUM7UUFDWixRQUFRLEVBQUUsQ0FBQztRQUNYLFVBQVUsRUFBRSxDQUFDO1FBQ2IsUUFBUSxFQUFFLENBQUM7UUFDWCxRQUFRLEVBQUUsQ0FBQztRQUNYLFNBQVMsRUFBRSxFQUFFO1FBQ2IsTUFBTSxFQUFFLEVBQUU7UUFDVixTQUFTLEVBQUUsRUFBRTtRQUNiLE9BQU8sRUFBRSxFQUFFO1FBQ1gsU0FBUyxFQUFFLEVBQUU7UUFDYixVQUFVLEVBQUUsRUFBRTtRQUNkLFNBQVMsRUFBRSxFQUFFO0tBQ2Q7SUFDRCxXQUFXLEVBQUU7UUFDWCxRQUFRLEVBQUUsQ0FBQztRQUNYLFNBQVMsRUFBRSxFQUFFO1FBQ2IsTUFBTSxFQUFFLEVBQUU7UUFDVixTQUFTLEVBQUUsRUFBRTtRQUNiLE9BQU8sRUFBRSxFQUFFO1FBQ1gsU0FBUyxFQUFFLEVBQUU7UUFDYixVQUFVLEVBQUUsRUFBRTtRQUNkLFNBQVMsRUFBRSxFQUFFO0tBQ2Q7SUFDRCxTQUFTLEVBQUU7UUFDVCxHQUFHLEVBQUUsRUFBRTtRQUNQLEtBQUssRUFBRSxFQUFFO1FBQ1QsR0FBRyxFQUFFLEVBQUU7UUFDUCxRQUFRLEVBQUUsRUFBRTtRQUNaLEtBQUssRUFBRSxFQUFFO1FBQ1QsT0FBTyxFQUFFLEVBQUU7UUFDWCxJQUFJLEVBQUUsRUFBRTtRQUNSLE9BQU8sRUFBRSxFQUFFO1FBQ1gsVUFBVSxFQUFFLEVBQUU7UUFDZCxNQUFNLEVBQUUsRUFBRTtRQUNWLElBQUksRUFBRSxFQUFFO0tBQ1Q7SUFDRCxTQUFTLEVBQUU7UUFDVCxPQUFPLEVBQUUsRUFBRTtRQUNYLFNBQVMsRUFBRSxFQUFFO1FBQ2IsTUFBTSxFQUFFLEVBQUU7UUFDVixLQUFLLEVBQUUsRUFBRTtRQUNULEtBQUssRUFBRSxFQUFFO1FBQ1QsSUFBSSxFQUFFLEVBQUU7UUFDUixPQUFPLEVBQUUsRUFBRTtLQUNaO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsRUFBRSxFQUFFLEVBQUU7UUFDTixVQUFVLEVBQUUsRUFBRTtRQUNkLFVBQVUsRUFBRSxFQUFFO1FBQ2QsT0FBTyxFQUFFLEVBQUU7UUFDWCxXQUFXLEVBQUUsRUFBRTtRQUNmLFNBQVMsRUFBRSxFQUFFO1FBQ2IsU0FBUyxFQUFFLEVBQUU7UUFDYixjQUFjLEVBQUUsRUFBRTtLQUNuQjtJQUNELE1BQU0sRUFBRTtRQUNOLHVCQUF1QjtRQUN2QixjQUFjLEVBQUUsRUFBRTtRQUNsQixZQUFZO1FBQ1osWUFBWSxFQUFFLEVBQUU7UUFDaEIsd0JBQXdCO1FBQ3hCLGFBQWEsRUFBRSxFQUFFO1FBQ2pCLDZCQUE2QjtRQUM3QixnQkFBZ0IsRUFBRSxFQUFFO1FBQ3BCLGVBQWU7UUFDZixnQkFBZ0IsRUFBRSxFQUFFO1FBQ3BCLFlBQVk7UUFDWixjQUFjLEVBQUUsRUFBRTtRQUNsQixXQUFXO1FBQ1gsYUFBYSxFQUFFLEVBQUU7UUFDakIsWUFBWTtRQUNaLGNBQWMsRUFBRSxFQUFFO1FBQ2xCLFdBQVc7UUFDWCxjQUFjLEVBQUUsRUFBRTtRQUNsQix1Q0FBdUM7UUFDdkMsdUJBQXVCLEVBQUUsRUFBRTtRQUMzQiwrQkFBK0I7UUFDL0Isc0JBQXNCLEVBQUUsRUFBRTtRQUMxQixtQ0FBbUM7UUFDbkMsaUJBQWlCLEVBQUUsRUFBRTtRQUNyQix5QkFBeUI7UUFDekIsY0FBYyxFQUFFLEVBQUU7UUFDbEIsOEJBQThCO1FBQzlCLGVBQWUsRUFBRSxFQUFFO0tBQ3BCO0NBQ0YsQ0FBQyJ9
//./dist/Quickchats.js
"use strict";
// This file is copied from RLBotJS by SuperVK. It is translated into typescript and some minor changes were made to make it compatible with this codebase.
exports.__esModule = true;
exports["default"] = {
    information: {
        IGotIt: 0,
        NeedBoost: 1,
        TakeTheShot: 2,
        Defending: 3,
        GoForIt: 4,
        Centering: 5,
        AllYours: 6,
        InPosition: 7,
        Incoming: 8,
        NiceShot: 9,
        GreatPass: 10,
        Thanks: 11,
        WhatASave: 12,
        NiceOne: 13,
        WhatAPlay: 14,
        GreatClear: 15,
        NiceBlock: 16
    },
    compliments: {
        NiceShot: 9,
        GreatPass: 10,
        Thanks: 11,
        WhatASave: 12,
        NiceOne: 13,
        WhatAPlay: 14,
        GreatClear: 15,
        NiceBlock: 16
    },
    reactions: {
        OMG: 17,
        Noooo: 18,
        Wow: 19,
        CloseOne: 20,
        NoWay: 21,
        HolyCow: 22,
        Whew: 23,
        Siiiick: 24,
        Calculated: 25,
        Savage: 26,
        Okay: 27
    },
    apologies: {
        Cursing: 28,
        NoProblem: 29,
        Whoops: 30,
        Sorry: 31,
        MyBad: 32,
        Oops: 33,
        MyFault: 34
    },
    postGame: {
        Gg: 35,
        WellPlayed: 36,
        ThatWasFun: 37,
        Rematch: 38,
        OneMoreGame: 39,
        WhatAGame: 40,
        NiceMoves: 41,
        EverybodyDance: 42
    },
    custom: {
        /// Waste of CPU cycles
        Toxic_WasteCPU: 44,
        /// Git gud*
        Toxic_GitGut: 45,
        /// De-Allocate Yourself
        Toxic_DeAlloc: 46,
        /// 404: Your skill not found
        Toxic_404NoSkill: 47,
        /// Get a virus
        Toxic_CatchVirus: 48,
        /// Passing!
        Useful_Passing: 49,
        /// Faking!
        Useful_Faking: 50,
        /// Demoing!
        Useful_Demoing: 51,
        /// BOOPING
        Useful_Bumping: 52,
        /// The chances of that was 47525 to 1*
        Compliments_TinyChances: 53,
        /// Who upped your skill level?
        Compliments_SkillLevel: 54,
        /// Your programmer should be proud
        Compliments_proud: 55,
        /// You're the GC of Bots
        Compliments_GC: 56,
        /// Are you <Insert Pro>Bot? *
        Compliments_Pro: 57
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVpY2tDaGF0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9RdWlja0NoYXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwySkFBMko7O0FBRTNKLHFCQUFlO0lBQ2IsV0FBVyxFQUFFO1FBQ1gsTUFBTSxFQUFFLENBQUM7UUFDVCxTQUFTLEVBQUUsQ0FBQztRQUNaLFdBQVcsRUFBRSxDQUFDO1FBQ2QsU0FBUyxFQUFFLENBQUM7UUFDWixPQUFPLEVBQUUsQ0FBQztRQUNWLFNBQVMsRUFBRSxDQUFDO1FBQ1osUUFBUSxFQUFFLENBQUM7UUFDWCxVQUFVLEVBQUUsQ0FBQztRQUNiLFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLENBQUM7UUFDWCxTQUFTLEVBQUUsRUFBRTtRQUNiLE1BQU0sRUFBRSxFQUFFO1FBQ1YsU0FBUyxFQUFFLEVBQUU7UUFDYixPQUFPLEVBQUUsRUFBRTtRQUNYLFNBQVMsRUFBRSxFQUFFO1FBQ2IsVUFBVSxFQUFFLEVBQUU7UUFDZCxTQUFTLEVBQUUsRUFBRTtLQUNkO0lBQ0QsV0FBVyxFQUFFO1FBQ1gsUUFBUSxFQUFFLENBQUM7UUFDWCxTQUFTLEVBQUUsRUFBRTtRQUNiLE1BQU0sRUFBRSxFQUFFO1FBQ1YsU0FBUyxFQUFFLEVBQUU7UUFDYixPQUFPLEVBQUUsRUFBRTtRQUNYLFNBQVMsRUFBRSxFQUFFO1FBQ2IsVUFBVSxFQUFFLEVBQUU7UUFDZCxTQUFTLEVBQUUsRUFBRTtLQUNkO0lBQ0QsU0FBUyxFQUFFO1FBQ1QsR0FBRyxFQUFFLEVBQUU7UUFDUCxLQUFLLEVBQUUsRUFBRTtRQUNULEdBQUcsRUFBRSxFQUFFO1FBQ1AsUUFBUSxFQUFFLEVBQUU7UUFDWixLQUFLLEVBQUUsRUFBRTtRQUNULE9BQU8sRUFBRSxFQUFFO1FBQ1gsSUFBSSxFQUFFLEVBQUU7UUFDUixPQUFPLEVBQUUsRUFBRTtRQUNYLFVBQVUsRUFBRSxFQUFFO1FBQ2QsTUFBTSxFQUFFLEVBQUU7UUFDVixJQUFJLEVBQUUsRUFBRTtLQUNUO0lBQ0QsU0FBUyxFQUFFO1FBQ1QsT0FBTyxFQUFFLEVBQUU7UUFDWCxTQUFTLEVBQUUsRUFBRTtRQUNiLE1BQU0sRUFBRSxFQUFFO1FBQ1YsS0FBSyxFQUFFLEVBQUU7UUFDVCxLQUFLLEVBQUUsRUFBRTtRQUNULElBQUksRUFBRSxFQUFFO1FBQ1IsT0FBTyxFQUFFLEVBQUU7S0FDWjtJQUNELFFBQVEsRUFBRTtRQUNSLEVBQUUsRUFBRSxFQUFFO1FBQ04sVUFBVSxFQUFFLEVBQUU7UUFDZCxVQUFVLEVBQUUsRUFBRTtRQUNkLE9BQU8sRUFBRSxFQUFFO1FBQ1gsV0FBVyxFQUFFLEVBQUU7UUFDZixTQUFTLEVBQUUsRUFBRTtRQUNiLFNBQVMsRUFBRSxFQUFFO1FBQ2IsY0FBYyxFQUFFLEVBQUU7S0FDbkI7SUFDRCxNQUFNLEVBQUU7UUFDTix1QkFBdUI7UUFDdkIsY0FBYyxFQUFFLEVBQUU7UUFDbEIsWUFBWTtRQUNaLFlBQVksRUFBRSxFQUFFO1FBQ2hCLHdCQUF3QjtRQUN4QixhQUFhLEVBQUUsRUFBRTtRQUNqQiw2QkFBNkI7UUFDN0IsZ0JBQWdCLEVBQUUsRUFBRTtRQUNwQixlQUFlO1FBQ2YsZ0JBQWdCLEVBQUUsRUFBRTtRQUNwQixZQUFZO1FBQ1osY0FBYyxFQUFFLEVBQUU7UUFDbEIsV0FBVztRQUNYLGFBQWEsRUFBRSxFQUFFO1FBQ2pCLFlBQVk7UUFDWixjQUFjLEVBQUUsRUFBRTtRQUNsQixXQUFXO1FBQ1gsY0FBYyxFQUFFLEVBQUU7UUFDbEIsdUNBQXVDO1FBQ3ZDLHVCQUF1QixFQUFFLEVBQUU7UUFDM0IsK0JBQStCO1FBQy9CLHNCQUFzQixFQUFFLEVBQUU7UUFDMUIsbUNBQW1DO1FBQ25DLGlCQUFpQixFQUFFLEVBQUU7UUFDckIseUJBQXlCO1FBQ3pCLGNBQWMsRUFBRSxFQUFFO1FBQ2xCLDhCQUE4QjtRQUM5QixlQUFlLEVBQUUsRUFBRTtLQUNwQjtDQUNGLENBQUMifQ==
//./dist/RenderManager.js
"use strict";
// This file is copied from RLBotJS by SuperVK. It is translated into typescript and some minor changes were made to make it compatible with this codebase.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Color = exports.RenderManager = void 0;
var crypto_1 = __importDefault(require("crypto"));
var flatbuffers_1 = require("flatbuffers");
var utils = __importStar(require("./utils"));
var rlbot_generated_1 = require("./flat/rlbot_generated");
var flat = rlbot_generated_1.rlbot.flat;
var RenderMessage = flat.RenderMessage, RenderType = flat.RenderType, RenderGroup = flat.RenderGroup;
var defaultGroupId = "default";
var maxInt = 1337;
var Color = /** @class */ (function () {
    function Color(alpha, red, green, blue) {
        this.alpha = alpha;
        this.red = red;
        this.green = green;
        this.blue = blue;
    }
    Color.prototype.convertToFlat = function (builder) {
        flat.Color.startColor(builder);
        flat.Color.addA(builder, this.alpha);
        flat.Color.addR(builder, this.red);
        flat.Color.addG(builder, this.green);
        flat.Color.addB(builder, this.blue);
        return flat.Color.endColor(builder);
    };
    return Color;
}());
exports.Color = Color;
var RenderManager = /** @class */ (function () {
    function RenderManager(botClient) {
        this.client = botClient;
        this.builder = null;
        this.index = this.client.botIndex;
        this.Color = Color;
        this.renderList = [];
        this.groupID = "";
    }
    RenderManager.prototype.beginRendering = function (groupID) {
        this.builder = new flatbuffers_1.flatbuffers.Builder(0);
        this.renderList = [];
        if (groupID)
            this.groupID = groupID;
    };
    RenderManager.prototype.endRendering = function () {
        if (this.groupID == undefined)
            this.groupID = "default";
        var hash = crypto_1["default"].createHash("sha256");
        hash.update(this.groupID + this.client.botIndex);
        var groupIDHashed = parseInt(hash.digest("hex"), 16) % maxInt;
        if (this.builder == null)
            return;
        var messages = RenderGroup.createRenderMessagesVector(this.builder, this.renderList);
        RenderGroup.startRenderGroup(this.builder);
        RenderGroup.addId(this.builder, groupIDHashed);
        RenderGroup.addRenderMessages(this.builder, messages);
        var result = RenderGroup.endRenderGroup(this.builder);
        this.builder.finish(result);
        var buf = this.builder.asUint8Array();
        this.client.ws.write(utils.encodeFlat(8, buf));
    };
    RenderManager.prototype.drawString2D = function (x, y, scaleX, scaleY, text, color) {
        if (this.builder == null)
            return;
        var textFlat = this.builder.createString(text);
        var colorFlat = color.convertToFlat(this.builder);
        RenderMessage.startRenderMessage(this.builder);
        RenderMessage.addRenderType(this.builder, RenderType.DrawString2D);
        RenderMessage.addColor(this.builder, colorFlat);
        RenderMessage.addStart(this.builder, flat.Vector3.createVector3(this.builder, x, y, 0));
        RenderMessage.addScaleX(this.builder, scaleX);
        RenderMessage.addScaleY(this.builder, scaleY);
        RenderMessage.addText(this.builder, textFlat);
        this.renderList.push(RenderMessage.endRenderMessage(this.builder));
    };
    RenderManager.prototype.drawString3D = function (vector, scaleX, scaleY, text, color) {
        var _a;
        if (this.builder == null)
            return;
        var textFlat = this.builder.createString(text);
        var colorFlat = color.convertToFlat(this.builder);
        RenderMessage.startRenderMessage(this.builder);
        RenderMessage.addRenderType(this.builder, RenderType.DrawString3D);
        RenderMessage.addColor(this.builder, colorFlat);
        RenderMessage.addStart(this.builder, (_a = vector.convertToFlat(this.builder)) !== null && _a !== void 0 ? _a : 0);
        RenderMessage.addScaleX(this.builder, scaleX);
        RenderMessage.addScaleY(this.builder, scaleY);
        RenderMessage.addText(this.builder, textFlat);
        this.renderList.push(RenderMessage.endRenderMessage(this.builder));
    };
    RenderManager.prototype.drawLine2D_3D = function (x, y, end, color) {
        var _a;
        if (this.builder == null)
            return;
        var colorFlat = color.convertToFlat(this.builder);
        RenderMessage.startRenderMessage(this.builder);
        RenderMessage.addRenderType(this.builder, RenderType.DrawLine2D_3D);
        RenderMessage.addStart(this.builder, flat.Vector3.createVector3(this.builder, x, y, 0));
        RenderMessage.addEnd(this.builder, (_a = end.convertToFlat(this.builder)) !== null && _a !== void 0 ? _a : 0);
        RenderMessage.addColor(this.builder, colorFlat !== null && colorFlat !== void 0 ? colorFlat : 0);
        this.renderList.push(RenderMessage.endRenderMessage(this.builder));
    };
    RenderManager.prototype.drawLine3D = function (start, end, color) {
        var _a, _b;
        if (this.builder == null)
            return;
        var colorFlat = color.convertToFlat(this.builder);
        RenderMessage.startRenderMessage(this.builder);
        RenderMessage.addRenderType(this.builder, RenderType.DrawLine3D);
        RenderMessage.addStart(this.builder, (_a = start.convertToFlat(this.builder)) !== null && _a !== void 0 ? _a : 0);
        RenderMessage.addEnd(this.builder, (_b = end.convertToFlat(this.builder)) !== null && _b !== void 0 ? _b : 0);
        RenderMessage.addColor(this.builder, colorFlat);
        this.renderList.push(RenderMessage.endRenderMessage(this.builder));
    };
    RenderManager.prototype.drawRect2D = function (x, y, width, height, filled, color) {
        if (this.builder == null)
            return;
        var colorFlat = color.convertToFlat(this.builder);
        RenderMessage.startRenderMessage(this.builder);
        RenderMessage.addRenderType(this.builder, RenderType.DrawRect2D);
        RenderMessage.addStart(this.builder, flat.Vector3.createVector3(this.builder, x, y, 0));
        RenderMessage.addScaleX(this.builder, width);
        RenderMessage.addScaleY(this.builder, height);
        RenderMessage.addIsFilled(this.builder, filled);
        RenderMessage.addColor(this.builder, colorFlat);
        this.renderList.push(RenderMessage.endRenderMessage(this.builder));
    };
    RenderManager.prototype.drawRect3D = function (vector, width, height, filled, color, centered) {
        var _a;
        if (this.builder == null)
            return;
        var colorFlat = color.convertToFlat(this.builder);
        RenderMessage.startRenderMessage(this.builder);
        RenderMessage.addRenderType(this.builder, centered ? RenderType.DrawCenteredRect3D : RenderType.DrawRect3D);
        RenderMessage.addStart(this.builder, (_a = vector.convertToFlat(this.builder)) !== null && _a !== void 0 ? _a : 0);
        RenderMessage.addScaleX(this.builder, width);
        RenderMessage.addScaleY(this.builder, height);
        RenderMessage.addIsFilled(this.builder, filled);
        RenderMessage.addColor(this.builder, colorFlat);
        this.renderList.push(RenderMessage.endRenderMessage(this.builder));
    };
    RenderManager.prototype.black = function () {
        return new this.Color(255, 0, 0, 0);
    };
    RenderManager.prototype.white = function () {
        return new this.Color(255, 255, 255, 255);
    };
    RenderManager.prototype.gray = function () {
        return new this.Color(255, 128, 128, 128);
    };
    RenderManager.prototype.blue = function () {
        return new this.Color(255, 0, 0, 255);
    };
    RenderManager.prototype.red = function () {
        return new this.Color(255, 255, 0, 0);
    };
    RenderManager.prototype.green = function () {
        return new this.Color(255, 0, 128, 0);
    };
    RenderManager.prototype.lime = function () {
        return new this.Color(255, 0, 255, 0);
    };
    RenderManager.prototype.yellow = function () {
        return new this.Color(255, 255, 255, 0);
    };
    RenderManager.prototype.orange = function () {
        return new this.Color(255, 225, 128, 0);
    };
    RenderManager.prototype.cyan = function () {
        return new this.Color(255, 0, 255, 255);
    };
    RenderManager.prototype.pink = function () {
        return new this.Color(255, 255, 0, 255);
    };
    RenderManager.prototype.purple = function () {
        return new this.Color(255, 128, 0, 128);
    };
    RenderManager.prototype.teal = function () {
        return new this.Color(255, 0, 128, 128);
    };
    return RenderManager;
}());
exports.RenderManager = RenderManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVuZGVyTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9SZW5kZXJNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwySkFBMko7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFM0osa0RBQTRCO0FBQzVCLDJDQUEwQztBQUUxQyw2Q0FBaUM7QUFDakMsMERBQStDO0FBRS9DLElBQU0sSUFBSSxHQUFHLHVCQUFLLENBQUMsSUFBSSxDQUFDO0FBQ2hCLElBQUEsYUFBYSxHQUE4QixJQUFJLGNBQWxDLEVBQUUsVUFBVSxHQUFrQixJQUFJLFdBQXRCLEVBQUUsV0FBVyxHQUFLLElBQUksWUFBVCxDQUFVO0FBQ3hELElBQU0sY0FBYyxHQUFHLFNBQVMsQ0FBQztBQUNqQyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFFcEI7SUFLRSxlQUFZLEtBQWEsRUFBRSxHQUFXLEVBQUUsS0FBYSxFQUFFLElBQVk7UUFDakUsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNuQixDQUFDO0lBQ0QsNkJBQWEsR0FBYixVQUFjLE9BQTRCO1FBQ3hDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JD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LE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCw0QkFBSSxHQUFKO1FBQ0UsT0FBTyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELDhCQUFNLEdBQU47UUFDRSxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsNEJBQUksR0FBSjtRQUNFLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUE1TkQsSUE0TkM7QUFFUSxzQ0FBYSJ9
//./dist/flat/flatstructs.js
"use strict";
// This file is copied from RLBotJS by SuperVK. It is translated into typescript and some big changes were made to make it compatible with this codebase.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.QuickChatSelection = exports.QuickChat = exports.LoadoutPaint = exports.Color = exports.PlayerLoadout = exports.PlayerClass = exports.RespawnTimeOption = exports.DemolishOption = exports.GravityOption = exports.BoostStrengthOption = exports.RumbleOption = exports.BoostOption = exports.BallBouncinessOption = exports.BallSizeOption = exports.BallWeightOption = exports.BallTypeOption = exports.BallMaxSpeedOption = exports.GameSpeedOption = exports.SeriesLengthOption = exports.OvertimeOption = exports.MaxScore = exports.MatchLength = exports.ExistingMatchBehavior = exports.MutatorSettings = exports.GameMap = exports.GameMode = exports.PlayerConfiguration = exports.MatchSettings = exports.FieldInfo = exports.GoalInfo = exports.BoostPad = exports.BallPrediction = exports.GameTickPacket = exports.TeamInfo = exports.BoostPadState = exports.PlayerInfo = exports.GameInfo = exports.BallInfo = exports.Touch = exports.Physics = exports.Rotator = exports.Vector3 = void 0;
var Vector3 = /** @class */ (function () {
    function Vector3(flat) {
        this.x = flat.x();
        this.y = flat.y();
        this.z = flat.z();
    }
    return Vector3;
}());
exports.Vector3 = Vector3;
var Rotator = /** @class */ (function () {
    function Rotator(flat) {
        this.pitch = flat.pitch();
        this.yaw = flat.yaw();
        this.roll = flat.roll();
    }
    return Rotator;
}());
exports.Rotator = Rotator;
var Physics = /** @class */ (function () {
    function Physics(flat) {
        this.location = new Vector3(flat.location());
        this.rotation = flat.rotation() ? new Rotator(flat.rotation()) : null;
        this.velocity = new Vector3(flat.velocity());
        this.angularVelocity = new Vector3(flat.angularVelocity());
    }
    return Physics;
}());
exports.Physics = Physics;
var Touch = /** @class */ (function () {
    function Touch(flat) {
        this.playerName = flat.playerName();
        this.gameSeconds = flat.gameSeconds();
        this.location = new Vector3(flat.location());
        this.normal = new Vector3(flat.normal());
        this.team = flat.team();
        this.playerIndex = flat.playerIndex();
    }
    return Touch;
}());
exports.Touch = Touch;
var DropShotBallInfo = /** @class */ (function () {
    function DropShotBallInfo(flat) {
        this.absorbedForce = flat.absorbedForce();
        this.damageIndex = flat.damageIndex();
        this.forceAccumRecent = flat.forceAccumRecent();
    }
    return DropShotBallInfo;
}());
var BallInfo = /** @class */ (function () {
    function BallInfo(flat) {
        this.physics = new Physics(flat.physics());
        this.latestTouch = flat.latestTouch()
            ? new Touch(flat.latestTouch())
            : null;
        this.dropShotInfo = new DropShotBallInfo(flat.dropShotInfo());
    }
    return BallInfo;
}());
exports.BallInfo = BallInfo;
var GameInfo = /** @class */ (function () {
    function GameInfo(flat) {
        this.secondsElapsed = flat.secondsElapsed();
        this.gameTimeRemaining = flat.gameTimeRemaining();
        this.isOvertime = flat.isOvertime();
        this.isRoundActive = flat.isRoundActive();
        this.isKickoffPause = flat.isKickoffPause();
        this.isMatchEnded = flat.isMatchEnded();
        this.worldGravityZ = flat.worldGravityZ();
        this.gameSpeed = flat.gameSpeed();
        this.frameNum = flat.frameNum();
    }
    return GameInfo;
}());
exports.GameInfo = GameInfo;
var ScoreInfo = /** @class */ (function () {
    function ScoreInfo(flat) {
        this.score = flat.score();
        this.goals = flat.goals();
        this.ownGoals = flat.ownGoals();
        this.assists = flat.assists();
        this.saves = flat.saves();
        this.shots = flat.shots();
        this.demolitions = flat.demolitions();
    }
    return ScoreInfo;
}());
var PlayerInfo = /** @class */ (function () {
    function PlayerInfo(flat) {
        this.physics = new Physics(flat.physics());
        this.scoreInfo = new ScoreInfo(flat.scoreInfo());
        this.isDemolished = flat.isDemolished();
        this.hasWheelContact = flat.hasWheelContact();
        this.isSupersonic = flat.isSupersonic();
        this.isBot = flat.isBot();
        this.jumped = flat.jumped();
        this.doubleJumped = flat.doubleJumped();
        this.name = flat.name();
        this.boost = flat.boost();
        this.team = flat.team();
    }
    return PlayerInfo;
}());
exports.PlayerInfo = PlayerInfo;
var BoostPadState = /** @class */ (function () {
    function BoostPadState(flat) {
        this.isActive = flat.isActive();
        this.timer = flat.timer();
    }
    return BoostPadState;
}());
exports.BoostPadState = BoostPadState;
var TeamInfo = /** @class */ (function () {
    function TeamInfo(flat) {
        this.teamIndex = flat.teamIndex();
        this.score = flat.score();
    }
    return TeamInfo;
}());
exports.TeamInfo = TeamInfo;
var DropshotTile = /** @class */ (function () {
    function DropshotTile(flat) {
        this.tileState = flat.tileState();
    }
    return DropshotTile;
}());
var GameTickPacket = /** @class */ (function () {
    function GameTickPacket(flat) {
        this.players = [];
        for (var p = 0; p < flat.playersLength(); p++) {
            this.players.push(new PlayerInfo(flat.players(p)));
        }
        this.boostPadStates = [];
        for (var b = 0; b < flat.boostPadStatesLength(); b++) {
            this.boostPadStates.push(new BoostPadState(flat.boostPadStates(b)));
        }
        this.ball = flat.ball() ? new BallInfo(flat.ball()) : null;
        this.gameInfo = flat.gameInfo()
            ? new GameInfo(flat.gameInfo(flat.gameInfo()))
            : null;
        this.tileInformation = [];
        for (var t = 0; t < flat.tileInformationLength(); t++) {
            this.tileInformation.push(new DropshotTile(flat.tileInformation(t)));
        }
        this.teams = [];
        for (var t = 0; t < flat.teamsLength(); t++) {
            this.teams.push(new TeamInfo(flat.teams(t)));
        }
    }
    return GameTickPacket;
}());
exports.GameTickPacket = GameTickPacket;
var PredictionSlice = /** @class */ (function () {
    function PredictionSlice(flat) {
        this.gameSeconds = flat.gameSeconds();
        this.physics = new Physics(flat.physics());
    }
    return PredictionSlice;
}());
var BallPrediction = /** @class */ (function () {
    function BallPrediction(flat) {
        this.slices = [];
        for (var s = 0; s < flat.slicesLength(); s++) {
            this.slices.push(new PredictionSlice(flat.slices(s)));
        }
    }
    return BallPrediction;
}());
exports.BallPrediction = BallPrediction;
var BoostPad = /** @class */ (function () {
    function BoostPad(flat) {
        this.location = new Vector3(flat.location());
        this.isFullBoost = flat.isFullBoost();
    }
    return BoostPad;
}());
exports.BoostPad = BoostPad;
var GoalInfo = /** @class */ (function () {
    function GoalInfo(flat) {
        this.teamNum = flat.teamNum();
        this.location = new Vector3(flat.location());
        this.direction = new Vector3(flat.direction());
    }
    return GoalInfo;
}());
exports.GoalInfo = GoalInfo;
var FieldInfo = /** @class */ (function () {
    function FieldInfo(flat) {
        this.boostPads = [];
        for (var b = 0; b < flat.boostPadsLength(); b++) {
            this.boostPads.push(new BoostPad(flat.boostPads(b)));
        }
        this.goals = [];
        for (var g = 0; g < flat.goalsLength(); g++) {
            this.goals.push(new GoalInfo(flat.goals(g)));
        }
    }
    return FieldInfo;
}());
exports.FieldInfo = FieldInfo;
var RLBotPlayer = /** @class */ (function () {
    function RLBotPlayer() {
    }
    return RLBotPlayer;
}());
var HumanPlayer = /** @class */ (function () {
    function HumanPlayer() {
    }
    return HumanPlayer;
}());
var PsyonixBotPlayer = /** @class */ (function () {
    function PsyonixBotPlayer(flat) {
        this.botSkill = flat.botSkill();
    }
    return PsyonixBotPlayer;
}());
var PartyMemberBotPlayer = /** @class */ (function () {
    function PartyMemberBotPlayer() {
    }
    return PartyMemberBotPlayer;
}());
var PlayerClass = /** @class */ (function (_super) {
    __extends(PlayerClass, _super);
    function PlayerClass(flat) {
        return _super.call(this, flat) || this;
    }
    return PlayerClass;
}(PsyonixBotPlayer));
exports.PlayerClass = PlayerClass;
var LoadoutPaint = /** @class */ (function () {
    function LoadoutPaint(flat) {
        this.carPaintId = flat.carPaintId();
        this.decalPaintId = flat.decalPaintId();
        this.wheelsPaintId = flat.wheelsPaintId();
        this.boostPaintId = flat.boostPaintId();
        this.antennaPaintId = flat.antennaPaintId();
        this.hatPaintId = flat.hatPaintId();
        this.trailsPaintId = flat.trailsPaintId();
        this.goalExplosionPaintId = flat.goalExplosionPaintId();
    }
    return LoadoutPaint;
}());
exports.LoadoutPaint = LoadoutPaint;
var Color = /** @class */ (function () {
    function Color(flat) {
        this.a = flat.a();
        this.r = flat.b();
        (this.g = flat.g()), (this.b = flat.b());
    }
    return Color;
}());
exports.Color = Color;
var PlayerLoadout = /** @class */ (function () {
    function PlayerLoadout(flat) {
        this.teamColorId = flat.teamColorId();
        this.customColorId = flat.customColorId();
        this.carId = flat.carId();
        this.decalId = flat.decalId();
        this.wheelsId = flat.wheelsId();
        this.boostId = flat.boostId();
        this.antennaId = flat.antennaId();
        this.hatId = flat.hatId();
        this.paintFinishId = flat.paintFinishedId();
        this.customFinishId = flat.customFinishId();
        this.engineAudioId = flat.engineAudioId();
        this.trailsId = flat.trailsId();
        this.goalExplosionId = flat.goalExplosionId();
        this.loadoutPaint = new LoadoutPaint(flat.loadoutPaint());
        this.primaryColorLookup = new Color(flat.primaryColorLookup());
        this.secondaryColorLookup = new Color(flat.secondaryColorLookup());
    }
    return PlayerLoadout;
}());
exports.PlayerLoadout = PlayerLoadout;
var PlayerConfiguration = /** @class */ (function () {
    function PlayerConfiguration(flat) {
        this.variety = new PlayerClass(flat.variety());
        this.name = flat.name();
        this.team = flat.team();
        this.loadout = new PlayerLoadout(flat.loadout());
        this.spawnId = flat.spawnId();
    }
    return PlayerConfiguration;
}());
exports.PlayerConfiguration = PlayerConfiguration;
var GameMode;
(function (GameMode) {
    GameMode[GameMode["Soccer"] = 0] = "Soccer";
    GameMode[GameMode["Hoops"] = 1] = "Hoops";
    GameMode[GameMode["Dropshot"] = 2] = "Dropshot";
    GameMode[GameMode["Hockey"] = 3] = "Hockey";
    GameMode[GameMode["Rumble"] = 4] = "Rumble";
    GameMode[GameMode["Heatseeker"] = 5] = "Heatseeker";
})(GameMode || (GameMode = {}));
exports.GameMode = GameMode;
var GameMap;
(function (GameMap) {
    GameMap[GameMap["DFHStadium"] = 0] = "DFHStadium";
    GameMap[GameMap["Mannfield"] = 1] = "Mannfield";
    GameMap[GameMap["ChampionsField"] = 2] = "ChampionsField";
    GameMap[GameMap["UrbanCentral"] = 3] = "UrbanCentral";
    GameMap[GameMap["BeckwithPark"] = 4] = "BeckwithPark";
    GameMap[GameMap["UtopiaColiseum"] = 5] = "UtopiaColiseum";
    GameMap[GameMap["Wasteland"] = 6] = "Wasteland";
    GameMap[GameMap["NeoTokyo"] = 7] = "NeoTokyo";
    GameMap[GameMap["AquaDome"] = 8] = "AquaDome";
    GameMap[GameMap["StarbaseArc"] = 9] = "StarbaseArc";
    GameMap[GameMap["Farmstead"] = 10] = "Farmstead";
    GameMap[GameMap["SaltyShores"] = 11] = "SaltyShores";
    GameMap[GameMap["DFHStadium_Stormy"] = 12] = "DFHStadium_Stormy";
    GameMap[GameMap["DFHStadium_Day"] = 13] = "DFHStadium_Day";
    GameMap[GameMap["Mannfield_Stormy"] = 14] = "Mannfield_Stormy";
    GameMap[GameMap["Mannfield_Night"] = 15] = "Mannfield_Night";
    GameMap[GameMap["ChampionsField_Day"] = 16] = "ChampionsField_Day";
    GameMap[GameMap["BeckwithPark_Stormy"] = 17] = "BeckwithPark_Stormy";
    GameMap[GameMap["BeckwithPark_Midnight"] = 18] = "BeckwithPark_Midnight";
    GameMap[GameMap["UrbanCentral_Night"] = 19] = "UrbanCentral_Night";
    GameMap[GameMap["UrbanCentral_Dawn"] = 20] = "UrbanCentral_Dawn";
    GameMap[GameMap["UtopiaColiseum_Dusk"] = 21] = "UtopiaColiseum_Dusk";
    GameMap[GameMap["DFHStadium_Snowy"] = 22] = "DFHStadium_Snowy";
    GameMap[GameMap["Mannfield_Snowy"] = 23] = "Mannfield_Snowy";
    GameMap[GameMap["UtopiaColiseum_Snowy"] = 24] = "UtopiaColiseum_Snowy";
    GameMap[GameMap["Badlands"] = 25] = "Badlands";
    GameMap[GameMap["Badlands_Night"] = 26] = "Badlands_Night";
    GameMap[GameMap["TokyoUnderpass"] = 27] = "TokyoUnderpass";
    GameMap[GameMap["Arctagon"] = 28] = "Arctagon";
    GameMap[GameMap["Pillars"] = 29] = "Pillars";
    GameMap[GameMap["Cosmic"] = 30] = "Cosmic";
    GameMap[GameMap["DoubleGoal"] = 31] = "DoubleGoal";
    GameMap[GameMap["Octagon"] = 32] = "Octagon";
    GameMap[GameMap["Underpass"] = 33] = "Underpass";
    GameMap[GameMap["UtopiaRetro"] = 34] = "UtopiaRetro";
    GameMap[GameMap["Hoops_DunkHouse"] = 35] = "Hoops_DunkHouse";
    GameMap[GameMap["DropShot_Core707"] = 36] = "DropShot_Core707";
    GameMap[GameMap["ThrowbackStadium"] = 37] = "ThrowbackStadium";
    GameMap[GameMap["ForbiddenTemple"] = 38] = "ForbiddenTemple";
    GameMap[GameMap["RivalsArena"] = 39] = "RivalsArena";
    GameMap[GameMap["Farmstead_Night"] = 40] = "Farmstead_Night";
    GameMap[GameMap["SaltyShores_Night"] = 41] = "SaltyShores_Night";
})(GameMap || (GameMap = {}));
exports.GameMap = GameMap;
var MatchLength;
(function (MatchLength) {
    MatchLength[MatchLength["Five_Minutes"] = 0] = "Five_Minutes";
    MatchLength[MatchLength["Ten_Minutes"] = 1] = "Ten_Minutes";
    MatchLength[MatchLength["Twenty_Minutes"] = 2] = "Twenty_Minutes";
    MatchLength[MatchLength["Unlimited"] = 3] = "Unlimited";
})(MatchLength || (MatchLength = {}));
exports.MatchLength = MatchLength;
var MaxScore;
(function (MaxScore) {
    MaxScore[MaxScore["Unlimited"] = 0] = "Unlimited";
    MaxScore[MaxScore["One_Goal"] = 1] = "One_Goal";
    MaxScore[MaxScore["Three_Goals"] = 2] = "Three_Goals";
    MaxScore[MaxScore["Five_Goals"] = 3] = "Five_Goals";
})(MaxScore || (MaxScore = {}));
exports.MaxScore = MaxScore;
var OvertimeOption;
(function (OvertimeOption) {
    OvertimeOption[OvertimeOption["Unlimited"] = 0] = "Unlimited";
    OvertimeOption[OvertimeOption["Five_Max_First_Score"] = 1] = "Five_Max_First_Score";
    OvertimeOption[OvertimeOption["Five_Max_Random_Team"] = 2] = "Five_Max_Random_Team";
})(OvertimeOption || (OvertimeOption = {}));
exports.OvertimeOption = OvertimeOption;
var SeriesLengthOption;
(function (SeriesLengthOption) {
    SeriesLengthOption[SeriesLengthOption["Unlimited"] = 0] = "Unlimited";
    SeriesLengthOption[SeriesLengthOption["Three_Games"] = 1] = "Three_Games";
    SeriesLengthOption[SeriesLengthOption["Five_Games"] = 2] = "Five_Games";
    SeriesLengthOption[SeriesLengthOption["Seven_Games"] = 3] = "Seven_Games";
})(SeriesLengthOption || (SeriesLengthOption = {}));
exports.SeriesLengthOption = SeriesLengthOption;
var GameSpeedOption;
(function (GameSpeedOption) {
    GameSpeedOption[GameSpeedOption["Default"] = 0] = "Default";
    GameSpeedOption[GameSpeedOption["Slo_Mo"] = 1] = "Slo_Mo";
    GameSpeedOption[GameSpeedOption["Time_Warp"] = 2] = "Time_Warp";
})(GameSpeedOption || (GameSpeedOption = {}));
exports.GameSpeedOption = GameSpeedOption;
var BallMaxSpeedOption;
(function (BallMaxSpeedOption) {
    BallMaxSpeedOption[BallMaxSpeedOption["Default"] = 0] = "Default";
    BallMaxSpeedOption[BallMaxSpeedOption["Slow"] = 1] = "Slow";
    BallMaxSpeedOption[BallMaxSpeedOption["Fast"] = 2] = "Fast";
    BallMaxSpeedOption[BallMaxSpeedOption["Super_Fast"] = 3] = "Super_Fast";
})(BallMaxSpeedOption || (BallMaxSpeedOption = {}));
exports.BallMaxSpeedOption = BallMaxSpeedOption;
var BallTypeOption;
(function (BallTypeOption) {
    BallTypeOption[BallTypeOption["Default"] = 0] = "Default";
    BallTypeOption[BallTypeOption["Cube"] = 1] = "Cube";
    BallTypeOption[BallTypeOption["Puck"] = 2] = "Puck";
    BallTypeOption[BallTypeOption["Basketball"] = 3] = "Basketball";
})(BallTypeOption || (BallTypeOption = {}));
exports.BallTypeOption = BallTypeOption;
var BallWeightOption;
(function (BallWeightOption) {
    BallWeightOption[BallWeightOption["Default"] = 0] = "Default";
    BallWeightOption[BallWeightOption["Light"] = 1] = "Light";
    BallWeightOption[BallWeightOption["Heavy"] = 2] = "Heavy";
    BallWeightOption[BallWeightOption["Super_Light"] = 3] = "Super_Light";
})(BallWeightOption || (BallWeightOption = {}));
exports.BallWeightOption = BallWeightOption;
var BallSizeOption;
(function (BallSizeOption) {
    BallSizeOption[BallSizeOption["Default"] = 0] = "Default";
    BallSizeOption[BallSizeOption["Small"] = 1] = "Small";
    BallSizeOption[BallSizeOption["Large"] = 2] = "Large";
    BallSizeOption[BallSizeOption["Gigantic"] = 3] = "Gigantic";
})(BallSizeOption || (BallSizeOption = {}));
exports.BallSizeOption = BallSizeOption;
var BallBouncinessOption;
(function (BallBouncinessOption) {
    BallBouncinessOption[BallBouncinessOption["Default"] = 0] = "Default";
    BallBouncinessOption[BallBouncinessOption["Low"] = 1] = "Low";
    BallBouncinessOption[BallBouncinessOption["High"] = 2] = "High";
    BallBouncinessOption[BallBouncinessOption["Super_High"] = 3] = "Super_High";
})(BallBouncinessOption || (BallBouncinessOption = {}));
exports.BallBouncinessOption = BallBouncinessOption;
var BoostOption;
(function (BoostOption) {
    BoostOption[BoostOption["Normal_Boost"] = 0] = "Normal_Boost";
    BoostOption[BoostOption["Unlimited_Boost"] = 1] = "Unlimited_Boost";
    BoostOption[BoostOption["Slow_Recharge"] = 2] = "Slow_Recharge";
    BoostOption[BoostOption["Rapid_Recharge"] = 3] = "Rapid_Recharge";
    BoostOption[BoostOption["No_Boost"] = 4] = "No_Boost";
})(BoostOption || (BoostOption = {}));
exports.BoostOption = BoostOption;
var RumbleOption;
(function (RumbleOption) {
    RumbleOption[RumbleOption["No_Rumble"] = 0] = "No_Rumble";
    RumbleOption[RumbleOption["Default"] = 1] = "Default";
    RumbleOption[RumbleOption["Slow"] = 2] = "Slow";
    RumbleOption[RumbleOption["Civilized"] = 3] = "Civilized";
    RumbleOption[RumbleOption["Destruction_Derby"] = 4] = "Destruction_Derby";
    RumbleOption[RumbleOption["Spring_Loaded"] = 5] = "Spring_Loaded";
    RumbleOption[RumbleOption["Spikes_Only"] = 6] = "Spikes_Only";
    RumbleOption[RumbleOption["Spike_Rush"] = 7] = "Spike_Rush";
})(RumbleOption || (RumbleOption = {}));
exports.RumbleOption = RumbleOption;
var BoostStrengthOption;
(function (BoostStrengthOption) {
    BoostStrengthOption[BoostStrengthOption["One"] = 0] = "One";
    BoostStrengthOption[BoostStrengthOption["OneAndAHalf"] = 1] = "OneAndAHalf";
    BoostStrengthOption[BoostStrengthOption["Two"] = 2] = "Two";
    BoostStrengthOption[BoostStrengthOption["Ten"] = 3] = "Ten";
})(BoostStrengthOption || (BoostStrengthOption = {}));
exports.BoostStrengthOption = BoostStrengthOption;
var GravityOption;
(function (GravityOption) {
    GravityOption[GravityOption["Default"] = 0] = "Default";
    GravityOption[GravityOption["Low"] = 1] = "Low";
    GravityOption[GravityOption["High"] = 2] = "High";
    GravityOption[GravityOption["Super_High"] = 3] = "Super_High";
})(GravityOption || (GravityOption = {}));
exports.GravityOption = GravityOption;
var DemolishOption;
(function (DemolishOption) {
    DemolishOption[DemolishOption["Default"] = 0] = "Default";
    DemolishOption[DemolishOption["Disabled"] = 1] = "Disabled";
    DemolishOption[DemolishOption["Friendly_Fire"] = 2] = "Friendly_Fire";
    DemolishOption[DemolishOption["On_Contact"] = 3] = "On_Contact";
    DemolishOption[DemolishOption["On_Contact_FF"] = 4] = "On_Contact_FF";
})(DemolishOption || (DemolishOption = {}));
exports.DemolishOption = DemolishOption;
var RespawnTimeOption;
(function (RespawnTimeOption) {
    RespawnTimeOption[RespawnTimeOption["Three_Seconds"] = 0] = "Three_Seconds";
    RespawnTimeOption[RespawnTimeOption["Two_Seconds"] = 1] = "Two_Seconds";
    RespawnTimeOption[RespawnTimeOption["One_Seconds"] = 2] = "One_Seconds";
    RespawnTimeOption[RespawnTimeOption["Disable_Goal_Reset"] = 3] = "Disable_Goal_Reset";
})(RespawnTimeOption || (RespawnTimeOption = {}));
exports.RespawnTimeOption = RespawnTimeOption;
var MutatorSettings = /** @class */ (function () {
    function MutatorSettings(flat) {
        this.matchLength = flat.matchLength();
        this.maxScore = flat.maxScore();
        this.overtimeOption = flat.overtimeOption();
        this.seriesLengthOption = flat.seriesLengthOption();
        this.gameSpeedOption = flat.gameSpeedOption();
        this.ballMaxSpeedOption = flat.ballMaxSpeedOption();
        this.ballTypeOption = flat.ballTypeOption();
        this.ballWeightOption = flat.ballWeightOption();
        this.ballSizeOption = flat.ballSizeOption();
        this.ballBouncinessOption = flat.ballBouncinessOption();
        this.boostOption = flat.boostOption();
        this.rumbleOption = flat.rumbleOption();
        this.boostStrengthOption = flat.boostStrengthOption();
        this.gravityOption = flat.gravityOption();
        this.demolishOption = flat.demolishOption();
        this.respawnTimeOption = flat.respawnTimeOption();
    }
    return MutatorSettings;
}());
exports.MutatorSettings = MutatorSettings;
var ExistingMatchBehavior;
(function (ExistingMatchBehavior) {
    /// Restart the match if any match settings differ. This is the default because old RLBot always worked this way.
    ExistingMatchBehavior[ExistingMatchBehavior["Restart_If_Different"] = 0] = "Restart_If_Different";
    /// Always restart the match, even if config is identical
    ExistingMatchBehavior[ExistingMatchBehavior["Restart"] = 1] = "Restart";
    /// Never restart an existing match, just try to remove or spawn cars to match the configuration.
    /// If we are not in the middle of a match, a match will be started. Handy for LAN matches.
    ExistingMatchBehavior[ExistingMatchBehavior["Continue_And_Spawn"] = 2] = "Continue_And_Spawn";
})(ExistingMatchBehavior || (ExistingMatchBehavior = {}));
exports.ExistingMatchBehavior = ExistingMatchBehavior;
var MatchSettings = /** @class */ (function () {
    function MatchSettings(flat) {
        this.playerConfigurations = [];
        for (var _i = 0, _a = flat.playerConfigurations(); _i < _a.length; _i++) {
            var pc = _a[_i];
            this.playerConfigurations.push(new PlayerConfiguration(pc));
        }
        this.gameMode = flat.gameMode();
        this.gameMap = flat.gameMap();
        this.skipReplays = flat.skipReplays();
        this.instantStart = flat.instantStart();
        this.mutatorSettings = new MutatorSettings(flat.mutatorSettings());
        this.existingMatchBehavior = flat.existingMatchBehavior();
        this.enableLockstep = flat.enableLockstep();
        this.enableRendering = flat.enableRendering();
        this.enableStateSetting = flat.enableStateSetting();
        this.autoSaveReplay = flat.autoSaveReplay();
    }
    return MatchSettings;
}());
exports.MatchSettings = MatchSettings;
var QuickChatSelection;
(function (QuickChatSelection) {
    QuickChatSelection[QuickChatSelection["Information_IGotIt"] = 0] = "Information_IGotIt";
    QuickChatSelection[QuickChatSelection["Information_NeedBoost"] = 1] = "Information_NeedBoost";
    QuickChatSelection[QuickChatSelection["Information_TakeTheShot"] = 2] = "Information_TakeTheShot";
    QuickChatSelection[QuickChatSelection["Information_Defending"] = 3] = "Information_Defending";
    QuickChatSelection[QuickChatSelection["Information_GoForIt"] = 4] = "Information_GoForIt";
    QuickChatSelection[QuickChatSelection["Information_Centering"] = 5] = "Information_Centering";
    QuickChatSelection[QuickChatSelection["Information_AllYours"] = 6] = "Information_AllYours";
    QuickChatSelection[QuickChatSelection["Information_InPosition"] = 7] = "Information_InPosition";
    QuickChatSelection[QuickChatSelection["Information_Incoming"] = 8] = "Information_Incoming";
    QuickChatSelection[QuickChatSelection["Compliments_NiceShot"] = 9] = "Compliments_NiceShot";
    QuickChatSelection[QuickChatSelection["Compliments_GreatPass"] = 10] = "Compliments_GreatPass";
    QuickChatSelection[QuickChatSelection["Compliments_Thanks"] = 11] = "Compliments_Thanks";
    QuickChatSelection[QuickChatSelection["Compliments_WhatASave"] = 12] = "Compliments_WhatASave";
    QuickChatSelection[QuickChatSelection["Compliments_NiceOne"] = 13] = "Compliments_NiceOne";
    QuickChatSelection[QuickChatSelection["Compliments_WhatAPlay"] = 14] = "Compliments_WhatAPlay";
    QuickChatSelection[QuickChatSelection["Compliments_GreatClear"] = 15] = "Compliments_GreatClear";
    QuickChatSelection[QuickChatSelection["Compliments_NiceBlock"] = 16] = "Compliments_NiceBlock";
    QuickChatSelection[QuickChatSelection["Reactions_OMG"] = 17] = "Reactions_OMG";
    QuickChatSelection[QuickChatSelection["Reactions_Noooo"] = 18] = "Reactions_Noooo";
    QuickChatSelection[QuickChatSelection["Reactions_Wow"] = 19] = "Reactions_Wow";
    QuickChatSelection[QuickChatSelection["Reactions_CloseOne"] = 20] = "Reactions_CloseOne";
    QuickChatSelection[QuickChatSelection["Reactions_NoWay"] = 21] = "Reactions_NoWay";
    QuickChatSelection[QuickChatSelection["Reactions_HolyCow"] = 22] = "Reactions_HolyCow";
    QuickChatSelection[QuickChatSelection["Reactions_Whew"] = 23] = "Reactions_Whew";
    QuickChatSelection[QuickChatSelection["Reactions_Siiiick"] = 24] = "Reactions_Siiiick";
    QuickChatSelection[QuickChatSelection["Reactions_Calculated"] = 25] = "Reactions_Calculated";
    QuickChatSelection[QuickChatSelection["Reactions_Savage"] = 26] = "Reactions_Savage";
    QuickChatSelection[QuickChatSelection["Reactions_Okay"] = 27] = "Reactions_Okay";
    QuickChatSelection[QuickChatSelection["Apologies_Cursing"] = 28] = "Apologies_Cursing";
    QuickChatSelection[QuickChatSelection["Apologies_NoProblem"] = 29] = "Apologies_NoProblem";
    QuickChatSelection[QuickChatSelection["Apologies_Whoops"] = 30] = "Apologies_Whoops";
    QuickChatSelection[QuickChatSelection["Apologies_Sorry"] = 31] = "Apologies_Sorry";
    QuickChatSelection[QuickChatSelection["Apologies_MyBad"] = 32] = "Apologies_MyBad";
    QuickChatSelection[QuickChatSelection["Apologies_Oops"] = 33] = "Apologies_Oops";
    QuickChatSelection[QuickChatSelection["Apologies_MyFault"] = 34] = "Apologies_MyFault";
    QuickChatSelection[QuickChatSelection["PostGame_Gg"] = 35] = "PostGame_Gg";
    QuickChatSelection[QuickChatSelection["PostGame_WellPlayed"] = 36] = "PostGame_WellPlayed";
    QuickChatSelection[QuickChatSelection["PostGame_ThatWasFun"] = 37] = "PostGame_ThatWasFun";
    QuickChatSelection[QuickChatSelection["PostGame_Rematch"] = 38] = "PostGame_Rematch";
    QuickChatSelection[QuickChatSelection["PostGame_OneMoreGame"] = 39] = "PostGame_OneMoreGame";
    QuickChatSelection[QuickChatSelection["PostGame_WhatAGame"] = 40] = "PostGame_WhatAGame";
    QuickChatSelection[QuickChatSelection["PostGame_NiceMoves"] = 41] = "PostGame_NiceMoves";
    QuickChatSelection[QuickChatSelection["PostGame_EverybodyDance"] = 42] = "PostGame_EverybodyDance";
    /// Custom text chats made by bot makers
    QuickChatSelection[QuickChatSelection["MaxPysonixQuickChatPresets"] = 43] = "MaxPysonixQuickChatPresets";
    /// Waste of CPU cycles
    QuickChatSelection[QuickChatSelection["Custom_Toxic_WasteCPU"] = 44] = "Custom_Toxic_WasteCPU";
    /// Git gud*
    QuickChatSelection[QuickChatSelection["Custom_Toxic_GitGut"] = 45] = "Custom_Toxic_GitGut";
    /// De-Allocate Yourself
    QuickChatSelection[QuickChatSelection["Custom_Toxic_DeAlloc"] = 46] = "Custom_Toxic_DeAlloc";
    /// 404: Your skill not found
    QuickChatSelection[QuickChatSelection["Custom_Toxic_404NoSkill"] = 47] = "Custom_Toxic_404NoSkill";
    /// Get a virus
    QuickChatSelection[QuickChatSelection["Custom_Toxic_CatchVirus"] = 48] = "Custom_Toxic_CatchVirus";
    /// Passing!
    QuickChatSelection[QuickChatSelection["Custom_Useful_Passing"] = 49] = "Custom_Useful_Passing";
    /// Faking!
    QuickChatSelection[QuickChatSelection["Custom_Useful_Faking"] = 50] = "Custom_Useful_Faking";
    /// Demoing!
    QuickChatSelection[QuickChatSelection["Custom_Useful_Demoing"] = 51] = "Custom_Useful_Demoing";
    /// BOOPING
    QuickChatSelection[QuickChatSelection["Custom_Useful_Bumping"] = 52] = "Custom_Useful_Bumping";
    /// The chances of that was 47525 to 1*
    QuickChatSelection[QuickChatSelection["Custom_Compliments_TinyChances"] = 53] = "Custom_Compliments_TinyChances";
    /// Who upped your skill level?
    QuickChatSelection[QuickChatSelection["Custom_Compliments_SkillLevel"] = 54] = "Custom_Compliments_SkillLevel";
    /// Your programmer should be proud
    QuickChatSelection[QuickChatSelection["Custom_Compliments_proud"] = 55] = "Custom_Compliments_proud";
    /// You're the GC of Bots
    QuickChatSelection[QuickChatSelection["Custom_Compliments_GC"] = 56] = "Custom_Compliments_GC";
    /// Are you <Insert Pro>Bot? *
    QuickChatSelection[QuickChatSelection["Custom_Compliments_Pro"] = 57] = "Custom_Compliments_Pro";
    /// Lag
    QuickChatSelection[QuickChatSelection["Custom_Excuses_Lag"] = 58] = "Custom_Excuses_Lag";
    /// Ghost inputs
    QuickChatSelection[QuickChatSelection["Custom_Excuses_GhostInputs"] = 59] = "Custom_Excuses_GhostInputs";
    /// RIGGED
    QuickChatSelection[QuickChatSelection["Custom_Excuses_Rigged"] = 60] = "Custom_Excuses_Rigged";
    /// Mafia plays!
    QuickChatSelection[QuickChatSelection["Custom_Toxic_MafiaPlays"] = 61] = "Custom_Toxic_MafiaPlays";
    /// Yeet!
    QuickChatSelection[QuickChatSelection["Custom_Exclamation_Yeet"] = 62] = "Custom_Exclamation_Yeet";
})(QuickChatSelection || (QuickChatSelection = {}));
exports.QuickChatSelection = QuickChatSelection;
var QuickChat = /** @class */ (function () {
    function QuickChat(flat) {
        this.quickChatSelection = flat.quickChatSelection();
        this.playerIndex = flat.playerIndex();
        this.teamOnly = flat.teamOnly();
        this.messageIndex = flat.messageIndex();
        this.timeStamp = flat.timeStamp();
    }
    return QuickChat;
}());
exports.QuickChat = QuickChat;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxhdHN0cnVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmxhdC9mbGF0c3RydWN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEseUpBQXlKOzs7Ozs7Ozs7Ozs7Ozs7O0FBRXpKO0lBSUUsaUJBQVksSUFBUztRQUNuQixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBQ0gsY0FBQztBQUFELENBQUMsQUFURCxJQVNDO0FBNHJCQywwQkFBTztBQTFyQlQ7SUFJRSxpQkFBWSxJQUFTO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFDSCxjQUFDO0FBQUQsQ0FBQyxBQVRELElBU0M7QUFrckJDLDBCQUFPO0FBanJCVDtJQUtFLGlCQUFZLElBQVM7UUFDbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUN0RSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUNILGNBQUM7QUFBRCxDQUFDLEFBWEQsSUFXQztBQXVxQkMsMEJBQU87QUFycUJUO0lBT0UsZUFBWSxJQUFTO1FBQ25CLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN4QyxDQUFDO0lBQ0gsWUFBQztBQUFELENBQUMsQUFmRCxJQWVDO0FBdXBCQyxzQkFBSztBQXJwQlA7SUFJRSwwQkFBWSxJQUFTO1FBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUNsRCxDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBVEQsSUFTQztBQUVEO0lBSUUsa0JBQVksSUFBUztRQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNuQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQy9CLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDVCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUNILGVBQUM7QUFBRCxDQUFDLEFBWEQsSUFXQztBQWdvQkMsNEJBQVE7QUE5bkJWO0lBVUUsa0JBQVksSUFBUztRQUNuQixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUM1QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDbEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDeEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUNILGVBQUM7QUFBRCxDQUFDLEFBckJELElBcUJDO0FBMG1CQyw0QkFBUTtBQXhtQlY7SUFRRSxtQkFBWSxJQUFTO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3hDLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUFqQkQsSUFpQkM7QUFFRDtJQVlFLG9CQUFZLElBQVM7UUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzlDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUMsQUF6QkQsSUF5QkM7QUE2akJDLGdDQUFVO0FBM2pCWjtJQUdFLHVCQUFZLElBQVM7UUFDbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQVBELElBT0M7QUFxakJDLHNDQUFhO0FBbmpCZjtJQUdFLGtCQUFZLElBQVM7UUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUNILGVBQUM7QUFBRCxDQUFDLEFBUEQsSUFPQztBQTZpQkMsNEJBQVE7QUEzaUJWO0lBRUUsc0JBQVksSUFBUztRQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLEFBTEQsSUFLQztBQUVEO0lBT0Usd0JBQVksSUFBUztRQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNsQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzdDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3BEO1FBQ0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7UUFDekIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3BELElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3JFO1FBQ0QsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDM0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQzdCLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQzlDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDVCxJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztRQUMxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdEU7UUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNoQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzlDO0lBQ0gsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FBQyxBQTdCRCxJQTZCQztBQXdnQkMsd0NBQWM7QUF0Z0JoQjtJQUdFLHlCQUFZLElBQVM7UUFDbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBQ0gsc0JBQUM7QUFBRCxDQUFDLEFBUEQsSUFPQztBQUVEO0lBRUUsd0JBQVksSUFBUztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNqQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzVDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZEO0lBQ0gsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FBQyxBQVJELElBUUM7QUFzZkMsd0NBQWM7QUFwZmhCO0lBR0Usa0JBQVksSUFBUztRQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3hDLENBQUM7SUFDSCxlQUFDO0FBQUQsQ0FBQyxBQVBELElBT0M7QUE4ZUMsNEJBQVE7QUE1ZVY7SUFJRSxrQkFBWSxJQUFTO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQUFURCxJQVNDO0FBb2VDLDRCQUFRO0FBbGVWO0lBR0UsbUJBQVksSUFBUztRQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNwQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQy9DLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3REO1FBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM5QztJQUNILENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUFiRCxJQWFDO0FBc2RDLDhCQUFTO0FBcGRYO0lBQUE7SUFBbUIsQ0FBQztJQUFELGtCQUFDO0FBQUQsQ0FBQyxBQUFwQixJQUFvQjtBQUVwQjtJQUFBO0lBQW1CLENBQUM7SUFBRCxrQkFBQztBQUFELENBQUMsQUFBcEIsSUFBb0I7QUFFcEI7SUFFRSwwQkFBWSxJQUFTO1FBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFDSCx1QkFBQztBQUFELENBQUMsQUFMRCxJQUtDO0FBRUQ7SUFBQTtJQUE0QixDQUFDO0lBQUQsMkJBQUM7QUFBRCxDQUFDLEFBQTdCLElBQTZCO0FBRTdCO0lBQTBCLCtCQUFnQjtJQUN4QyxxQkFBWSxJQUFTO2VBQ25CLGtCQUFNLElBQUksQ0FBQztJQUNiLENBQUM7SUFDSCxrQkFBQztBQUFELENBQUMsQUFKRCxDQUEwQixnQkFBZ0IsR0FJekM7QUEwZEMsa0NBQVc7QUF4ZGI7SUFTRSxzQkFBWSxJQUFTO1FBQ25CLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUMxRCxDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLEFBbkJELElBbUJDO0FBd2NDLG9DQUFZO0FBdGNkO0lBS0UsZUFBWSxJQUFTO1FBQ25CLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ2xCLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNILFlBQUM7QUFBRCxDQUFDLEFBVkQsSUFVQztBQTJiQyxzQkFBSztBQXpiUDtJQWlCRSx1QkFBWSxJQUFTO1FBQ25CLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzlDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQW5DRCxJQW1DQztBQXFaQyxzQ0FBYTtBQW5aZjtJQU1FLDZCQUFZLElBQVM7UUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFDSCwwQkFBQztBQUFELENBQUMsQUFiRCxJQWFDO0FBZ1hDLGtEQUFtQjtBQTlXckIsSUFBSyxRQU9KO0FBUEQsV0FBSyxRQUFRO0lBQ1gsMkNBQU0sQ0FBQTtJQUNOLHlDQUFLLENBQUE7SUFDTCwrQ0FBUSxDQUFBO0lBQ1IsMkNBQU0sQ0FBQTtJQUNOLDJDQUFNLENBQUE7SUFDTixtREFBVSxDQUFBO0FBQ1osQ0FBQyxFQVBJLFFBQVEsS0FBUixRQUFRLFFBT1o7QUF3V0MsNEJBQVE7QUF0V1YsSUFBSyxPQTJDSjtBQTNDRCxXQUFLLE9BQU87SUFDVixpREFBVSxDQUFBO0lBQ1YsK0NBQVMsQ0FBQTtJQUNULHlEQUFjLENBQUE7SUFDZCxxREFBWSxDQUFBO0lBQ1oscURBQVksQ0FBQTtJQUNaLHlEQUFjLENBQUE7SUFDZCwrQ0FBUyxDQUFBO0lBQ1QsNkNBQVEsQ0FBQTtJQUNSLDZDQUFRLENBQUE7SUFDUixtREFBVyxDQUFBO0lBQ1gsZ0RBQVMsQ0FBQTtJQUNULG9EQUFXLENBQUE7SUFDWCxnRUFBaUIsQ0FBQTtJQUNqQiwwREFBYyxDQUFBO0lBQ2QsOERBQWdCLENBQUE7SUFDaEIsNERBQWUsQ0FBQTtJQUNmLGtFQUFrQixDQUFBO0lBQ2xCLG9FQUFtQixDQUFBO0lBQ25CLHdFQUFxQixDQUFBO0lBQ3JCLGtFQUFrQixDQUFBO0lBQ2xCLGdFQUFpQixDQUFBO0lBQ2pCLG9FQUFtQixDQUFBO0lBQ25CLDhEQUFnQixDQUFBO0lBQ2hCLDREQUFlLENBQUE7SUFDZixzRUFBb0IsQ0FBQTtJQUNwQiw4Q0FBUSxDQUFBO0lBQ1IsMERBQWMsQ0FBQTtJQUNkLDBEQUFjLENBQUE7SUFDZCw4Q0FBUSxDQUFBO0lBQ1IsNENBQU8sQ0FBQTtJQUNQLDBDQUFNLENBQUE7SUFDTixrREFBVSxDQUFBO0lBQ1YsNENBQU8sQ0FBQTtJQUNQLGdEQUFTLENBQUE7SUFDVCxvREFBVyxDQUFBO0lBQ1gsNERBQWUsQ0FBQTtJQUNmLDhEQUFnQixDQUFBO0lBQ2hCLDhEQUFnQixDQUFBO0lBQ2hCLDREQUFlLENBQUE7SUFDZixvREFBVyxDQUFBO0lBQ1gsNERBQWUsQ0FBQTtJQUNmLGdFQUFpQixDQUFBO0FBQ25CLENBQUMsRUEzQ0ksT0FBTyxLQUFQLE9BQU8sUUEyQ1g7QUE0VEMsMEJBQU87QUExVFQsSUFBSyxXQUtKO0FBTEQsV0FBSyxXQUFXO0lBQ2QsNkRBQVksQ0FBQTtJQUNaLDJEQUFXLENBQUE7SUFDWCxpRUFBYyxDQUFBO0lBQ2QsdURBQVMsQ0FBQTtBQUNYLENBQUMsRUFMSSxXQUFXLEtBQVgsV0FBVyxRQUtmO0FBd1RDLGtDQUFXO0FBdFRiLElBQUssUUFLSjtBQUxELFdBQUssUUFBUTtJQUNYLGlEQUFTLENBQUE7SUFDVCwrQ0FBUSxDQUFBO0lBQ1IscURBQVcsQ0FBQTtJQUNYLG1EQUFVLENBQUE7QUFDWixDQUFDLEVBTEksUUFBUSxLQUFSLFFBQVEsUUFLWjtBQWtUQyw0QkFBUTtBQWhUVixJQUFLLGNBSUo7QUFKRCxXQUFLLGNBQWM7SUFDakIsNkRBQVMsQ0FBQTtJQUNULG1GQUFvQixDQUFBO0lBQ3BCLG1GQUFvQixDQUFBO0FBQ3RCLENBQUMsRUFKSSxjQUFjLEtBQWQsY0FBYyxRQUlsQjtBQTZTQyx3Q0FBYztBQTNTaEIsSUFBSyxrQkFLSjtBQUxELFdBQUssa0JBQWtCO0lBQ3JCLHFFQUFTLENBQUE7SUFDVCx5RUFBVyxDQUFBO0lBQ1gsdUVBQVUsQ0FBQTtJQUNWLHlFQUFXLENBQUE7QUFDYixDQUFDLEVBTEksa0JBQWtCLEtBQWxCLGtCQUFrQixRQUt0QjtBQXVTQyxnREFBa0I7QUFyU3BCLElBQUssZUFJSjtBQUpELFdBQUssZUFBZTtJQUNsQiwyREFBTyxDQUFBO0lBQ1AseURBQU0sQ0FBQTtJQUNOLCtEQUFTLENBQUE7QUFDWCxDQUFDLEVBSkksZUFBZSxLQUFmLGVBQWUsUUFJbkI7QUFrU0MsMENBQWU7QUFoU2pCLElBQUssa0JBS0o7QUFMRCxXQUFLLGtCQUFrQjtJQUNyQixpRUFBTyxDQUFBO0lBQ1AsMkRBQUksQ0FBQTtJQUNKLDJEQUFJLENBQUE7SUFDSix1RUFBVSxDQUFBO0FBQ1osQ0FBQyxFQUxJLGtCQUFrQixLQUFsQixrQkFBa0IsUUFLdEI7QUE0UkMsZ0RBQWtCO0FBMVJwQixJQUFLLGNBS0o7QUFMRCxXQUFLLGNBQWM7SUFDakIseURBQU8sQ0FBQTtJQUNQLG1EQUFJLENBQUE7SUFDSixtREFBSSxDQUFBO0lBQ0osK0RBQVUsQ0FBQTtBQUNaLENBQUMsRUFMSSxjQUFjLEtBQWQsY0FBYyxRQUtsQjtBQXNSQyx3Q0FBYztBQXBSaEIsSUFBSyxnQkFLSjtBQUxELFdBQUssZ0JBQWdCO0lBQ25CLDZEQUFPLENBQUE7SUFDUCx5REFBSyxDQUFBO0lBQ0wseURBQUssQ0FBQTtJQUNMLHFFQUFXLENBQUE7QUFDYixDQUFDLEVBTEksZ0JBQWdCLEtBQWhCLGdCQUFnQixRQUtwQjtBQWdSQyw0Q0FBZ0I7QUE5UWxCLElBQUssY0FLSjtBQUxELFdBQUssY0FBYztJQUNqQix5REFBTyxDQUFBO0lBQ1AscURBQUssQ0FBQTtJQUNMLHFEQUFLLENBQUE7SUFDTCwyREFBUSxDQUFBO0FBQ1YsQ0FBQyxFQUxJLGNBQWMsS0FBZCxjQUFjLFFBS2xCO0FBMFFDLHdDQUFjO0FBeFFoQixJQUFLLG9CQUtKO0FBTEQsV0FBSyxvQkFBb0I7SUFDdkIscUVBQU8sQ0FBQTtJQUNQLDZEQUFHLENBQUE7SUFDSCwrREFBSSxDQUFBO0lBQ0osMkVBQVUsQ0FBQTtBQUNaLENBQUMsRUFMSSxvQkFBb0IsS0FBcEIsb0JBQW9CLFFBS3hCO0FBb1FDLG9EQUFvQjtBQWxRdEIsSUFBSyxXQU1KO0FBTkQsV0FBSyxXQUFXO0lBQ2QsNkRBQVksQ0FBQTtJQUNaLG1FQUFlLENBQUE7SUFDZiwrREFBYSxDQUFBO0lBQ2IsaUVBQWMsQ0FBQTtJQUNkLHFEQUFRLENBQUE7QUFDVixDQUFDLEVBTkksV0FBVyxLQUFYLFdBQVcsUUFNZjtBQTZQQyxrQ0FBVztBQTNQYixJQUFLLFlBU0o7QUFURCxXQUFLLFlBQVk7SUFDZix5REFBUyxDQUFBO0lBQ1QscURBQU8sQ0FBQTtJQUNQLCtDQUFJLENBQUE7SUFDSix5REFBUyxDQUFBO0lBQ1QseUVBQWlCLENBQUE7SUFDakIsaUVBQWEsQ0FBQTtJQUNiLDZEQUFXLENBQUE7SUFDWCwyREFBVSxDQUFBO0FBQ1osQ0FBQyxFQVRJLFlBQVksS0FBWixZQUFZLFFBU2hCO0FBbVBDLG9DQUFZO0FBalBkLElBQUssbUJBS0o7QUFMRCxXQUFLLG1CQUFtQjtJQUN0QiwyREFBRyxDQUFBO0lBQ0gsMkVBQVcsQ0FBQTtJQUNYLDJEQUFHLENBQUE7SUFDSCwyREFBRyxDQUFBO0FBQ0wsQ0FBQyxFQUxJLG1CQUFtQixLQUFuQixtQkFBbUIsUUFLdkI7QUE2T0Msa0RBQW1CO0FBM09yQixJQUFLLGFBS0o7QUFMRCxXQUFLLGFBQWE7SUFDaEIsdURBQU8sQ0FBQTtJQUNQLCtDQUFHLENBQUE7SUFDSCxpREFBSSxDQUFBO0lBQ0osNkRBQVUsQ0FBQTtBQUNaLENBQUMsRUFMSSxhQUFhLEtBQWIsYUFBYSxRQUtqQjtBQXVPQyxzQ0FBYTtBQXJPZixJQUFLLGNBTUo7QUFORCxXQUFLLGNBQWM7SUFDakIseURBQU8sQ0FBQTtJQUNQLDJEQUFRLENBQUE7SUFDUixxRUFBYSxDQUFBO0lBQ2IsK0RBQVUsQ0FBQTtJQUNWLHFFQUFhLENBQUE7QUFDZixDQUFDLEVBTkksY0FBYyxLQUFkLGNBQWMsUUFNbEI7QUFnT0Msd0NBQWM7QUE5TmhCLElBQUssaUJBS0o7QUFMRCxXQUFLLGlCQUFpQjtJQUNwQiwyRUFBYSxDQUFBO0lBQ2IsdUVBQVcsQ0FBQTtJQUNYLHVFQUFXLENBQUE7SUFDWCxxRkFBa0IsQ0FBQTtBQUNwQixDQUFDLEVBTEksaUJBQWlCLEtBQWpCLGlCQUFpQixRQUtyQjtBQTBOQyw4Q0FBaUI7QUF4Tm5CO0lBaUJFLHlCQUFZLElBQVM7UUFDbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQ3BELElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzlDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUNwRCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUM1QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDaEQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQ3hELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUN0RCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUM1QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDcEQsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQW5DRCxJQW1DQztBQW9LQywwQ0FBZTtBQWxLakIsSUFBSyxxQkFVSjtBQVZELFdBQUsscUJBQXFCO0lBQ3hCLGlIQUFpSDtJQUNqSCxpR0FBb0IsQ0FBQTtJQUVwQix5REFBeUQ7SUFDekQsdUVBQU8sQ0FBQTtJQUVQLGlHQUFpRztJQUNqRywyRkFBMkY7SUFDM0YsNkZBQWtCLENBQUE7QUFDcEIsQ0FBQyxFQVZJLHFCQUFxQixLQUFyQixxQkFBcUIsUUFVekI7QUF5SkMsc0RBQXFCO0FBdkp2QjtJQVlFLHVCQUFZLElBQVM7UUFDbkIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEVBQUUsQ0FBQztRQUMvQixLQUFlLFVBQTJCLEVBQTNCLEtBQUEsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEVBQTNCLGNBQTJCLEVBQTNCLElBQTJCLEVBQUU7WUFBdkMsSUFBSSxFQUFFLFNBQUE7WUFDVCxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUM3RDtRQUNELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQzFELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzlDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUNwRCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUM5QyxDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBNUJELElBNEJDO0FBc0hDLHNDQUFhO0FBcEhmLElBQUssa0JBb0ZKO0FBcEZELFdBQUssa0JBQWtCO0lBQ3JCLHVGQUFzQixDQUFBO0lBQ3RCLDZGQUF5QixDQUFBO0lBQ3pCLGlHQUEyQixDQUFBO0lBQzNCLDZGQUF5QixDQUFBO0lBQ3pCLHlGQUF1QixDQUFBO0lBQ3ZCLDZGQUF5QixDQUFBO0lBQ3pCLDJGQUF3QixDQUFBO0lBQ3hCLCtGQUEwQixDQUFBO0lBQzFCLDJGQUF3QixDQUFBO0lBQ3hCLDJGQUF3QixDQUFBO0lBQ3hCLDhGQUEwQixDQUFBO0lBQzFCLHdGQUF1QixDQUFBO0lBQ3ZCLDhGQUEwQixDQUFBO0lBQzFCLDBGQUF3QixDQUFBO0lBQ3hCLDhGQUEwQixDQUFBO0lBQzFCLGdHQUEyQixDQUFBO0lBQzNCLDhGQUEwQixDQUFBO0lBQzFCLDhFQUFrQixDQUFBO0lBQ2xCLGtGQUFvQixDQUFBO0lBQ3BCLDhFQUFrQixDQUFBO0lBQ2xCLHdGQUF1QixDQUFBO0lBQ3ZCLGtGQUFvQixDQUFBO0lBQ3BCLHNGQUFzQixDQUFBO0lBQ3RCLGdGQUFtQixDQUFBO0lBQ25CLHNGQUFzQixDQUFBO0lBQ3RCLDRGQUF5QixDQUFBO0lBQ3pCLG9GQUFxQixDQUFBO0lBQ3JCLGdGQUFtQixDQUFBO0lBQ25CLHNGQUFzQixDQUFBO0lBQ3RCLDBGQUF3QixDQUFBO0lBQ3hCLG9GQUFxQixDQUFBO0lBQ3JCLGtGQUFvQixDQUFBO0lBQ3BCLGtGQUFvQixDQUFBO0lBQ3BCLGdGQUFtQixDQUFBO0lBQ25CLHNGQUFzQixDQUFBO0lBQ3RCLDBFQUFnQixDQUFBO0lBQ2hCLDBGQUF3QixDQUFBO0lBQ3hCLDBGQUF3QixDQUFBO0lBQ3hCLG9GQUFxQixDQUFBO0lBQ3JCLDRGQUF5QixDQUFBO0lBQ3pCLHdGQUF1QixDQUFBO0lBQ3ZCLHdGQUF1QixDQUFBO0lBQ3ZCLGtHQUE0QixDQUFBO0lBQzVCLHdDQUF3QztJQUN4Qyx3R0FBK0IsQ0FBQTtJQUMvQix1QkFBdUI7SUFDdkIsOEZBQTBCLENBQUE7SUFDMUIsWUFBWTtJQUNaLDBGQUF3QixDQUFBO0lBQ3hCLHdCQUF3QjtJQUN4Qiw0RkFBeUIsQ0FBQTtJQUN6Qiw2QkFBNkI7SUFDN0Isa0dBQTRCLENBQUE7SUFDNUIsZUFBZTtJQUNmLGtHQUE0QixDQUFBO0lBQzVCLFlBQVk7SUFDWiw4RkFBMEIsQ0FBQTtJQUMxQixXQUFXO0lBQ1gsNEZBQXlCLENBQUE7SUFDekIsWUFBWTtJQUNaLDhGQUEwQixDQUFBO0lBQzFCLFdBQVc7SUFDWCw4RkFBMEIsQ0FBQTtJQUMxQix1Q0FBdUM7SUFDdkMsZ0hBQW1DLENBQUE7SUFDbkMsK0JBQStCO0lBQy9CLDhHQUFrQyxDQUFBO0lBQ2xDLG1DQUFtQztJQUNuQyxvR0FBNkIsQ0FBQTtJQUM3Qix5QkFBeUI7SUFDekIsOEZBQTBCLENBQUE7SUFDMUIsOEJBQThCO0lBQzlCLGdHQUEyQixDQUFBO0lBQzNCLE9BQU87SUFDUCx3RkFBdUIsQ0FBQTtJQUN2QixnQkFBZ0I7SUFDaEIsd0dBQStCLENBQUE7SUFDL0IsVUFBVTtJQUNWLDhGQUEwQixDQUFBO0lBQzFCLGdCQUFnQjtJQUNoQixrR0FBNEIsQ0FBQTtJQUM1QixTQUFTO0lBQ1Qsa0dBQTRCLENBQUE7QUFDOUIsQ0FBQyxFQXBGSSxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBb0Z0QjtBQTJEQyxnREFBa0I7QUF6RHBCO0lBTUUsbUJBQVksSUFBUztRQUNuQixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDcEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDeEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQWJELElBYUM7QUEyQ0MsOEJBQVMifQ==
//./dist/flat/rlbot_generated.js
"use strict";
// automatically generated by the FlatBuffers compiler, do not modify
exports.__esModule = true;
exports.rlbot = void 0;
var flatbuffers_1 = require("flatbuffers");
/**
 * @enum {number}
 */
var rlbot;
(function (rlbot) {
    var flat;
    (function (flat) {
        var CollisionShape;
        (function (CollisionShape) {
            CollisionShape[CollisionShape["NONE"] = 0] = "NONE";
            CollisionShape[CollisionShape["BoxShape"] = 1] = "BoxShape";
            CollisionShape[CollisionShape["SphereShape"] = 2] = "SphereShape";
            CollisionShape[CollisionShape["CylinderShape"] = 3] = "CylinderShape";
        })(CollisionShape = flat.CollisionShape || (flat.CollisionShape = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var TileState;
        (function (TileState) {
            TileState[TileState["Unknown"] = 0] = "Unknown";
            /**
             * The default state of the tiles.
             */
            TileState[TileState["Filled"] = 1] = "Filled";
            /**
             * The state when a tile has been damaged.
             */
            TileState[TileState["Damaged"] = 2] = "Damaged";
            /**
             * The state of a tile when it is open and a goal can be scored.
             */
            TileState[TileState["Open"] = 3] = "Open";
        })(TileState = flat.TileState || (flat.TileState = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var RenderType;
        (function (RenderType) {
            RenderType[RenderType["DrawLine2D"] = 1] = "DrawLine2D";
            RenderType[RenderType["DrawLine3D"] = 2] = "DrawLine3D";
            RenderType[RenderType["DrawLine2D_3D"] = 3] = "DrawLine2D_3D";
            RenderType[RenderType["DrawRect2D"] = 4] = "DrawRect2D";
            RenderType[RenderType["DrawRect3D"] = 5] = "DrawRect3D";
            RenderType[RenderType["DrawString2D"] = 6] = "DrawString2D";
            RenderType[RenderType["DrawString3D"] = 7] = "DrawString3D";
            RenderType[RenderType["DrawCenteredRect3D"] = 8] = "DrawCenteredRect3D";
        })(RenderType = flat.RenderType || (flat.RenderType = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var QuickChatSelection;
        (function (QuickChatSelection) {
            QuickChatSelection[QuickChatSelection["Information_IGotIt"] = 0] = "Information_IGotIt";
            QuickChatSelection[QuickChatSelection["Information_NeedBoost"] = 1] = "Information_NeedBoost";
            QuickChatSelection[QuickChatSelection["Information_TakeTheShot"] = 2] = "Information_TakeTheShot";
            QuickChatSelection[QuickChatSelection["Information_Defending"] = 3] = "Information_Defending";
            QuickChatSelection[QuickChatSelection["Information_GoForIt"] = 4] = "Information_GoForIt";
            QuickChatSelection[QuickChatSelection["Information_Centering"] = 5] = "Information_Centering";
            QuickChatSelection[QuickChatSelection["Information_AllYours"] = 6] = "Information_AllYours";
            QuickChatSelection[QuickChatSelection["Information_InPosition"] = 7] = "Information_InPosition";
            QuickChatSelection[QuickChatSelection["Information_Incoming"] = 8] = "Information_Incoming";
            QuickChatSelection[QuickChatSelection["Compliments_NiceShot"] = 9] = "Compliments_NiceShot";
            QuickChatSelection[QuickChatSelection["Compliments_GreatPass"] = 10] = "Compliments_GreatPass";
            QuickChatSelection[QuickChatSelection["Compliments_Thanks"] = 11] = "Compliments_Thanks";
            QuickChatSelection[QuickChatSelection["Compliments_WhatASave"] = 12] = "Compliments_WhatASave";
            QuickChatSelection[QuickChatSelection["Compliments_NiceOne"] = 13] = "Compliments_NiceOne";
            QuickChatSelection[QuickChatSelection["Compliments_WhatAPlay"] = 14] = "Compliments_WhatAPlay";
            QuickChatSelection[QuickChatSelection["Compliments_GreatClear"] = 15] = "Compliments_GreatClear";
            QuickChatSelection[QuickChatSelection["Compliments_NiceBlock"] = 16] = "Compliments_NiceBlock";
            QuickChatSelection[QuickChatSelection["Reactions_OMG"] = 17] = "Reactions_OMG";
            QuickChatSelection[QuickChatSelection["Reactions_Noooo"] = 18] = "Reactions_Noooo";
            QuickChatSelection[QuickChatSelection["Reactions_Wow"] = 19] = "Reactions_Wow";
            QuickChatSelection[QuickChatSelection["Reactions_CloseOne"] = 20] = "Reactions_CloseOne";
            QuickChatSelection[QuickChatSelection["Reactions_NoWay"] = 21] = "Reactions_NoWay";
            QuickChatSelection[QuickChatSelection["Reactions_HolyCow"] = 22] = "Reactions_HolyCow";
            QuickChatSelection[QuickChatSelection["Reactions_Whew"] = 23] = "Reactions_Whew";
            QuickChatSelection[QuickChatSelection["Reactions_Siiiick"] = 24] = "Reactions_Siiiick";
            QuickChatSelection[QuickChatSelection["Reactions_Calculated"] = 25] = "Reactions_Calculated";
            QuickChatSelection[QuickChatSelection["Reactions_Savage"] = 26] = "Reactions_Savage";
            QuickChatSelection[QuickChatSelection["Reactions_Okay"] = 27] = "Reactions_Okay";
            QuickChatSelection[QuickChatSelection["Apologies_Cursing"] = 28] = "Apologies_Cursing";
            QuickChatSelection[QuickChatSelection["Apologies_NoProblem"] = 29] = "Apologies_NoProblem";
            QuickChatSelection[QuickChatSelection["Apologies_Whoops"] = 30] = "Apologies_Whoops";
            QuickChatSelection[QuickChatSelection["Apologies_Sorry"] = 31] = "Apologies_Sorry";
            QuickChatSelection[QuickChatSelection["Apologies_MyBad"] = 32] = "Apologies_MyBad";
            QuickChatSelection[QuickChatSelection["Apologies_Oops"] = 33] = "Apologies_Oops";
            QuickChatSelection[QuickChatSelection["Apologies_MyFault"] = 34] = "Apologies_MyFault";
            QuickChatSelection[QuickChatSelection["PostGame_Gg"] = 35] = "PostGame_Gg";
            QuickChatSelection[QuickChatSelection["PostGame_WellPlayed"] = 36] = "PostGame_WellPlayed";
            QuickChatSelection[QuickChatSelection["PostGame_ThatWasFun"] = 37] = "PostGame_ThatWasFun";
            QuickChatSelection[QuickChatSelection["PostGame_Rematch"] = 38] = "PostGame_Rematch";
            QuickChatSelection[QuickChatSelection["PostGame_OneMoreGame"] = 39] = "PostGame_OneMoreGame";
            QuickChatSelection[QuickChatSelection["PostGame_WhatAGame"] = 40] = "PostGame_WhatAGame";
            QuickChatSelection[QuickChatSelection["PostGame_NiceMoves"] = 41] = "PostGame_NiceMoves";
            QuickChatSelection[QuickChatSelection["PostGame_EverybodyDance"] = 42] = "PostGame_EverybodyDance";
            /**
             * Custom text chats made by bot makers
             */
            QuickChatSelection[QuickChatSelection["MaxPysonixQuickChatPresets"] = 43] = "MaxPysonixQuickChatPresets";
            /**
             * Waste of CPU cycles
             */
            QuickChatSelection[QuickChatSelection["Custom_Toxic_WasteCPU"] = 44] = "Custom_Toxic_WasteCPU";
            /**
             * Git gud*
             */
            QuickChatSelection[QuickChatSelection["Custom_Toxic_GitGut"] = 45] = "Custom_Toxic_GitGut";
            /**
             * De-Allocate Yourself
             */
            QuickChatSelection[QuickChatSelection["Custom_Toxic_DeAlloc"] = 46] = "Custom_Toxic_DeAlloc";
            /**
             * 404: Your skill not found
             */
            QuickChatSelection[QuickChatSelection["Custom_Toxic_404NoSkill"] = 47] = "Custom_Toxic_404NoSkill";
            /**
             * Get a virus
             */
            QuickChatSelection[QuickChatSelection["Custom_Toxic_CatchVirus"] = 48] = "Custom_Toxic_CatchVirus";
            /**
             * Passing!
             */
            QuickChatSelection[QuickChatSelection["Custom_Useful_Passing"] = 49] = "Custom_Useful_Passing";
            /**
             * Faking!
             */
            QuickChatSelection[QuickChatSelection["Custom_Useful_Faking"] = 50] = "Custom_Useful_Faking";
            /**
             * Demoing!
             */
            QuickChatSelection[QuickChatSelection["Custom_Useful_Demoing"] = 51] = "Custom_Useful_Demoing";
            /**
             * BOOPING
             */
            QuickChatSelection[QuickChatSelection["Custom_Useful_Bumping"] = 52] = "Custom_Useful_Bumping";
            /**
             * The chances of that was 47525 to 1*
             */
            QuickChatSelection[QuickChatSelection["Custom_Compliments_TinyChances"] = 53] = "Custom_Compliments_TinyChances";
            /**
             * Who upped your skill level?
             */
            QuickChatSelection[QuickChatSelection["Custom_Compliments_SkillLevel"] = 54] = "Custom_Compliments_SkillLevel";
            /**
             * Your programmer should be proud
             */
            QuickChatSelection[QuickChatSelection["Custom_Compliments_proud"] = 55] = "Custom_Compliments_proud";
            /**
             * You're the GC of Bots
             */
            QuickChatSelection[QuickChatSelection["Custom_Compliments_GC"] = 56] = "Custom_Compliments_GC";
            /**
             * Are you <Insert Pro>Bot? *
             */
            QuickChatSelection[QuickChatSelection["Custom_Compliments_Pro"] = 57] = "Custom_Compliments_Pro";
            /**
             * Lag
             */
            QuickChatSelection[QuickChatSelection["Custom_Excuses_Lag"] = 58] = "Custom_Excuses_Lag";
            /**
             * Ghost inputs
             */
            QuickChatSelection[QuickChatSelection["Custom_Excuses_GhostInputs"] = 59] = "Custom_Excuses_GhostInputs";
            /**
             * RIGGED
             */
            QuickChatSelection[QuickChatSelection["Custom_Excuses_Rigged"] = 60] = "Custom_Excuses_Rigged";
            /**
             * Mafia plays!
             */
            QuickChatSelection[QuickChatSelection["Custom_Toxic_MafiaPlays"] = 61] = "Custom_Toxic_MafiaPlays";
            /**
             * Yeet!
             */
            QuickChatSelection[QuickChatSelection["Custom_Exclamation_Yeet"] = 62] = "Custom_Exclamation_Yeet";
        })(QuickChatSelection = flat.QuickChatSelection || (flat.QuickChatSelection = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var PlayerClass;
        (function (PlayerClass) {
            PlayerClass[PlayerClass["NONE"] = 0] = "NONE";
            PlayerClass[PlayerClass["RLBotPlayer"] = 1] = "RLBotPlayer";
            PlayerClass[PlayerClass["HumanPlayer"] = 2] = "HumanPlayer";
            PlayerClass[PlayerClass["PsyonixBotPlayer"] = 3] = "PsyonixBotPlayer";
            PlayerClass[PlayerClass["PartyMemberBotPlayer"] = 4] = "PartyMemberBotPlayer";
        })(PlayerClass = flat.PlayerClass || (flat.PlayerClass = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var GameMode;
        (function (GameMode) {
            GameMode[GameMode["Soccer"] = 0] = "Soccer";
            GameMode[GameMode["Hoops"] = 1] = "Hoops";
            GameMode[GameMode["Dropshot"] = 2] = "Dropshot";
            GameMode[GameMode["Hockey"] = 3] = "Hockey";
            GameMode[GameMode["Rumble"] = 4] = "Rumble";
            GameMode[GameMode["Heatseeker"] = 5] = "Heatseeker";
        })(GameMode = flat.GameMode || (flat.GameMode = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var GameMap;
        (function (GameMap) {
            GameMap[GameMap["DFHStadium"] = 0] = "DFHStadium";
            GameMap[GameMap["Mannfield"] = 1] = "Mannfield";
            GameMap[GameMap["ChampionsField"] = 2] = "ChampionsField";
            GameMap[GameMap["UrbanCentral"] = 3] = "UrbanCentral";
            GameMap[GameMap["BeckwithPark"] = 4] = "BeckwithPark";
            GameMap[GameMap["UtopiaColiseum"] = 5] = "UtopiaColiseum";
            GameMap[GameMap["Wasteland"] = 6] = "Wasteland";
            GameMap[GameMap["NeoTokyo"] = 7] = "NeoTokyo";
            GameMap[GameMap["AquaDome"] = 8] = "AquaDome";
            GameMap[GameMap["StarbaseArc"] = 9] = "StarbaseArc";
            GameMap[GameMap["Farmstead"] = 10] = "Farmstead";
            GameMap[GameMap["SaltyShores"] = 11] = "SaltyShores";
            GameMap[GameMap["DFHStadium_Stormy"] = 12] = "DFHStadium_Stormy";
            GameMap[GameMap["DFHStadium_Day"] = 13] = "DFHStadium_Day";
            GameMap[GameMap["Mannfield_Stormy"] = 14] = "Mannfield_Stormy";
            GameMap[GameMap["Mannfield_Night"] = 15] = "Mannfield_Night";
            GameMap[GameMap["ChampionsField_Day"] = 16] = "ChampionsField_Day";
            GameMap[GameMap["BeckwithPark_Stormy"] = 17] = "BeckwithPark_Stormy";
            GameMap[GameMap["BeckwithPark_Midnight"] = 18] = "BeckwithPark_Midnight";
            GameMap[GameMap["UrbanCentral_Night"] = 19] = "UrbanCentral_Night";
            GameMap[GameMap["UrbanCentral_Dawn"] = 20] = "UrbanCentral_Dawn";
            GameMap[GameMap["UtopiaColiseum_Dusk"] = 21] = "UtopiaColiseum_Dusk";
            GameMap[GameMap["DFHStadium_Snowy"] = 22] = "DFHStadium_Snowy";
            GameMap[GameMap["Mannfield_Snowy"] = 23] = "Mannfield_Snowy";
            GameMap[GameMap["UtopiaColiseum_Snowy"] = 24] = "UtopiaColiseum_Snowy";
            GameMap[GameMap["Badlands"] = 25] = "Badlands";
            GameMap[GameMap["Badlands_Night"] = 26] = "Badlands_Night";
            GameMap[GameMap["TokyoUnderpass"] = 27] = "TokyoUnderpass";
            GameMap[GameMap["Arctagon"] = 28] = "Arctagon";
            GameMap[GameMap["Pillars"] = 29] = "Pillars";
            GameMap[GameMap["Cosmic"] = 30] = "Cosmic";
            GameMap[GameMap["DoubleGoal"] = 31] = "DoubleGoal";
            GameMap[GameMap["Octagon"] = 32] = "Octagon";
            GameMap[GameMap["Underpass"] = 33] = "Underpass";
            GameMap[GameMap["UtopiaRetro"] = 34] = "UtopiaRetro";
            GameMap[GameMap["Hoops_DunkHouse"] = 35] = "Hoops_DunkHouse";
            GameMap[GameMap["DropShot_Core707"] = 36] = "DropShot_Core707";
            GameMap[GameMap["ThrowbackStadium"] = 37] = "ThrowbackStadium";
            GameMap[GameMap["ForbiddenTemple"] = 38] = "ForbiddenTemple";
            GameMap[GameMap["RivalsArena"] = 39] = "RivalsArena";
            GameMap[GameMap["Farmstead_Night"] = 40] = "Farmstead_Night";
            GameMap[GameMap["SaltyShores_Night"] = 41] = "SaltyShores_Night";
        })(GameMap = flat.GameMap || (flat.GameMap = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var MatchLength;
        (function (MatchLength) {
            MatchLength[MatchLength["Five_Minutes"] = 0] = "Five_Minutes";
            MatchLength[MatchLength["Ten_Minutes"] = 1] = "Ten_Minutes";
            MatchLength[MatchLength["Twenty_Minutes"] = 2] = "Twenty_Minutes";
            MatchLength[MatchLength["Unlimited"] = 3] = "Unlimited";
        })(MatchLength = flat.MatchLength || (flat.MatchLength = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var MaxScore;
        (function (MaxScore) {
            MaxScore[MaxScore["Unlimited"] = 0] = "Unlimited";
            MaxScore[MaxScore["One_Goal"] = 1] = "One_Goal";
            MaxScore[MaxScore["Three_Goals"] = 2] = "Three_Goals";
            MaxScore[MaxScore["Five_Goals"] = 3] = "Five_Goals";
        })(MaxScore = flat.MaxScore || (flat.MaxScore = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var OvertimeOption;
        (function (OvertimeOption) {
            OvertimeOption[OvertimeOption["Unlimited"] = 0] = "Unlimited";
            OvertimeOption[OvertimeOption["Five_Max_First_Score"] = 1] = "Five_Max_First_Score";
            OvertimeOption[OvertimeOption["Five_Max_Random_Team"] = 2] = "Five_Max_Random_Team";
        })(OvertimeOption = flat.OvertimeOption || (flat.OvertimeOption = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var SeriesLengthOption;
        (function (SeriesLengthOption) {
            SeriesLengthOption[SeriesLengthOption["Unlimited"] = 0] = "Unlimited";
            SeriesLengthOption[SeriesLengthOption["Three_Games"] = 1] = "Three_Games";
            SeriesLengthOption[SeriesLengthOption["Five_Games"] = 2] = "Five_Games";
            SeriesLengthOption[SeriesLengthOption["Seven_Games"] = 3] = "Seven_Games";
        })(SeriesLengthOption = flat.SeriesLengthOption || (flat.SeriesLengthOption = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var GameSpeedOption;
        (function (GameSpeedOption) {
            GameSpeedOption[GameSpeedOption["Default"] = 0] = "Default";
            GameSpeedOption[GameSpeedOption["Slo_Mo"] = 1] = "Slo_Mo";
            GameSpeedOption[GameSpeedOption["Time_Warp"] = 2] = "Time_Warp";
        })(GameSpeedOption = flat.GameSpeedOption || (flat.GameSpeedOption = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var BallMaxSpeedOption;
        (function (BallMaxSpeedOption) {
            BallMaxSpeedOption[BallMaxSpeedOption["Default"] = 0] = "Default";
            BallMaxSpeedOption[BallMaxSpeedOption["Slow"] = 1] = "Slow";
            BallMaxSpeedOption[BallMaxSpeedOption["Fast"] = 2] = "Fast";
            BallMaxSpeedOption[BallMaxSpeedOption["Super_Fast"] = 3] = "Super_Fast";
        })(BallMaxSpeedOption = flat.BallMaxSpeedOption || (flat.BallMaxSpeedOption = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var BallTypeOption;
        (function (BallTypeOption) {
            BallTypeOption[BallTypeOption["Default"] = 0] = "Default";
            BallTypeOption[BallTypeOption["Cube"] = 1] = "Cube";
            BallTypeOption[BallTypeOption["Puck"] = 2] = "Puck";
            BallTypeOption[BallTypeOption["Basketball"] = 3] = "Basketball";
        })(BallTypeOption = flat.BallTypeOption || (flat.BallTypeOption = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var BallWeightOption;
        (function (BallWeightOption) {
            BallWeightOption[BallWeightOption["Default"] = 0] = "Default";
            BallWeightOption[BallWeightOption["Light"] = 1] = "Light";
            BallWeightOption[BallWeightOption["Heavy"] = 2] = "Heavy";
            BallWeightOption[BallWeightOption["Super_Light"] = 3] = "Super_Light";
        })(BallWeightOption = flat.BallWeightOption || (flat.BallWeightOption = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var BallSizeOption;
        (function (BallSizeOption) {
            BallSizeOption[BallSizeOption["Default"] = 0] = "Default";
            BallSizeOption[BallSizeOption["Small"] = 1] = "Small";
            BallSizeOption[BallSizeOption["Large"] = 2] = "Large";
            BallSizeOption[BallSizeOption["Gigantic"] = 3] = "Gigantic";
        })(BallSizeOption = flat.BallSizeOption || (flat.BallSizeOption = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var BallBouncinessOption;
        (function (BallBouncinessOption) {
            BallBouncinessOption[BallBouncinessOption["Default"] = 0] = "Default";
            BallBouncinessOption[BallBouncinessOption["Low"] = 1] = "Low";
            BallBouncinessOption[BallBouncinessOption["High"] = 2] = "High";
            BallBouncinessOption[BallBouncinessOption["Super_High"] = 3] = "Super_High";
        })(BallBouncinessOption = flat.BallBouncinessOption || (flat.BallBouncinessOption = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var BoostOption;
        (function (BoostOption) {
            BoostOption[BoostOption["Normal_Boost"] = 0] = "Normal_Boost";
            BoostOption[BoostOption["Unlimited_Boost"] = 1] = "Unlimited_Boost";
            BoostOption[BoostOption["Slow_Recharge"] = 2] = "Slow_Recharge";
            BoostOption[BoostOption["Rapid_Recharge"] = 3] = "Rapid_Recharge";
            BoostOption[BoostOption["No_Boost"] = 4] = "No_Boost";
        })(BoostOption = flat.BoostOption || (flat.BoostOption = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var RumbleOption;
        (function (RumbleOption) {
            RumbleOption[RumbleOption["No_Rumble"] = 0] = "No_Rumble";
            RumbleOption[RumbleOption["Default"] = 1] = "Default";
            RumbleOption[RumbleOption["Slow"] = 2] = "Slow";
            RumbleOption[RumbleOption["Civilized"] = 3] = "Civilized";
            RumbleOption[RumbleOption["Destruction_Derby"] = 4] = "Destruction_Derby";
            RumbleOption[RumbleOption["Spring_Loaded"] = 5] = "Spring_Loaded";
            RumbleOption[RumbleOption["Spikes_Only"] = 6] = "Spikes_Only";
            RumbleOption[RumbleOption["Spike_Rush"] = 7] = "Spike_Rush";
        })(RumbleOption = flat.RumbleOption || (flat.RumbleOption = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var BoostStrengthOption;
        (function (BoostStrengthOption) {
            BoostStrengthOption[BoostStrengthOption["One"] = 0] = "One";
            BoostStrengthOption[BoostStrengthOption["OneAndAHalf"] = 1] = "OneAndAHalf";
            BoostStrengthOption[BoostStrengthOption["Two"] = 2] = "Two";
            BoostStrengthOption[BoostStrengthOption["Ten"] = 3] = "Ten";
        })(BoostStrengthOption = flat.BoostStrengthOption || (flat.BoostStrengthOption = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var GravityOption;
        (function (GravityOption) {
            GravityOption[GravityOption["Default"] = 0] = "Default";
            GravityOption[GravityOption["Low"] = 1] = "Low";
            GravityOption[GravityOption["High"] = 2] = "High";
            GravityOption[GravityOption["Super_High"] = 3] = "Super_High";
        })(GravityOption = flat.GravityOption || (flat.GravityOption = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var DemolishOption;
        (function (DemolishOption) {
            DemolishOption[DemolishOption["Default"] = 0] = "Default";
            DemolishOption[DemolishOption["Disabled"] = 1] = "Disabled";
            DemolishOption[DemolishOption["Friendly_Fire"] = 2] = "Friendly_Fire";
            DemolishOption[DemolishOption["On_Contact"] = 3] = "On_Contact";
            DemolishOption[DemolishOption["On_Contact_FF"] = 4] = "On_Contact_FF";
        })(DemolishOption = flat.DemolishOption || (flat.DemolishOption = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var RespawnTimeOption;
        (function (RespawnTimeOption) {
            RespawnTimeOption[RespawnTimeOption["Three_Seconds"] = 0] = "Three_Seconds";
            RespawnTimeOption[RespawnTimeOption["Two_Seconds"] = 1] = "Two_Seconds";
            RespawnTimeOption[RespawnTimeOption["One_Seconds"] = 2] = "One_Seconds";
            RespawnTimeOption[RespawnTimeOption["Disable_Goal_Reset"] = 3] = "Disable_Goal_Reset";
        })(RespawnTimeOption = flat.RespawnTimeOption || (flat.RespawnTimeOption = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var ExistingMatchBehavior;
        (function (ExistingMatchBehavior) {
            /**
             * Restart the match if any match settings differ. This is the default because old RLBot always worked this way.
             */
            ExistingMatchBehavior[ExistingMatchBehavior["Restart_If_Different"] = 0] = "Restart_If_Different";
            /**
             * Always restart the match, even if config is identical
             */
            ExistingMatchBehavior[ExistingMatchBehavior["Restart"] = 1] = "Restart";
            /**
             * Never restart an existing match, just try to remove or spawn cars to match the configuration.
             * If we are not in the middle of a match, a match will be started. Handy for LAN matches.
             */
            ExistingMatchBehavior[ExistingMatchBehavior["Continue_And_Spawn"] = 2] = "Continue_And_Spawn";
        })(ExistingMatchBehavior = flat.ExistingMatchBehavior || (flat.ExistingMatchBehavior = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @enum {number}
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var GameMessage;
        (function (GameMessage) {
            GameMessage[GameMessage["NONE"] = 0] = "NONE";
            GameMessage[GameMessage["PlayerStatEvent"] = 1] = "PlayerStatEvent";
            GameMessage[GameMessage["PlayerSpectate"] = 2] = "PlayerSpectate";
            GameMessage[GameMessage["PlayerInputChange"] = 3] = "PlayerInputChange";
        })(GameMessage = flat.GameMessage || (flat.GameMessage = {}));
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
;
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var ControllerState = /** @class */ (function () {
            function ControllerState() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns ControllerState
             */
            ControllerState.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param ControllerState= obj
             * @returns ControllerState
             */
            ControllerState.getRootAsControllerState = function (bb, obj) {
                return (obj || new ControllerState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param ControllerState= obj
             * @returns ControllerState
             */
            ControllerState.getSizePrefixedRootAsControllerState = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new ControllerState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * -1 for full reverse, 1 for full forward
             *
             * @returns number
             */
            ControllerState.prototype.throttle = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * -1 for full left, 1 for full right
             *
             * @returns number
             */
            ControllerState.prototype.steer = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * -1 for nose down, 1 for nose up
             *
             * @returns number
             */
            ControllerState.prototype.pitch = function () {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * -1 for full left, 1 for full right
             *
             * @returns number
             */
            ControllerState.prototype.yaw = function () {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * -1 for roll left, 1 for roll right
             *
             * @returns number
             */
            ControllerState.prototype.roll = function () {
                var offset = this.bb.__offset(this.bb_pos, 12);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * true if you want to press the jump button
             *
             * @returns boolean
             */
            ControllerState.prototype.jump = function () {
                var offset = this.bb.__offset(this.bb_pos, 14);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * true if you want to press the boost button
             *
             * @returns boolean
             */
            ControllerState.prototype.boost = function () {
                var offset = this.bb.__offset(this.bb_pos, 16);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * true if you want to press the handbrake button
             *
             * @returns boolean
             */
            ControllerState.prototype.handbrake = function () {
                var offset = this.bb.__offset(this.bb_pos, 18);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * true if you want to press the 'use item' button, used in rumble etc.
             *
             * @returns boolean
             */
            ControllerState.prototype.useItem = function () {
                var offset = this.bb.__offset(this.bb_pos, 20);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            ControllerState.startControllerState = function (builder) {
                builder.startObject(9);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number throttle
             */
            ControllerState.addThrottle = function (builder, throttle) {
                builder.addFieldFloat32(0, throttle, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number steer
             */
            ControllerState.addSteer = function (builder, steer) {
                builder.addFieldFloat32(1, steer, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number pitch
             */
            ControllerState.addPitch = function (builder, pitch) {
                builder.addFieldFloat32(2, pitch, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number yaw
             */
            ControllerState.addYaw = function (builder, yaw) {
                builder.addFieldFloat32(3, yaw, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number roll
             */
            ControllerState.addRoll = function (builder, roll) {
                builder.addFieldFloat32(4, roll, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean jump
             */
            ControllerState.addJump = function (builder, jump) {
                builder.addFieldInt8(5, +jump, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean boost
             */
            ControllerState.addBoost = function (builder, boost) {
                builder.addFieldInt8(6, +boost, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean handbrake
             */
            ControllerState.addHandbrake = function (builder, handbrake) {
                builder.addFieldInt8(7, +handbrake, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean useItem
             */
            ControllerState.addUseItem = function (builder, useItem) {
                builder.addFieldInt8(8, +useItem, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            ControllerState.endControllerState = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            ControllerState.createControllerState = function (builder, throttle, steer, pitch, yaw, roll, jump, boost, handbrake, useItem) {
                ControllerState.startControllerState(builder);
                ControllerState.addThrottle(builder, throttle);
                ControllerState.addSteer(builder, steer);
                ControllerState.addPitch(builder, pitch);
                ControllerState.addYaw(builder, yaw);
                ControllerState.addRoll(builder, roll);
                ControllerState.addJump(builder, jump);
                ControllerState.addBoost(builder, boost);
                ControllerState.addHandbrake(builder, handbrake);
                ControllerState.addUseItem(builder, useItem);
                return ControllerState.endControllerState(builder);
            };
            return ControllerState;
        }());
        flat.ControllerState = ControllerState;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var PlayerInput = /** @class */ (function () {
            function PlayerInput() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns PlayerInput
             */
            PlayerInput.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param PlayerInput= obj
             * @returns PlayerInput
             */
            PlayerInput.getRootAsPlayerInput = function (bb, obj) {
                return (obj || new PlayerInput()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param PlayerInput= obj
             * @returns PlayerInput
             */
            PlayerInput.getSizePrefixedRootAsPlayerInput = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new PlayerInput()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @returns number
             */
            PlayerInput.prototype.playerIndex = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param rlbot.flat.ControllerState= obj
             * @returns rlbot.flat.ControllerState|null
             */
            PlayerInput.prototype.controllerState = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? (obj || new rlbot.flat.ControllerState()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            PlayerInput.startPlayerInput = function (builder) {
                builder.startObject(2);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number playerIndex
             */
            PlayerInput.addPlayerIndex = function (builder, playerIndex) {
                builder.addFieldInt32(0, playerIndex, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset controllerStateOffset
             */
            PlayerInput.addControllerState = function (builder, controllerStateOffset) {
                builder.addFieldOffset(1, controllerStateOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            PlayerInput.endPlayerInput = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            PlayerInput.createPlayerInput = function (builder, playerIndex, controllerStateOffset) {
                PlayerInput.startPlayerInput(builder);
                PlayerInput.addPlayerIndex(builder, playerIndex);
                PlayerInput.addControllerState(builder, controllerStateOffset);
                return PlayerInput.endPlayerInput(builder);
            };
            return PlayerInput;
        }());
        flat.PlayerInput = PlayerInput;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var Vector3 = /** @class */ (function () {
            function Vector3() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns Vector3
             */
            Vector3.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @returns number
             */
            Vector3.prototype.x = function () {
                return this.bb.readFloat32(this.bb_pos);
            };
            ;
            /**
             * @returns number
             */
            Vector3.prototype.y = function () {
                return this.bb.readFloat32(this.bb_pos + 4);
            };
            ;
            /**
             * @returns number
             */
            Vector3.prototype.z = function () {
                return this.bb.readFloat32(this.bb_pos + 8);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number x
             * @param number y
             * @param number z
             * @returns flatbuffers.Offset
             */
            Vector3.createVector3 = function (builder, x, y, z) {
                builder.prep(4, 12);
                builder.writeFloat32(z);
                builder.writeFloat32(y);
                builder.writeFloat32(x);
                return builder.offset();
            };
            ;
            return Vector3;
        }());
        flat.Vector3 = Vector3;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * Expresses the rotation state of an object in Euler angles, with values in radians.
 *
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var Rotator = /** @class */ (function () {
            function Rotator() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns Rotator
             */
            Rotator.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @returns number
             */
            Rotator.prototype.pitch = function () {
                return this.bb.readFloat32(this.bb_pos);
            };
            ;
            /**
             * @returns number
             */
            Rotator.prototype.yaw = function () {
                return this.bb.readFloat32(this.bb_pos + 4);
            };
            ;
            /**
             * @returns number
             */
            Rotator.prototype.roll = function () {
                return this.bb.readFloat32(this.bb_pos + 8);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number pitch
             * @param number yaw
             * @param number roll
             * @returns flatbuffers.Offset
             */
            Rotator.createRotator = function (builder, pitch, yaw, roll) {
                builder.prep(4, 12);
                builder.writeFloat32(roll);
                builder.writeFloat32(yaw);
                builder.writeFloat32(pitch);
                return builder.offset();
            };
            ;
            return Rotator;
        }());
        flat.Rotator = Rotator;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * Expresses the rotation state of an object.
 * Learn about quaternions here: https://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation
 * You can tinker with them here to build an intuition: https://quaternions.online/
 *
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var Quaternion = /** @class */ (function () {
            function Quaternion() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns Quaternion
             */
            Quaternion.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @returns number
             */
            Quaternion.prototype.x = function () {
                return this.bb.readFloat32(this.bb_pos);
            };
            ;
            /**
             * @returns number
             */
            Quaternion.prototype.y = function () {
                return this.bb.readFloat32(this.bb_pos + 4);
            };
            ;
            /**
             * @returns number
             */
            Quaternion.prototype.z = function () {
                return this.bb.readFloat32(this.bb_pos + 8);
            };
            ;
            /**
             * @returns number
             */
            Quaternion.prototype.w = function () {
                return this.bb.readFloat32(this.bb_pos + 12);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number x
             * @param number y
             * @param number z
             * @param number w
             * @returns flatbuffers.Offset
             */
            Quaternion.createQuaternion = function (builder, x, y, z, w) {
                builder.prep(4, 16);
                builder.writeFloat32(w);
                builder.writeFloat32(z);
                builder.writeFloat32(y);
                builder.writeFloat32(x);
                return builder.offset();
            };
            ;
            return Quaternion;
        }());
        flat.Quaternion = Quaternion;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var BoxShape = /** @class */ (function () {
            function BoxShape() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns BoxShape
             */
            BoxShape.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param BoxShape= obj
             * @returns BoxShape
             */
            BoxShape.getRootAsBoxShape = function (bb, obj) {
                return (obj || new BoxShape()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param BoxShape= obj
             * @returns BoxShape
             */
            BoxShape.getSizePrefixedRootAsBoxShape = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new BoxShape()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @returns number
             */
            BoxShape.prototype.length = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * @returns number
             */
            BoxShape.prototype.width = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * @returns number
             */
            BoxShape.prototype.height = function () {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            BoxShape.startBoxShape = function (builder) {
                builder.startObject(3);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number length
             */
            BoxShape.addLength = function (builder, length) {
                builder.addFieldFloat32(0, length, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number width
             */
            BoxShape.addWidth = function (builder, width) {
                builder.addFieldFloat32(1, width, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number height
             */
            BoxShape.addHeight = function (builder, height) {
                builder.addFieldFloat32(2, height, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            BoxShape.endBoxShape = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            BoxShape.createBoxShape = function (builder, length, width, height) {
                BoxShape.startBoxShape(builder);
                BoxShape.addLength(builder, length);
                BoxShape.addWidth(builder, width);
                BoxShape.addHeight(builder, height);
                return BoxShape.endBoxShape(builder);
            };
            return BoxShape;
        }());
        flat.BoxShape = BoxShape;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var SphereShape = /** @class */ (function () {
            function SphereShape() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns SphereShape
             */
            SphereShape.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param SphereShape= obj
             * @returns SphereShape
             */
            SphereShape.getRootAsSphereShape = function (bb, obj) {
                return (obj || new SphereShape()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param SphereShape= obj
             * @returns SphereShape
             */
            SphereShape.getSizePrefixedRootAsSphereShape = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new SphereShape()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @returns number
             */
            SphereShape.prototype.diameter = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            SphereShape.startSphereShape = function (builder) {
                builder.startObject(1);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number diameter
             */
            SphereShape.addDiameter = function (builder, diameter) {
                builder.addFieldFloat32(0, diameter, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            SphereShape.endSphereShape = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            SphereShape.createSphereShape = function (builder, diameter) {
                SphereShape.startSphereShape(builder);
                SphereShape.addDiameter(builder, diameter);
                return SphereShape.endSphereShape(builder);
            };
            return SphereShape;
        }());
        flat.SphereShape = SphereShape;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var CylinderShape = /** @class */ (function () {
            function CylinderShape() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns CylinderShape
             */
            CylinderShape.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param CylinderShape= obj
             * @returns CylinderShape
             */
            CylinderShape.getRootAsCylinderShape = function (bb, obj) {
                return (obj || new CylinderShape()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param CylinderShape= obj
             * @returns CylinderShape
             */
            CylinderShape.getSizePrefixedRootAsCylinderShape = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new CylinderShape()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @returns number
             */
            CylinderShape.prototype.diameter = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * @returns number
             */
            CylinderShape.prototype.height = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            CylinderShape.startCylinderShape = function (builder) {
                builder.startObject(2);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number diameter
             */
            CylinderShape.addDiameter = function (builder, diameter) {
                builder.addFieldFloat32(0, diameter, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number height
             */
            CylinderShape.addHeight = function (builder, height) {
                builder.addFieldFloat32(1, height, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            CylinderShape.endCylinderShape = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            CylinderShape.createCylinderShape = function (builder, diameter, height) {
                CylinderShape.startCylinderShape(builder);
                CylinderShape.addDiameter(builder, diameter);
                CylinderShape.addHeight(builder, height);
                return CylinderShape.endCylinderShape(builder);
            };
            return CylinderShape;
        }());
        flat.CylinderShape = CylinderShape;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var Touch = /** @class */ (function () {
            function Touch() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns Touch
             */
            Touch.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param Touch= obj
             * @returns Touch
             */
            Touch.getRootAsTouch = function (bb, obj) {
                return (obj || new Touch()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param Touch= obj
             * @returns Touch
             */
            Touch.getSizePrefixedRootAsTouch = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new Touch()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            Touch.prototype.playerName = function (optionalEncoding) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
            };
            ;
            /**
             * Seconds that had elapsed in the game when the touch occurred.
             *
             * @returns number
             */
            Touch.prototype.gameSeconds = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * The point of contact for the touch.
             *
             * @param rlbot.flat.Vector3= obj
             * @returns rlbot.flat.Vector3|null
             */
            Touch.prototype.location = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? (obj || new rlbot.flat.Vector3()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * The direction of the touch.
             *
             * @param rlbot.flat.Vector3= obj
             * @returns rlbot.flat.Vector3|null
             */
            Touch.prototype.normal = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? (obj || new rlbot.flat.Vector3()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * The Team which the touch belongs to, 0 for blue 1 for orange.
             *
             * @returns number
             */
            Touch.prototype.team = function () {
                var offset = this.bb.__offset(this.bb_pos, 12);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * The index of the player involved with the touch.
             *
             * @returns number
             */
            Touch.prototype.playerIndex = function () {
                var offset = this.bb.__offset(this.bb_pos, 14);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            Touch.startTouch = function (builder) {
                builder.startObject(6);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset playerNameOffset
             */
            Touch.addPlayerName = function (builder, playerNameOffset) {
                builder.addFieldOffset(0, playerNameOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number gameSeconds
             */
            Touch.addGameSeconds = function (builder, gameSeconds) {
                builder.addFieldFloat32(1, gameSeconds, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset locationOffset
             */
            Touch.addLocation = function (builder, locationOffset) {
                builder.addFieldStruct(2, locationOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset normalOffset
             */
            Touch.addNormal = function (builder, normalOffset) {
                builder.addFieldStruct(3, normalOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number team
             */
            Touch.addTeam = function (builder, team) {
                builder.addFieldInt32(4, team, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number playerIndex
             */
            Touch.addPlayerIndex = function (builder, playerIndex) {
                builder.addFieldInt32(5, playerIndex, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            Touch.endTouch = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            Touch.createTouch = function (builder, playerNameOffset, gameSeconds, locationOffset, normalOffset, team, playerIndex) {
                Touch.startTouch(builder);
                Touch.addPlayerName(builder, playerNameOffset);
                Touch.addGameSeconds(builder, gameSeconds);
                Touch.addLocation(builder, locationOffset);
                Touch.addNormal(builder, normalOffset);
                Touch.addTeam(builder, team);
                Touch.addPlayerIndex(builder, playerIndex);
                return Touch.endTouch(builder);
            };
            return Touch;
        }());
        flat.Touch = Touch;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var ScoreInfo = /** @class */ (function () {
            function ScoreInfo() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns ScoreInfo
             */
            ScoreInfo.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param ScoreInfo= obj
             * @returns ScoreInfo
             */
            ScoreInfo.getRootAsScoreInfo = function (bb, obj) {
                return (obj || new ScoreInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param ScoreInfo= obj
             * @returns ScoreInfo
             */
            ScoreInfo.getSizePrefixedRootAsScoreInfo = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new ScoreInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @returns number
             */
            ScoreInfo.prototype.score = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            ScoreInfo.prototype.goals = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            ScoreInfo.prototype.ownGoals = function () {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            ScoreInfo.prototype.assists = function () {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            ScoreInfo.prototype.saves = function () {
                var offset = this.bb.__offset(this.bb_pos, 12);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            ScoreInfo.prototype.shots = function () {
                var offset = this.bb.__offset(this.bb_pos, 14);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            ScoreInfo.prototype.demolitions = function () {
                var offset = this.bb.__offset(this.bb_pos, 16);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            ScoreInfo.startScoreInfo = function (builder) {
                builder.startObject(7);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number score
             */
            ScoreInfo.addScore = function (builder, score) {
                builder.addFieldInt32(0, score, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number goals
             */
            ScoreInfo.addGoals = function (builder, goals) {
                builder.addFieldInt32(1, goals, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number ownGoals
             */
            ScoreInfo.addOwnGoals = function (builder, ownGoals) {
                builder.addFieldInt32(2, ownGoals, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number assists
             */
            ScoreInfo.addAssists = function (builder, assists) {
                builder.addFieldInt32(3, assists, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number saves
             */
            ScoreInfo.addSaves = function (builder, saves) {
                builder.addFieldInt32(4, saves, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number shots
             */
            ScoreInfo.addShots = function (builder, shots) {
                builder.addFieldInt32(5, shots, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number demolitions
             */
            ScoreInfo.addDemolitions = function (builder, demolitions) {
                builder.addFieldInt32(6, demolitions, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            ScoreInfo.endScoreInfo = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            ScoreInfo.createScoreInfo = function (builder, score, goals, ownGoals, assists, saves, shots, demolitions) {
                ScoreInfo.startScoreInfo(builder);
                ScoreInfo.addScore(builder, score);
                ScoreInfo.addGoals(builder, goals);
                ScoreInfo.addOwnGoals(builder, ownGoals);
                ScoreInfo.addAssists(builder, assists);
                ScoreInfo.addSaves(builder, saves);
                ScoreInfo.addShots(builder, shots);
                ScoreInfo.addDemolitions(builder, demolitions);
                return ScoreInfo.endScoreInfo(builder);
            };
            return ScoreInfo;
        }());
        flat.ScoreInfo = ScoreInfo;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var Physics = /** @class */ (function () {
            function Physics() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns Physics
             */
            Physics.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param Physics= obj
             * @returns Physics
             */
            Physics.getRootAsPhysics = function (bb, obj) {
                return (obj || new Physics()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param Physics= obj
             * @returns Physics
             */
            Physics.getSizePrefixedRootAsPhysics = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new Physics()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param rlbot.flat.Vector3= obj
             * @returns rlbot.flat.Vector3|null
             */
            Physics.prototype.location = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.Vector3()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Rotator= obj
             * @returns rlbot.flat.Rotator|null
             */
            Physics.prototype.rotation = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? (obj || new rlbot.flat.Rotator()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Vector3= obj
             * @returns rlbot.flat.Vector3|null
             */
            Physics.prototype.velocity = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? (obj || new rlbot.flat.Vector3()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Vector3= obj
             * @returns rlbot.flat.Vector3|null
             */
            Physics.prototype.angularVelocity = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? (obj || new rlbot.flat.Vector3()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            Physics.startPhysics = function (builder) {
                builder.startObject(4);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset locationOffset
             */
            Physics.addLocation = function (builder, locationOffset) {
                builder.addFieldStruct(0, locationOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset rotationOffset
             */
            Physics.addRotation = function (builder, rotationOffset) {
                builder.addFieldStruct(1, rotationOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset velocityOffset
             */
            Physics.addVelocity = function (builder, velocityOffset) {
                builder.addFieldStruct(2, velocityOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset angularVelocityOffset
             */
            Physics.addAngularVelocity = function (builder, angularVelocityOffset) {
                builder.addFieldStruct(3, angularVelocityOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            Physics.endPhysics = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            Physics.createPhysics = function (builder, locationOffset, rotationOffset, velocityOffset, angularVelocityOffset) {
                Physics.startPhysics(builder);
                Physics.addLocation(builder, locationOffset);
                Physics.addRotation(builder, rotationOffset);
                Physics.addVelocity(builder, velocityOffset);
                Physics.addAngularVelocity(builder, angularVelocityOffset);
                return Physics.endPhysics(builder);
            };
            return Physics;
        }());
        flat.Physics = Physics;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var PlayerInfo = /** @class */ (function () {
            function PlayerInfo() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns PlayerInfo
             */
            PlayerInfo.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param PlayerInfo= obj
             * @returns PlayerInfo
             */
            PlayerInfo.getRootAsPlayerInfo = function (bb, obj) {
                return (obj || new PlayerInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param PlayerInfo= obj
             * @returns PlayerInfo
             */
            PlayerInfo.getSizePrefixedRootAsPlayerInfo = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new PlayerInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param rlbot.flat.Physics= obj
             * @returns rlbot.flat.Physics|null
             */
            PlayerInfo.prototype.physics = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.Physics()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.ScoreInfo= obj
             * @returns rlbot.flat.ScoreInfo|null
             */
            PlayerInfo.prototype.scoreInfo = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? (obj || new rlbot.flat.ScoreInfo()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @returns boolean
             */
            PlayerInfo.prototype.isDemolished = function () {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * True if your wheels are on the ground, the wall, or the ceiling. False if you're midair or turtling.
             *
             * @returns boolean
             */
            PlayerInfo.prototype.hasWheelContact = function () {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * @returns boolean
             */
            PlayerInfo.prototype.isSupersonic = function () {
                var offset = this.bb.__offset(this.bb_pos, 12);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * @returns boolean
             */
            PlayerInfo.prototype.isBot = function () {
                var offset = this.bb.__offset(this.bb_pos, 14);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * True if the player has jumped. Falling off the ceiling / driving off the goal post does not count.
             *
             * @returns boolean
             */
            PlayerInfo.prototype.jumped = function () {
                var offset = this.bb.__offset(this.bb_pos, 16);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             *  True if player has double jumped. False does not mean you have a jump remaining, because the
             *  aerial timer can run out, and that doesn't affect this flag.
             *
             * @returns boolean
             */
            PlayerInfo.prototype.doubleJumped = function () {
                var offset = this.bb.__offset(this.bb_pos, 18);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            PlayerInfo.prototype.name = function (optionalEncoding) {
                var offset = this.bb.__offset(this.bb_pos, 20);
                return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
            };
            ;
            /**
             * @returns number
             */
            PlayerInfo.prototype.team = function () {
                var offset = this.bb.__offset(this.bb_pos, 22);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            PlayerInfo.prototype.boost = function () {
                var offset = this.bb.__offset(this.bb_pos, 24);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param rlbot.flat.BoxShape= obj
             * @returns rlbot.flat.BoxShape|null
             */
            PlayerInfo.prototype.hitbox = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 26);
                return offset ? (obj || new rlbot.flat.BoxShape()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Vector3= obj
             * @returns rlbot.flat.Vector3|null
             */
            PlayerInfo.prototype.hitboxOffset = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 28);
                return offset ? (obj || new rlbot.flat.Vector3()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * In the case where the requested player index is not available, spawnId will help
             * the framework figure out what index was actually assigned to this player instead.
             *
             * @returns number
             */
            PlayerInfo.prototype.spawnId = function () {
                var offset = this.bb.__offset(this.bb_pos, 30);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            PlayerInfo.startPlayerInfo = function (builder) {
                builder.startObject(14);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset physicsOffset
             */
            PlayerInfo.addPhysics = function (builder, physicsOffset) {
                builder.addFieldOffset(0, physicsOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset scoreInfoOffset
             */
            PlayerInfo.addScoreInfo = function (builder, scoreInfoOffset) {
                builder.addFieldOffset(1, scoreInfoOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean isDemolished
             */
            PlayerInfo.addIsDemolished = function (builder, isDemolished) {
                builder.addFieldInt8(2, +isDemolished, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean hasWheelContact
             */
            PlayerInfo.addHasWheelContact = function (builder, hasWheelContact) {
                builder.addFieldInt8(3, +hasWheelContact, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean isSupersonic
             */
            PlayerInfo.addIsSupersonic = function (builder, isSupersonic) {
                builder.addFieldInt8(4, +isSupersonic, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean isBot
             */
            PlayerInfo.addIsBot = function (builder, isBot) {
                builder.addFieldInt8(5, +isBot, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean jumped
             */
            PlayerInfo.addJumped = function (builder, jumped) {
                builder.addFieldInt8(6, +jumped, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean doubleJumped
             */
            PlayerInfo.addDoubleJumped = function (builder, doubleJumped) {
                builder.addFieldInt8(7, +doubleJumped, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset nameOffset
             */
            PlayerInfo.addName = function (builder, nameOffset) {
                builder.addFieldOffset(8, nameOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number team
             */
            PlayerInfo.addTeam = function (builder, team) {
                builder.addFieldInt32(9, team, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number boost
             */
            PlayerInfo.addBoost = function (builder, boost) {
                builder.addFieldInt32(10, boost, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset hitboxOffset
             */
            PlayerInfo.addHitbox = function (builder, hitboxOffset) {
                builder.addFieldOffset(11, hitboxOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset hitboxOffsetOffset
             */
            PlayerInfo.addHitboxOffset = function (builder, hitboxOffsetOffset) {
                builder.addFieldStruct(12, hitboxOffsetOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number spawnId
             */
            PlayerInfo.addSpawnId = function (builder, spawnId) {
                builder.addFieldInt32(13, spawnId, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            PlayerInfo.endPlayerInfo = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            PlayerInfo.createPlayerInfo = function (builder, physicsOffset, scoreInfoOffset, isDemolished, hasWheelContact, isSupersonic, isBot, jumped, doubleJumped, nameOffset, team, boost, hitboxOffset, hitboxOffsetOffset, spawnId) {
                PlayerInfo.startPlayerInfo(builder);
                PlayerInfo.addPhysics(builder, physicsOffset);
                PlayerInfo.addScoreInfo(builder, scoreInfoOffset);
                PlayerInfo.addIsDemolished(builder, isDemolished);
                PlayerInfo.addHasWheelContact(builder, hasWheelContact);
                PlayerInfo.addIsSupersonic(builder, isSupersonic);
                PlayerInfo.addIsBot(builder, isBot);
                PlayerInfo.addJumped(builder, jumped);
                PlayerInfo.addDoubleJumped(builder, doubleJumped);
                PlayerInfo.addName(builder, nameOffset);
                PlayerInfo.addTeam(builder, team);
                PlayerInfo.addBoost(builder, boost);
                PlayerInfo.addHitbox(builder, hitboxOffset);
                PlayerInfo.addHitboxOffset(builder, hitboxOffsetOffset);
                PlayerInfo.addSpawnId(builder, spawnId);
                return PlayerInfo.endPlayerInfo(builder);
            };
            return PlayerInfo;
        }());
        flat.PlayerInfo = PlayerInfo;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var DropShotBallInfo = /** @class */ (function () {
            function DropShotBallInfo() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns DropShotBallInfo
             */
            DropShotBallInfo.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param DropShotBallInfo= obj
             * @returns DropShotBallInfo
             */
            DropShotBallInfo.getRootAsDropShotBallInfo = function (bb, obj) {
                return (obj || new DropShotBallInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param DropShotBallInfo= obj
             * @returns DropShotBallInfo
             */
            DropShotBallInfo.getSizePrefixedRootAsDropShotBallInfo = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new DropShotBallInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @returns number
             */
            DropShotBallInfo.prototype.absorbedForce = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * @returns number
             */
            DropShotBallInfo.prototype.damageIndex = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            DropShotBallInfo.prototype.forceAccumRecent = function () {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            DropShotBallInfo.startDropShotBallInfo = function (builder) {
                builder.startObject(3);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number absorbedForce
             */
            DropShotBallInfo.addAbsorbedForce = function (builder, absorbedForce) {
                builder.addFieldFloat32(0, absorbedForce, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number damageIndex
             */
            DropShotBallInfo.addDamageIndex = function (builder, damageIndex) {
                builder.addFieldInt32(1, damageIndex, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number forceAccumRecent
             */
            DropShotBallInfo.addForceAccumRecent = function (builder, forceAccumRecent) {
                builder.addFieldFloat32(2, forceAccumRecent, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            DropShotBallInfo.endDropShotBallInfo = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            DropShotBallInfo.createDropShotBallInfo = function (builder, absorbedForce, damageIndex, forceAccumRecent) {
                DropShotBallInfo.startDropShotBallInfo(builder);
                DropShotBallInfo.addAbsorbedForce(builder, absorbedForce);
                DropShotBallInfo.addDamageIndex(builder, damageIndex);
                DropShotBallInfo.addForceAccumRecent(builder, forceAccumRecent);
                return DropShotBallInfo.endDropShotBallInfo(builder);
            };
            return DropShotBallInfo;
        }());
        flat.DropShotBallInfo = DropShotBallInfo;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var BallInfo = /** @class */ (function () {
            function BallInfo() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns BallInfo
             */
            BallInfo.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param BallInfo= obj
             * @returns BallInfo
             */
            BallInfo.getRootAsBallInfo = function (bb, obj) {
                return (obj || new BallInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param BallInfo= obj
             * @returns BallInfo
             */
            BallInfo.getSizePrefixedRootAsBallInfo = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new BallInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param rlbot.flat.Physics= obj
             * @returns rlbot.flat.Physics|null
             */
            BallInfo.prototype.physics = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.Physics()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Touch= obj
             * @returns rlbot.flat.Touch|null
             */
            BallInfo.prototype.latestTouch = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? (obj || new rlbot.flat.Touch()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.DropShotBallInfo= obj
             * @returns rlbot.flat.DropShotBallInfo|null
             */
            BallInfo.prototype.dropShotInfo = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? (obj || new rlbot.flat.DropShotBallInfo()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @returns rlbot.flat.CollisionShape
             */
            BallInfo.prototype.shapeType = function () {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? /**  */ (this.bb.readUint8(this.bb_pos + offset)) : rlbot.flat.CollisionShape.NONE;
            };
            ;
            /**
             * @param flatbuffers.Table obj
             * @returns ?flatbuffers.Table
             */
            BallInfo.prototype.shape = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 12);
                return offset ? this.bb.__union(obj, this.bb_pos + offset) : null;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            BallInfo.startBallInfo = function (builder) {
                builder.startObject(5);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset physicsOffset
             */
            BallInfo.addPhysics = function (builder, physicsOffset) {
                builder.addFieldOffset(0, physicsOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset latestTouchOffset
             */
            BallInfo.addLatestTouch = function (builder, latestTouchOffset) {
                builder.addFieldOffset(1, latestTouchOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset dropShotInfoOffset
             */
            BallInfo.addDropShotInfo = function (builder, dropShotInfoOffset) {
                builder.addFieldOffset(2, dropShotInfoOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.CollisionShape shapeType
             */
            BallInfo.addShapeType = function (builder, shapeType) {
                builder.addFieldInt8(3, shapeType, rlbot.flat.CollisionShape.NONE);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset shapeOffset
             */
            BallInfo.addShape = function (builder, shapeOffset) {
                builder.addFieldOffset(4, shapeOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            BallInfo.endBallInfo = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            BallInfo.createBallInfo = function (builder, physicsOffset, latestTouchOffset, dropShotInfoOffset, shapeType, shapeOffset) {
                BallInfo.startBallInfo(builder);
                BallInfo.addPhysics(builder, physicsOffset);
                BallInfo.addLatestTouch(builder, latestTouchOffset);
                BallInfo.addDropShotInfo(builder, dropShotInfoOffset);
                BallInfo.addShapeType(builder, shapeType);
                BallInfo.addShape(builder, shapeOffset);
                return BallInfo.endBallInfo(builder);
            };
            return BallInfo;
        }());
        flat.BallInfo = BallInfo;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var BoostPadState = /** @class */ (function () {
            function BoostPadState() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns BoostPadState
             */
            BoostPadState.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param BoostPadState= obj
             * @returns BoostPadState
             */
            BoostPadState.getRootAsBoostPadState = function (bb, obj) {
                return (obj || new BoostPadState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param BoostPadState= obj
             * @returns BoostPadState
             */
            BoostPadState.getSizePrefixedRootAsBoostPadState = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new BoostPadState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * True if the boost can be picked up
             *
             * @returns boolean
             */
            BoostPadState.prototype.isActive = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * The number of seconds since the boost has been picked up, or 0.0 if the boost is active.
             *
             * @returns number
             */
            BoostPadState.prototype.timer = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            BoostPadState.startBoostPadState = function (builder) {
                builder.startObject(2);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean isActive
             */
            BoostPadState.addIsActive = function (builder, isActive) {
                builder.addFieldInt8(0, +isActive, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number timer
             */
            BoostPadState.addTimer = function (builder, timer) {
                builder.addFieldFloat32(1, timer, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            BoostPadState.endBoostPadState = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            BoostPadState.createBoostPadState = function (builder, isActive, timer) {
                BoostPadState.startBoostPadState(builder);
                BoostPadState.addIsActive(builder, isActive);
                BoostPadState.addTimer(builder, timer);
                return BoostPadState.endBoostPadState(builder);
            };
            return BoostPadState;
        }());
        flat.BoostPadState = BoostPadState;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var DropshotTile = /** @class */ (function () {
            function DropshotTile() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns DropshotTile
             */
            DropshotTile.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param DropshotTile= obj
             * @returns DropshotTile
             */
            DropshotTile.getRootAsDropshotTile = function (bb, obj) {
                return (obj || new DropshotTile()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param DropshotTile= obj
             * @returns DropshotTile
             */
            DropshotTile.getSizePrefixedRootAsDropshotTile = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new DropshotTile()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * The amount of damage the tile has sustained.
             *
             * @returns rlbot.flat.TileState
             */
            DropshotTile.prototype.tileState = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : rlbot.flat.TileState.Unknown;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            DropshotTile.startDropshotTile = function (builder) {
                builder.startObject(1);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.TileState tileState
             */
            DropshotTile.addTileState = function (builder, tileState) {
                builder.addFieldInt8(0, tileState, rlbot.flat.TileState.Unknown);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            DropshotTile.endDropshotTile = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            DropshotTile.createDropshotTile = function (builder, tileState) {
                DropshotTile.startDropshotTile(builder);
                DropshotTile.addTileState(builder, tileState);
                return DropshotTile.endDropshotTile(builder);
            };
            return DropshotTile;
        }());
        flat.DropshotTile = DropshotTile;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var GameInfo = /** @class */ (function () {
            function GameInfo() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns GameInfo
             */
            GameInfo.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param GameInfo= obj
             * @returns GameInfo
             */
            GameInfo.getRootAsGameInfo = function (bb, obj) {
                return (obj || new GameInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param GameInfo= obj
             * @returns GameInfo
             */
            GameInfo.getSizePrefixedRootAsGameInfo = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new GameInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @returns number
             */
            GameInfo.prototype.secondsElapsed = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * @returns number
             */
            GameInfo.prototype.gameTimeRemaining = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * @returns boolean
             */
            GameInfo.prototype.isOvertime = function () {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * @returns boolean
             */
            GameInfo.prototype.isUnlimitedTime = function () {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * True when cars are allowed to move, and during the pause menu. False during replays.
             *
             * @returns boolean
             */
            GameInfo.prototype.isRoundActive = function () {
                var offset = this.bb.__offset(this.bb_pos, 12);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * True when the clock is paused due to kickoff, but false during kickoff countdown. In other words, it is true
             * while cars can move during kickoff. Note that if both players sit still, game clock start and this will become false.
             *
             * @returns boolean
             */
            GameInfo.prototype.isKickoffPause = function () {
                var offset = this.bb.__offset(this.bb_pos, 14);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * Turns true after final replay, the moment the 'winner' screen appears. Remains true during next match
             * countdown. Turns false again the moment the 'choose team' screen appears.
             *
             * @returns boolean
             */
            GameInfo.prototype.isMatchEnded = function () {
                var offset = this.bb.__offset(this.bb_pos, 16);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * @returns number
             */
            GameInfo.prototype.worldGravityZ = function () {
                var offset = this.bb.__offset(this.bb_pos, 18);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * Game speed multiplier, 1.0 is regular game speed.
             *
             * @returns number
             */
            GameInfo.prototype.gameSpeed = function () {
                var offset = this.bb.__offset(this.bb_pos, 20);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * Tracks the number of physics frames the game has computed.
             * May increase by more than one across consecutive packets.
             * Data type will roll over after 207 days at 120Hz.
             *
             * @returns number
             */
            GameInfo.prototype.frameNum = function () {
                var offset = this.bb.__offset(this.bb_pos, 22);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            GameInfo.startGameInfo = function (builder) {
                builder.startObject(10);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number secondsElapsed
             */
            GameInfo.addSecondsElapsed = function (builder, secondsElapsed) {
                builder.addFieldFloat32(0, secondsElapsed, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number gameTimeRemaining
             */
            GameInfo.addGameTimeRemaining = function (builder, gameTimeRemaining) {
                builder.addFieldFloat32(1, gameTimeRemaining, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean isOvertime
             */
            GameInfo.addIsOvertime = function (builder, isOvertime) {
                builder.addFieldInt8(2, +isOvertime, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean isUnlimitedTime
             */
            GameInfo.addIsUnlimitedTime = function (builder, isUnlimitedTime) {
                builder.addFieldInt8(3, +isUnlimitedTime, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean isRoundActive
             */
            GameInfo.addIsRoundActive = function (builder, isRoundActive) {
                builder.addFieldInt8(4, +isRoundActive, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean isKickoffPause
             */
            GameInfo.addIsKickoffPause = function (builder, isKickoffPause) {
                builder.addFieldInt8(5, +isKickoffPause, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean isMatchEnded
             */
            GameInfo.addIsMatchEnded = function (builder, isMatchEnded) {
                builder.addFieldInt8(6, +isMatchEnded, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number worldGravityZ
             */
            GameInfo.addWorldGravityZ = function (builder, worldGravityZ) {
                builder.addFieldFloat32(7, worldGravityZ, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number gameSpeed
             */
            GameInfo.addGameSpeed = function (builder, gameSpeed) {
                builder.addFieldFloat32(8, gameSpeed, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number frameNum
             */
            GameInfo.addFrameNum = function (builder, frameNum) {
                builder.addFieldInt32(9, frameNum, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            GameInfo.endGameInfo = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            GameInfo.createGameInfo = function (builder, secondsElapsed, gameTimeRemaining, isOvertime, isUnlimitedTime, isRoundActive, isKickoffPause, isMatchEnded, worldGravityZ, gameSpeed, frameNum) {
                GameInfo.startGameInfo(builder);
                GameInfo.addSecondsElapsed(builder, secondsElapsed);
                GameInfo.addGameTimeRemaining(builder, gameTimeRemaining);
                GameInfo.addIsOvertime(builder, isOvertime);
                GameInfo.addIsUnlimitedTime(builder, isUnlimitedTime);
                GameInfo.addIsRoundActive(builder, isRoundActive);
                GameInfo.addIsKickoffPause(builder, isKickoffPause);
                GameInfo.addIsMatchEnded(builder, isMatchEnded);
                GameInfo.addWorldGravityZ(builder, worldGravityZ);
                GameInfo.addGameSpeed(builder, gameSpeed);
                GameInfo.addFrameNum(builder, frameNum);
                return GameInfo.endGameInfo(builder);
            };
            return GameInfo;
        }());
        flat.GameInfo = GameInfo;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var TeamInfo = /** @class */ (function () {
            function TeamInfo() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns TeamInfo
             */
            TeamInfo.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param TeamInfo= obj
             * @returns TeamInfo
             */
            TeamInfo.getRootAsTeamInfo = function (bb, obj) {
                return (obj || new TeamInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param TeamInfo= obj
             * @returns TeamInfo
             */
            TeamInfo.getSizePrefixedRootAsTeamInfo = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new TeamInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @returns number
             */
            TeamInfo.prototype.teamIndex = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * number of goals scored.
             *
             * @returns number
             */
            TeamInfo.prototype.score = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            TeamInfo.startTeamInfo = function (builder) {
                builder.startObject(2);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number teamIndex
             */
            TeamInfo.addTeamIndex = function (builder, teamIndex) {
                builder.addFieldInt32(0, teamIndex, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number score
             */
            TeamInfo.addScore = function (builder, score) {
                builder.addFieldInt32(1, score, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            TeamInfo.endTeamInfo = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            TeamInfo.createTeamInfo = function (builder, teamIndex, score) {
                TeamInfo.startTeamInfo(builder);
                TeamInfo.addTeamIndex(builder, teamIndex);
                TeamInfo.addScore(builder, score);
                return TeamInfo.endTeamInfo(builder);
            };
            return TeamInfo;
        }());
        flat.TeamInfo = TeamInfo;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var GameTickPacket = /** @class */ (function () {
            function GameTickPacket() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns GameTickPacket
             */
            GameTickPacket.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param GameTickPacket= obj
             * @returns GameTickPacket
             */
            GameTickPacket.getRootAsGameTickPacket = function (bb, obj) {
                return (obj || new GameTickPacket()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param GameTickPacket= obj
             * @returns GameTickPacket
             */
            GameTickPacket.getSizePrefixedRootAsGameTickPacket = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new GameTickPacket()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param number index
             * @param rlbot.flat.PlayerInfo= obj
             * @returns rlbot.flat.PlayerInfo
             */
            GameTickPacket.prototype.players = function (index, obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.PlayerInfo()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
            };
            ;
            /**
             * @returns number
             */
            GameTickPacket.prototype.playersLength = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param number index
             * @param rlbot.flat.BoostPadState= obj
             * @returns rlbot.flat.BoostPadState
             */
            GameTickPacket.prototype.boostPadStates = function (index, obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? (obj || new rlbot.flat.BoostPadState()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
            };
            ;
            /**
             * @returns number
             */
            GameTickPacket.prototype.boostPadStatesLength = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param rlbot.flat.BallInfo= obj
             * @returns rlbot.flat.BallInfo|null
             */
            GameTickPacket.prototype.ball = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? (obj || new rlbot.flat.BallInfo()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.GameInfo= obj
             * @returns rlbot.flat.GameInfo|null
             */
            GameTickPacket.prototype.gameInfo = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? (obj || new rlbot.flat.GameInfo()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @param number index
             * @param rlbot.flat.DropshotTile= obj
             * @returns rlbot.flat.DropshotTile
             */
            GameTickPacket.prototype.tileInformation = function (index, obj) {
                var offset = this.bb.__offset(this.bb_pos, 12);
                return offset ? (obj || new rlbot.flat.DropshotTile()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
            };
            ;
            /**
             * @returns number
             */
            GameTickPacket.prototype.tileInformationLength = function () {
                var offset = this.bb.__offset(this.bb_pos, 12);
                return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param number index
             * @param rlbot.flat.TeamInfo= obj
             * @returns rlbot.flat.TeamInfo
             */
            GameTickPacket.prototype.teams = function (index, obj) {
                var offset = this.bb.__offset(this.bb_pos, 14);
                return offset ? (obj || new rlbot.flat.TeamInfo()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
            };
            ;
            /**
             * @returns number
             */
            GameTickPacket.prototype.teamsLength = function () {
                var offset = this.bb.__offset(this.bb_pos, 14);
                return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            GameTickPacket.startGameTickPacket = function (builder) {
                builder.startObject(6);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset playersOffset
             */
            GameTickPacket.addPlayers = function (builder, playersOffset) {
                builder.addFieldOffset(0, playersOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param Array.<flatbuffers.Offset> data
             * @returns flatbuffers.Offset
             */
            GameTickPacket.createPlayersVector = function (builder, data) {
                builder.startVector(4, data.length, 4);
                for (var i = data.length - 1; i >= 0; i--) {
                    builder.addOffset(data[i]);
                }
                return builder.endVector();
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number numElems
             */
            GameTickPacket.startPlayersVector = function (builder, numElems) {
                builder.startVector(4, numElems, 4);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset boostPadStatesOffset
             */
            GameTickPacket.addBoostPadStates = function (builder, boostPadStatesOffset) {
                builder.addFieldOffset(1, boostPadStatesOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param Array.<flatbuffers.Offset> data
             * @returns flatbuffers.Offset
             */
            GameTickPacket.createBoostPadStatesVector = function (builder, data) {
                builder.startVector(4, data.length, 4);
                for (var i = data.length - 1; i >= 0; i--) {
                    builder.addOffset(data[i]);
                }
                return builder.endVector();
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number numElems
             */
            GameTickPacket.startBoostPadStatesVector = function (builder, numElems) {
                builder.startVector(4, numElems, 4);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset ballOffset
             */
            GameTickPacket.addBall = function (builder, ballOffset) {
                builder.addFieldOffset(2, ballOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset gameInfoOffset
             */
            GameTickPacket.addGameInfo = function (builder, gameInfoOffset) {
                builder.addFieldOffset(3, gameInfoOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset tileInformationOffset
             */
            GameTickPacket.addTileInformation = function (builder, tileInformationOffset) {
                builder.addFieldOffset(4, tileInformationOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param Array.<flatbuffers.Offset> data
             * @returns flatbuffers.Offset
             */
            GameTickPacket.createTileInformationVector = function (builder, data) {
                builder.startVector(4, data.length, 4);
                for (var i = data.length - 1; i >= 0; i--) {
                    builder.addOffset(data[i]);
                }
                return builder.endVector();
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number numElems
             */
            GameTickPacket.startTileInformationVector = function (builder, numElems) {
                builder.startVector(4, numElems, 4);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset teamsOffset
             */
            GameTickPacket.addTeams = function (builder, teamsOffset) {
                builder.addFieldOffset(5, teamsOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param Array.<flatbuffers.Offset> data
             * @returns flatbuffers.Offset
             */
            GameTickPacket.createTeamsVector = function (builder, data) {
                builder.startVector(4, data.length, 4);
                for (var i = data.length - 1; i >= 0; i--) {
                    builder.addOffset(data[i]);
                }
                return builder.endVector();
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number numElems
             */
            GameTickPacket.startTeamsVector = function (builder, numElems) {
                builder.startVector(4, numElems, 4);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            GameTickPacket.endGameTickPacket = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            GameTickPacket.createGameTickPacket = function (builder, playersOffset, boostPadStatesOffset, ballOffset, gameInfoOffset, tileInformationOffset, teamsOffset) {
                GameTickPacket.startGameTickPacket(builder);
                GameTickPacket.addPlayers(builder, playersOffset);
                GameTickPacket.addBoostPadStates(builder, boostPadStatesOffset);
                GameTickPacket.addBall(builder, ballOffset);
                GameTickPacket.addGameInfo(builder, gameInfoOffset);
                GameTickPacket.addTileInformation(builder, tileInformationOffset);
                GameTickPacket.addTeams(builder, teamsOffset);
                return GameTickPacket.endGameTickPacket(builder);
            };
            return GameTickPacket;
        }());
        flat.GameTickPacket = GameTickPacket;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * The state of a rigid body in Rocket League's physics engine.
 * This gets updated in time with the physics tick, not the rendering framerate.
 * The frame field will be incremented every time the physics engine ticks.
 *
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var RigidBodyState = /** @class */ (function () {
            function RigidBodyState() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns RigidBodyState
             */
            RigidBodyState.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param RigidBodyState= obj
             * @returns RigidBodyState
             */
            RigidBodyState.getRootAsRigidBodyState = function (bb, obj) {
                return (obj || new RigidBodyState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param RigidBodyState= obj
             * @returns RigidBodyState
             */
            RigidBodyState.getSizePrefixedRootAsRigidBodyState = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new RigidBodyState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @returns number
             */
            RigidBodyState.prototype.frame = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param rlbot.flat.Vector3= obj
             * @returns rlbot.flat.Vector3|null
             */
            RigidBodyState.prototype.location = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? (obj || new rlbot.flat.Vector3()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Quaternion= obj
             * @returns rlbot.flat.Quaternion|null
             */
            RigidBodyState.prototype.rotation = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? (obj || new rlbot.flat.Quaternion()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Vector3= obj
             * @returns rlbot.flat.Vector3|null
             */
            RigidBodyState.prototype.velocity = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? (obj || new rlbot.flat.Vector3()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Vector3= obj
             * @returns rlbot.flat.Vector3|null
             */
            RigidBodyState.prototype.angularVelocity = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 12);
                return offset ? (obj || new rlbot.flat.Vector3()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            RigidBodyState.startRigidBodyState = function (builder) {
                builder.startObject(5);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number frame
             */
            RigidBodyState.addFrame = function (builder, frame) {
                builder.addFieldInt32(0, frame, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset locationOffset
             */
            RigidBodyState.addLocation = function (builder, locationOffset) {
                builder.addFieldStruct(1, locationOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset rotationOffset
             */
            RigidBodyState.addRotation = function (builder, rotationOffset) {
                builder.addFieldStruct(2, rotationOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset velocityOffset
             */
            RigidBodyState.addVelocity = function (builder, velocityOffset) {
                builder.addFieldStruct(3, velocityOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset angularVelocityOffset
             */
            RigidBodyState.addAngularVelocity = function (builder, angularVelocityOffset) {
                builder.addFieldStruct(4, angularVelocityOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            RigidBodyState.endRigidBodyState = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            RigidBodyState.createRigidBodyState = function (builder, frame, locationOffset, rotationOffset, velocityOffset, angularVelocityOffset) {
                RigidBodyState.startRigidBodyState(builder);
                RigidBodyState.addFrame(builder, frame);
                RigidBodyState.addLocation(builder, locationOffset);
                RigidBodyState.addRotation(builder, rotationOffset);
                RigidBodyState.addVelocity(builder, velocityOffset);
                RigidBodyState.addAngularVelocity(builder, angularVelocityOffset);
                return RigidBodyState.endRigidBodyState(builder);
            };
            return RigidBodyState;
        }());
        flat.RigidBodyState = RigidBodyState;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * Rigid body state for a player / car in the game. Includes the latest
 * controller input, which is otherwise difficult to correlate with consequences.
 *
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var PlayerRigidBodyState = /** @class */ (function () {
            function PlayerRigidBodyState() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns PlayerRigidBodyState
             */
            PlayerRigidBodyState.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param PlayerRigidBodyState= obj
             * @returns PlayerRigidBodyState
             */
            PlayerRigidBodyState.getRootAsPlayerRigidBodyState = function (bb, obj) {
                return (obj || new PlayerRigidBodyState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param PlayerRigidBodyState= obj
             * @returns PlayerRigidBodyState
             */
            PlayerRigidBodyState.getSizePrefixedRootAsPlayerRigidBodyState = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new PlayerRigidBodyState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param rlbot.flat.RigidBodyState= obj
             * @returns rlbot.flat.RigidBodyState|null
             */
            PlayerRigidBodyState.prototype.state = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.RigidBodyState()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.ControllerState= obj
             * @returns rlbot.flat.ControllerState|null
             */
            PlayerRigidBodyState.prototype.input = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? (obj || new rlbot.flat.ControllerState()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            PlayerRigidBodyState.startPlayerRigidBodyState = function (builder) {
                builder.startObject(2);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset stateOffset
             */
            PlayerRigidBodyState.addState = function (builder, stateOffset) {
                builder.addFieldOffset(0, stateOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset inputOffset
             */
            PlayerRigidBodyState.addInput = function (builder, inputOffset) {
                builder.addFieldOffset(1, inputOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            PlayerRigidBodyState.endPlayerRigidBodyState = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            PlayerRigidBodyState.createPlayerRigidBodyState = function (builder, stateOffset, inputOffset) {
                PlayerRigidBodyState.startPlayerRigidBodyState(builder);
                PlayerRigidBodyState.addState(builder, stateOffset);
                PlayerRigidBodyState.addInput(builder, inputOffset);
                return PlayerRigidBodyState.endPlayerRigidBodyState(builder);
            };
            return PlayerRigidBodyState;
        }());
        flat.PlayerRigidBodyState = PlayerRigidBodyState;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * Rigid body state for the ball.
 *
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var BallRigidBodyState = /** @class */ (function () {
            function BallRigidBodyState() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns BallRigidBodyState
             */
            BallRigidBodyState.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param BallRigidBodyState= obj
             * @returns BallRigidBodyState
             */
            BallRigidBodyState.getRootAsBallRigidBodyState = function (bb, obj) {
                return (obj || new BallRigidBodyState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param BallRigidBodyState= obj
             * @returns BallRigidBodyState
             */
            BallRigidBodyState.getSizePrefixedRootAsBallRigidBodyState = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new BallRigidBodyState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param rlbot.flat.RigidBodyState= obj
             * @returns rlbot.flat.RigidBodyState|null
             */
            BallRigidBodyState.prototype.state = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.RigidBodyState()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            BallRigidBodyState.startBallRigidBodyState = function (builder) {
                builder.startObject(1);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset stateOffset
             */
            BallRigidBodyState.addState = function (builder, stateOffset) {
                builder.addFieldOffset(0, stateOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            BallRigidBodyState.endBallRigidBodyState = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            BallRigidBodyState.createBallRigidBodyState = function (builder, stateOffset) {
                BallRigidBodyState.startBallRigidBodyState(builder);
                BallRigidBodyState.addState(builder, stateOffset);
                return BallRigidBodyState.endBallRigidBodyState(builder);
            };
            return BallRigidBodyState;
        }());
        flat.BallRigidBodyState = BallRigidBodyState;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * Contains all rigid body state information.
 *
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var RigidBodyTick = /** @class */ (function () {
            function RigidBodyTick() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns RigidBodyTick
             */
            RigidBodyTick.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param RigidBodyTick= obj
             * @returns RigidBodyTick
             */
            RigidBodyTick.getRootAsRigidBodyTick = function (bb, obj) {
                return (obj || new RigidBodyTick()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param RigidBodyTick= obj
             * @returns RigidBodyTick
             */
            RigidBodyTick.getSizePrefixedRootAsRigidBodyTick = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new RigidBodyTick()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param rlbot.flat.BallRigidBodyState= obj
             * @returns rlbot.flat.BallRigidBodyState|null
             */
            RigidBodyTick.prototype.ball = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.BallRigidBodyState()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @param number index
             * @param rlbot.flat.PlayerRigidBodyState= obj
             * @returns rlbot.flat.PlayerRigidBodyState
             */
            RigidBodyTick.prototype.players = function (index, obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? (obj || new rlbot.flat.PlayerRigidBodyState()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
            };
            ;
            /**
             * @returns number
             */
            RigidBodyTick.prototype.playersLength = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            RigidBodyTick.startRigidBodyTick = function (builder) {
                builder.startObject(2);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset ballOffset
             */
            RigidBodyTick.addBall = function (builder, ballOffset) {
                builder.addFieldOffset(0, ballOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset playersOffset
             */
            RigidBodyTick.addPlayers = function (builder, playersOffset) {
                builder.addFieldOffset(1, playersOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param Array.<flatbuffers.Offset> data
             * @returns flatbuffers.Offset
             */
            RigidBodyTick.createPlayersVector = function (builder, data) {
                builder.startVector(4, data.length, 4);
                for (var i = data.length - 1; i >= 0; i--) {
                    builder.addOffset(data[i]);
                }
                return builder.endVector();
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number numElems
             */
            RigidBodyTick.startPlayersVector = function (builder, numElems) {
                builder.startVector(4, numElems, 4);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            RigidBodyTick.endRigidBodyTick = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            RigidBodyTick.createRigidBodyTick = function (builder, ballOffset, playersOffset) {
                RigidBodyTick.startRigidBodyTick(builder);
                RigidBodyTick.addBall(builder, ballOffset);
                RigidBodyTick.addPlayers(builder, playersOffset);
                return RigidBodyTick.endRigidBodyTick(builder);
            };
            return RigidBodyTick;
        }());
        flat.RigidBodyTick = RigidBodyTick;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var GoalInfo = /** @class */ (function () {
            function GoalInfo() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns GoalInfo
             */
            GoalInfo.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param GoalInfo= obj
             * @returns GoalInfo
             */
            GoalInfo.getRootAsGoalInfo = function (bb, obj) {
                return (obj || new GoalInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param GoalInfo= obj
             * @returns GoalInfo
             */
            GoalInfo.getSizePrefixedRootAsGoalInfo = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new GoalInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @returns number
             */
            GoalInfo.prototype.teamNum = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param rlbot.flat.Vector3= obj
             * @returns rlbot.flat.Vector3|null
             */
            GoalInfo.prototype.location = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? (obj || new rlbot.flat.Vector3()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Vector3= obj
             * @returns rlbot.flat.Vector3|null
             */
            GoalInfo.prototype.direction = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? (obj || new rlbot.flat.Vector3()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @returns number
             */
            GoalInfo.prototype.width = function () {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * @returns number
             */
            GoalInfo.prototype.height = function () {
                var offset = this.bb.__offset(this.bb_pos, 12);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            GoalInfo.startGoalInfo = function (builder) {
                builder.startObject(5);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number teamNum
             */
            GoalInfo.addTeamNum = function (builder, teamNum) {
                builder.addFieldInt32(0, teamNum, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset locationOffset
             */
            GoalInfo.addLocation = function (builder, locationOffset) {
                builder.addFieldStruct(1, locationOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset directionOffset
             */
            GoalInfo.addDirection = function (builder, directionOffset) {
                builder.addFieldStruct(2, directionOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number width
             */
            GoalInfo.addWidth = function (builder, width) {
                builder.addFieldFloat32(3, width, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number height
             */
            GoalInfo.addHeight = function (builder, height) {
                builder.addFieldFloat32(4, height, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            GoalInfo.endGoalInfo = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            GoalInfo.createGoalInfo = function (builder, teamNum, locationOffset, directionOffset, width, height) {
                GoalInfo.startGoalInfo(builder);
                GoalInfo.addTeamNum(builder, teamNum);
                GoalInfo.addLocation(builder, locationOffset);
                GoalInfo.addDirection(builder, directionOffset);
                GoalInfo.addWidth(builder, width);
                GoalInfo.addHeight(builder, height);
                return GoalInfo.endGoalInfo(builder);
            };
            return GoalInfo;
        }());
        flat.GoalInfo = GoalInfo;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var BoostPad = /** @class */ (function () {
            function BoostPad() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns BoostPad
             */
            BoostPad.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param BoostPad= obj
             * @returns BoostPad
             */
            BoostPad.getRootAsBoostPad = function (bb, obj) {
                return (obj || new BoostPad()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param BoostPad= obj
             * @returns BoostPad
             */
            BoostPad.getSizePrefixedRootAsBoostPad = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new BoostPad()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param rlbot.flat.Vector3= obj
             * @returns rlbot.flat.Vector3|null
             */
            BoostPad.prototype.location = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.Vector3()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @returns boolean
             */
            BoostPad.prototype.isFullBoost = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            BoostPad.startBoostPad = function (builder) {
                builder.startObject(2);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset locationOffset
             */
            BoostPad.addLocation = function (builder, locationOffset) {
                builder.addFieldStruct(0, locationOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean isFullBoost
             */
            BoostPad.addIsFullBoost = function (builder, isFullBoost) {
                builder.addFieldInt8(1, +isFullBoost, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            BoostPad.endBoostPad = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            BoostPad.createBoostPad = function (builder, locationOffset, isFullBoost) {
                BoostPad.startBoostPad(builder);
                BoostPad.addLocation(builder, locationOffset);
                BoostPad.addIsFullBoost(builder, isFullBoost);
                return BoostPad.endBoostPad(builder);
            };
            return BoostPad;
        }());
        flat.BoostPad = BoostPad;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var FieldInfo = /** @class */ (function () {
            function FieldInfo() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns FieldInfo
             */
            FieldInfo.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param FieldInfo= obj
             * @returns FieldInfo
             */
            FieldInfo.getRootAsFieldInfo = function (bb, obj) {
                return (obj || new FieldInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param FieldInfo= obj
             * @returns FieldInfo
             */
            FieldInfo.getSizePrefixedRootAsFieldInfo = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new FieldInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param number index
             * @param rlbot.flat.BoostPad= obj
             * @returns rlbot.flat.BoostPad
             */
            FieldInfo.prototype.boostPads = function (index, obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.BoostPad()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
            };
            ;
            /**
             * @returns number
             */
            FieldInfo.prototype.boostPadsLength = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param number index
             * @param rlbot.flat.GoalInfo= obj
             * @returns rlbot.flat.GoalInfo
             */
            FieldInfo.prototype.goals = function (index, obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? (obj || new rlbot.flat.GoalInfo()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
            };
            ;
            /**
             * @returns number
             */
            FieldInfo.prototype.goalsLength = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            FieldInfo.startFieldInfo = function (builder) {
                builder.startObject(2);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset boostPadsOffset
             */
            FieldInfo.addBoostPads = function (builder, boostPadsOffset) {
                builder.addFieldOffset(0, boostPadsOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param Array.<flatbuffers.Offset> data
             * @returns flatbuffers.Offset
             */
            FieldInfo.createBoostPadsVector = function (builder, data) {
                builder.startVector(4, data.length, 4);
                for (var i = data.length - 1; i >= 0; i--) {
                    builder.addOffset(data[i]);
                }
                return builder.endVector();
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number numElems
             */
            FieldInfo.startBoostPadsVector = function (builder, numElems) {
                builder.startVector(4, numElems, 4);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset goalsOffset
             */
            FieldInfo.addGoals = function (builder, goalsOffset) {
                builder.addFieldOffset(1, goalsOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param Array.<flatbuffers.Offset> data
             * @returns flatbuffers.Offset
             */
            FieldInfo.createGoalsVector = function (builder, data) {
                builder.startVector(4, data.length, 4);
                for (var i = data.length - 1; i >= 0; i--) {
                    builder.addOffset(data[i]);
                }
                return builder.endVector();
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number numElems
             */
            FieldInfo.startGoalsVector = function (builder, numElems) {
                builder.startVector(4, numElems, 4);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            FieldInfo.endFieldInfo = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            FieldInfo.createFieldInfo = function (builder, boostPadsOffset, goalsOffset) {
                FieldInfo.startFieldInfo(builder);
                FieldInfo.addBoostPads(builder, boostPadsOffset);
                FieldInfo.addGoals(builder, goalsOffset);
                return FieldInfo.endFieldInfo(builder);
            };
            return FieldInfo;
        }());
        flat.FieldInfo = FieldInfo;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var Float = /** @class */ (function () {
            function Float() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns Float
             */
            Float.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @returns number
             */
            Float.prototype.val = function () {
                return this.bb.readFloat32(this.bb_pos);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number val
             * @returns flatbuffers.Offset
             */
            Float.createFloat = function (builder, val) {
                builder.prep(4, 4);
                builder.writeFloat32(val);
                return builder.offset();
            };
            ;
            return Float;
        }());
        flat.Float = Float;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var Bool = /** @class */ (function () {
            function Bool() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns Bool
             */
            Bool.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @returns boolean
             */
            Bool.prototype.val = function () {
                return !!this.bb.readInt8(this.bb_pos);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean val
             * @returns flatbuffers.Offset
             */
            Bool.createBool = function (builder, val) {
                builder.prep(1, 1);
                builder.writeInt8(+val);
                return builder.offset();
            };
            ;
            return Bool;
        }());
        flat.Bool = Bool;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var Vector3Partial = /** @class */ (function () {
            function Vector3Partial() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns Vector3Partial
             */
            Vector3Partial.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param Vector3Partial= obj
             * @returns Vector3Partial
             */
            Vector3Partial.getRootAsVector3Partial = function (bb, obj) {
                return (obj || new Vector3Partial()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param Vector3Partial= obj
             * @returns Vector3Partial
             */
            Vector3Partial.getSizePrefixedRootAsVector3Partial = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new Vector3Partial()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param rlbot.flat.Float= obj
             * @returns rlbot.flat.Float|null
             */
            Vector3Partial.prototype.x = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.Float()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Float= obj
             * @returns rlbot.flat.Float|null
             */
            Vector3Partial.prototype.y = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? (obj || new rlbot.flat.Float()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Float= obj
             * @returns rlbot.flat.Float|null
             */
            Vector3Partial.prototype.z = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? (obj || new rlbot.flat.Float()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            Vector3Partial.startVector3Partial = function (builder) {
                builder.startObject(3);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset xOffset
             */
            Vector3Partial.addX = function (builder, xOffset) {
                builder.addFieldStruct(0, xOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset yOffset
             */
            Vector3Partial.addY = function (builder, yOffset) {
                builder.addFieldStruct(1, yOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset zOffset
             */
            Vector3Partial.addZ = function (builder, zOffset) {
                builder.addFieldStruct(2, zOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            Vector3Partial.endVector3Partial = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            Vector3Partial.createVector3Partial = function (builder, xOffset, yOffset, zOffset) {
                Vector3Partial.startVector3Partial(builder);
                Vector3Partial.addX(builder, xOffset);
                Vector3Partial.addY(builder, yOffset);
                Vector3Partial.addZ(builder, zOffset);
                return Vector3Partial.endVector3Partial(builder);
            };
            return Vector3Partial;
        }());
        flat.Vector3Partial = Vector3Partial;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var RotatorPartial = /** @class */ (function () {
            function RotatorPartial() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns RotatorPartial
             */
            RotatorPartial.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param RotatorPartial= obj
             * @returns RotatorPartial
             */
            RotatorPartial.getRootAsRotatorPartial = function (bb, obj) {
                return (obj || new RotatorPartial()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param RotatorPartial= obj
             * @returns RotatorPartial
             */
            RotatorPartial.getSizePrefixedRootAsRotatorPartial = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new RotatorPartial()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param rlbot.flat.Float= obj
             * @returns rlbot.flat.Float|null
             */
            RotatorPartial.prototype.pitch = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.Float()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Float= obj
             * @returns rlbot.flat.Float|null
             */
            RotatorPartial.prototype.yaw = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? (obj || new rlbot.flat.Float()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Float= obj
             * @returns rlbot.flat.Float|null
             */
            RotatorPartial.prototype.roll = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? (obj || new rlbot.flat.Float()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            RotatorPartial.startRotatorPartial = function (builder) {
                builder.startObject(3);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset pitchOffset
             */
            RotatorPartial.addPitch = function (builder, pitchOffset) {
                builder.addFieldStruct(0, pitchOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset yawOffset
             */
            RotatorPartial.addYaw = function (builder, yawOffset) {
                builder.addFieldStruct(1, yawOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset rollOffset
             */
            RotatorPartial.addRoll = function (builder, rollOffset) {
                builder.addFieldStruct(2, rollOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            RotatorPartial.endRotatorPartial = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            RotatorPartial.createRotatorPartial = function (builder, pitchOffset, yawOffset, rollOffset) {
                RotatorPartial.startRotatorPartial(builder);
                RotatorPartial.addPitch(builder, pitchOffset);
                RotatorPartial.addYaw(builder, yawOffset);
                RotatorPartial.addRoll(builder, rollOffset);
                return RotatorPartial.endRotatorPartial(builder);
            };
            return RotatorPartial;
        }());
        flat.RotatorPartial = RotatorPartial;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var DesiredPhysics = /** @class */ (function () {
            function DesiredPhysics() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns DesiredPhysics
             */
            DesiredPhysics.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param DesiredPhysics= obj
             * @returns DesiredPhysics
             */
            DesiredPhysics.getRootAsDesiredPhysics = function (bb, obj) {
                return (obj || new DesiredPhysics()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param DesiredPhysics= obj
             * @returns DesiredPhysics
             */
            DesiredPhysics.getSizePrefixedRootAsDesiredPhysics = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new DesiredPhysics()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param rlbot.flat.Vector3Partial= obj
             * @returns rlbot.flat.Vector3Partial|null
             */
            DesiredPhysics.prototype.location = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.Vector3Partial()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.RotatorPartial= obj
             * @returns rlbot.flat.RotatorPartial|null
             */
            DesiredPhysics.prototype.rotation = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? (obj || new rlbot.flat.RotatorPartial()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Vector3Partial= obj
             * @returns rlbot.flat.Vector3Partial|null
             */
            DesiredPhysics.prototype.velocity = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? (obj || new rlbot.flat.Vector3Partial()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Vector3Partial= obj
             * @returns rlbot.flat.Vector3Partial|null
             */
            DesiredPhysics.prototype.angularVelocity = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? (obj || new rlbot.flat.Vector3Partial()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            DesiredPhysics.startDesiredPhysics = function (builder) {
                builder.startObject(4);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset locationOffset
             */
            DesiredPhysics.addLocation = function (builder, locationOffset) {
                builder.addFieldOffset(0, locationOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset rotationOffset
             */
            DesiredPhysics.addRotation = function (builder, rotationOffset) {
                builder.addFieldOffset(1, rotationOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset velocityOffset
             */
            DesiredPhysics.addVelocity = function (builder, velocityOffset) {
                builder.addFieldOffset(2, velocityOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset angularVelocityOffset
             */
            DesiredPhysics.addAngularVelocity = function (builder, angularVelocityOffset) {
                builder.addFieldOffset(3, angularVelocityOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            DesiredPhysics.endDesiredPhysics = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            DesiredPhysics.createDesiredPhysics = function (builder, locationOffset, rotationOffset, velocityOffset, angularVelocityOffset) {
                DesiredPhysics.startDesiredPhysics(builder);
                DesiredPhysics.addLocation(builder, locationOffset);
                DesiredPhysics.addRotation(builder, rotationOffset);
                DesiredPhysics.addVelocity(builder, velocityOffset);
                DesiredPhysics.addAngularVelocity(builder, angularVelocityOffset);
                return DesiredPhysics.endDesiredPhysics(builder);
            };
            return DesiredPhysics;
        }());
        flat.DesiredPhysics = DesiredPhysics;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var DesiredBallState = /** @class */ (function () {
            function DesiredBallState() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns DesiredBallState
             */
            DesiredBallState.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param DesiredBallState= obj
             * @returns DesiredBallState
             */
            DesiredBallState.getRootAsDesiredBallState = function (bb, obj) {
                return (obj || new DesiredBallState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param DesiredBallState= obj
             * @returns DesiredBallState
             */
            DesiredBallState.getSizePrefixedRootAsDesiredBallState = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new DesiredBallState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param rlbot.flat.DesiredPhysics= obj
             * @returns rlbot.flat.DesiredPhysics|null
             */
            DesiredBallState.prototype.physics = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.DesiredPhysics()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            DesiredBallState.startDesiredBallState = function (builder) {
                builder.startObject(1);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset physicsOffset
             */
            DesiredBallState.addPhysics = function (builder, physicsOffset) {
                builder.addFieldOffset(0, physicsOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            DesiredBallState.endDesiredBallState = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            DesiredBallState.createDesiredBallState = function (builder, physicsOffset) {
                DesiredBallState.startDesiredBallState(builder);
                DesiredBallState.addPhysics(builder, physicsOffset);
                return DesiredBallState.endDesiredBallState(builder);
            };
            return DesiredBallState;
        }());
        flat.DesiredBallState = DesiredBallState;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var DesiredCarState = /** @class */ (function () {
            function DesiredCarState() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns DesiredCarState
             */
            DesiredCarState.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param DesiredCarState= obj
             * @returns DesiredCarState
             */
            DesiredCarState.getRootAsDesiredCarState = function (bb, obj) {
                return (obj || new DesiredCarState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param DesiredCarState= obj
             * @returns DesiredCarState
             */
            DesiredCarState.getSizePrefixedRootAsDesiredCarState = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new DesiredCarState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param rlbot.flat.DesiredPhysics= obj
             * @returns rlbot.flat.DesiredPhysics|null
             */
            DesiredCarState.prototype.physics = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.DesiredPhysics()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Float= obj
             * @returns rlbot.flat.Float|null
             */
            DesiredCarState.prototype.boostAmount = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? (obj || new rlbot.flat.Float()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Bool= obj
             * @returns rlbot.flat.Bool|null
             */
            DesiredCarState.prototype.jumped = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? (obj || new rlbot.flat.Bool()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Bool= obj
             * @returns rlbot.flat.Bool|null
             */
            DesiredCarState.prototype.doubleJumped = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? (obj || new rlbot.flat.Bool()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            DesiredCarState.startDesiredCarState = function (builder) {
                builder.startObject(4);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset physicsOffset
             */
            DesiredCarState.addPhysics = function (builder, physicsOffset) {
                builder.addFieldOffset(0, physicsOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset boostAmountOffset
             */
            DesiredCarState.addBoostAmount = function (builder, boostAmountOffset) {
                builder.addFieldStruct(1, boostAmountOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset jumpedOffset
             */
            DesiredCarState.addJumped = function (builder, jumpedOffset) {
                builder.addFieldStruct(2, jumpedOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset doubleJumpedOffset
             */
            DesiredCarState.addDoubleJumped = function (builder, doubleJumpedOffset) {
                builder.addFieldStruct(3, doubleJumpedOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            DesiredCarState.endDesiredCarState = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            DesiredCarState.createDesiredCarState = function (builder, physicsOffset, boostAmountOffset, jumpedOffset, doubleJumpedOffset) {
                DesiredCarState.startDesiredCarState(builder);
                DesiredCarState.addPhysics(builder, physicsOffset);
                DesiredCarState.addBoostAmount(builder, boostAmountOffset);
                DesiredCarState.addJumped(builder, jumpedOffset);
                DesiredCarState.addDoubleJumped(builder, doubleJumpedOffset);
                return DesiredCarState.endDesiredCarState(builder);
            };
            return DesiredCarState;
        }());
        flat.DesiredCarState = DesiredCarState;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var DesiredBoostState = /** @class */ (function () {
            function DesiredBoostState() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns DesiredBoostState
             */
            DesiredBoostState.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param DesiredBoostState= obj
             * @returns DesiredBoostState
             */
            DesiredBoostState.getRootAsDesiredBoostState = function (bb, obj) {
                return (obj || new DesiredBoostState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param DesiredBoostState= obj
             * @returns DesiredBoostState
             */
            DesiredBoostState.getSizePrefixedRootAsDesiredBoostState = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new DesiredBoostState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param rlbot.flat.Float= obj
             * @returns rlbot.flat.Float|null
             */
            DesiredBoostState.prototype.respawnTime = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.Float()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            DesiredBoostState.startDesiredBoostState = function (builder) {
                builder.startObject(1);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset respawnTimeOffset
             */
            DesiredBoostState.addRespawnTime = function (builder, respawnTimeOffset) {
                builder.addFieldStruct(0, respawnTimeOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            DesiredBoostState.endDesiredBoostState = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            DesiredBoostState.createDesiredBoostState = function (builder, respawnTimeOffset) {
                DesiredBoostState.startDesiredBoostState(builder);
                DesiredBoostState.addRespawnTime(builder, respawnTimeOffset);
                return DesiredBoostState.endDesiredBoostState(builder);
            };
            return DesiredBoostState;
        }());
        flat.DesiredBoostState = DesiredBoostState;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var DesiredGameInfoState = /** @class */ (function () {
            function DesiredGameInfoState() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns DesiredGameInfoState
             */
            DesiredGameInfoState.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param DesiredGameInfoState= obj
             * @returns DesiredGameInfoState
             */
            DesiredGameInfoState.getRootAsDesiredGameInfoState = function (bb, obj) {
                return (obj || new DesiredGameInfoState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param DesiredGameInfoState= obj
             * @returns DesiredGameInfoState
             */
            DesiredGameInfoState.getSizePrefixedRootAsDesiredGameInfoState = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new DesiredGameInfoState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param rlbot.flat.Float= obj
             * @returns rlbot.flat.Float|null
             */
            DesiredGameInfoState.prototype.worldGravityZ = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.Float()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Float= obj
             * @returns rlbot.flat.Float|null
             */
            DesiredGameInfoState.prototype.gameSpeed = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? (obj || new rlbot.flat.Float()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Bool= obj
             * @returns rlbot.flat.Bool|null
             */
            DesiredGameInfoState.prototype.paused = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? (obj || new rlbot.flat.Bool()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Bool= obj
             * @returns rlbot.flat.Bool|null
             */
            DesiredGameInfoState.prototype.endMatch = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? (obj || new rlbot.flat.Bool()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            DesiredGameInfoState.startDesiredGameInfoState = function (builder) {
                builder.startObject(4);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset worldGravityZOffset
             */
            DesiredGameInfoState.addWorldGravityZ = function (builder, worldGravityZOffset) {
                builder.addFieldStruct(0, worldGravityZOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset gameSpeedOffset
             */
            DesiredGameInfoState.addGameSpeed = function (builder, gameSpeedOffset) {
                builder.addFieldStruct(1, gameSpeedOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset pausedOffset
             */
            DesiredGameInfoState.addPaused = function (builder, pausedOffset) {
                builder.addFieldStruct(2, pausedOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset endMatchOffset
             */
            DesiredGameInfoState.addEndMatch = function (builder, endMatchOffset) {
                builder.addFieldStruct(3, endMatchOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            DesiredGameInfoState.endDesiredGameInfoState = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            DesiredGameInfoState.createDesiredGameInfoState = function (builder, worldGravityZOffset, gameSpeedOffset, pausedOffset, endMatchOffset) {
                DesiredGameInfoState.startDesiredGameInfoState(builder);
                DesiredGameInfoState.addWorldGravityZ(builder, worldGravityZOffset);
                DesiredGameInfoState.addGameSpeed(builder, gameSpeedOffset);
                DesiredGameInfoState.addPaused(builder, pausedOffset);
                DesiredGameInfoState.addEndMatch(builder, endMatchOffset);
                return DesiredGameInfoState.endDesiredGameInfoState(builder);
            };
            return DesiredGameInfoState;
        }());
        flat.DesiredGameInfoState = DesiredGameInfoState;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * A console command which we will try to execute inside Rocket League.
 * See https://github.com/RLBot/RLBot/wiki/Console-Commands for a list of known commands.
 *
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var ConsoleCommand = /** @class */ (function () {
            function ConsoleCommand() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns ConsoleCommand
             */
            ConsoleCommand.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param ConsoleCommand= obj
             * @returns ConsoleCommand
             */
            ConsoleCommand.getRootAsConsoleCommand = function (bb, obj) {
                return (obj || new ConsoleCommand()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param ConsoleCommand= obj
             * @returns ConsoleCommand
             */
            ConsoleCommand.getSizePrefixedRootAsConsoleCommand = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new ConsoleCommand()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            ConsoleCommand.prototype.command = function (optionalEncoding) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            ConsoleCommand.startConsoleCommand = function (builder) {
                builder.startObject(1);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset commandOffset
             */
            ConsoleCommand.addCommand = function (builder, commandOffset) {
                builder.addFieldOffset(0, commandOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            ConsoleCommand.endConsoleCommand = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            ConsoleCommand.createConsoleCommand = function (builder, commandOffset) {
                ConsoleCommand.startConsoleCommand(builder);
                ConsoleCommand.addCommand(builder, commandOffset);
                return ConsoleCommand.endConsoleCommand(builder);
            };
            return ConsoleCommand;
        }());
        flat.ConsoleCommand = ConsoleCommand;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var DesiredGameState = /** @class */ (function () {
            function DesiredGameState() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns DesiredGameState
             */
            DesiredGameState.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param DesiredGameState= obj
             * @returns DesiredGameState
             */
            DesiredGameState.getRootAsDesiredGameState = function (bb, obj) {
                return (obj || new DesiredGameState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param DesiredGameState= obj
             * @returns DesiredGameState
             */
            DesiredGameState.getSizePrefixedRootAsDesiredGameState = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new DesiredGameState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param rlbot.flat.DesiredBallState= obj
             * @returns rlbot.flat.DesiredBallState|null
             */
            DesiredGameState.prototype.ballState = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.DesiredBallState()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @param number index
             * @param rlbot.flat.DesiredCarState= obj
             * @returns rlbot.flat.DesiredCarState
             */
            DesiredGameState.prototype.carStates = function (index, obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? (obj || new rlbot.flat.DesiredCarState()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
            };
            ;
            /**
             * @returns number
             */
            DesiredGameState.prototype.carStatesLength = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param number index
             * @param rlbot.flat.DesiredBoostState= obj
             * @returns rlbot.flat.DesiredBoostState
             */
            DesiredGameState.prototype.boostStates = function (index, obj) {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? (obj || new rlbot.flat.DesiredBoostState()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
            };
            ;
            /**
             * @returns number
             */
            DesiredGameState.prototype.boostStatesLength = function () {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param rlbot.flat.DesiredGameInfoState= obj
             * @returns rlbot.flat.DesiredGameInfoState|null
             */
            DesiredGameState.prototype.gameInfoState = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? (obj || new rlbot.flat.DesiredGameInfoState()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @param number index
             * @param rlbot.flat.ConsoleCommand= obj
             * @returns rlbot.flat.ConsoleCommand
             */
            DesiredGameState.prototype.consoleCommands = function (index, obj) {
                var offset = this.bb.__offset(this.bb_pos, 12);
                return offset ? (obj || new rlbot.flat.ConsoleCommand()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
            };
            ;
            /**
             * @returns number
             */
            DesiredGameState.prototype.consoleCommandsLength = function () {
                var offset = this.bb.__offset(this.bb_pos, 12);
                return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            DesiredGameState.startDesiredGameState = function (builder) {
                builder.startObject(5);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset ballStateOffset
             */
            DesiredGameState.addBallState = function (builder, ballStateOffset) {
                builder.addFieldOffset(0, ballStateOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset carStatesOffset
             */
            DesiredGameState.addCarStates = function (builder, carStatesOffset) {
                builder.addFieldOffset(1, carStatesOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param Array.<flatbuffers.Offset> data
             * @returns flatbuffers.Offset
             */
            DesiredGameState.createCarStatesVector = function (builder, data) {
                builder.startVector(4, data.length, 4);
                for (var i = data.length - 1; i >= 0; i--) {
                    builder.addOffset(data[i]);
                }
                return builder.endVector();
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number numElems
             */
            DesiredGameState.startCarStatesVector = function (builder, numElems) {
                builder.startVector(4, numElems, 4);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset boostStatesOffset
             */
            DesiredGameState.addBoostStates = function (builder, boostStatesOffset) {
                builder.addFieldOffset(2, boostStatesOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param Array.<flatbuffers.Offset> data
             * @returns flatbuffers.Offset
             */
            DesiredGameState.createBoostStatesVector = function (builder, data) {
                builder.startVector(4, data.length, 4);
                for (var i = data.length - 1; i >= 0; i--) {
                    builder.addOffset(data[i]);
                }
                return builder.endVector();
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number numElems
             */
            DesiredGameState.startBoostStatesVector = function (builder, numElems) {
                builder.startVector(4, numElems, 4);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset gameInfoStateOffset
             */
            DesiredGameState.addGameInfoState = function (builder, gameInfoStateOffset) {
                builder.addFieldOffset(3, gameInfoStateOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset consoleCommandsOffset
             */
            DesiredGameState.addConsoleCommands = function (builder, consoleCommandsOffset) {
                builder.addFieldOffset(4, consoleCommandsOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param Array.<flatbuffers.Offset> data
             * @returns flatbuffers.Offset
             */
            DesiredGameState.createConsoleCommandsVector = function (builder, data) {
                builder.startVector(4, data.length, 4);
                for (var i = data.length - 1; i >= 0; i--) {
                    builder.addOffset(data[i]);
                }
                return builder.endVector();
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number numElems
             */
            DesiredGameState.startConsoleCommandsVector = function (builder, numElems) {
                builder.startVector(4, numElems, 4);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            DesiredGameState.endDesiredGameState = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            DesiredGameState.createDesiredGameState = function (builder, ballStateOffset, carStatesOffset, boostStatesOffset, gameInfoStateOffset, consoleCommandsOffset) {
                DesiredGameState.startDesiredGameState(builder);
                DesiredGameState.addBallState(builder, ballStateOffset);
                DesiredGameState.addCarStates(builder, carStatesOffset);
                DesiredGameState.addBoostStates(builder, boostStatesOffset);
                DesiredGameState.addGameInfoState(builder, gameInfoStateOffset);
                DesiredGameState.addConsoleCommands(builder, consoleCommandsOffset);
                return DesiredGameState.endDesiredGameState(builder);
            };
            return DesiredGameState;
        }());
        flat.DesiredGameState = DesiredGameState;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var Color = /** @class */ (function () {
            function Color() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns Color
             */
            Color.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param Color= obj
             * @returns Color
             */
            Color.getRootAsColor = function (bb, obj) {
                return (obj || new Color()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param Color= obj
             * @returns Color
             */
            Color.getSizePrefixedRootAsColor = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new Color()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @returns number
             */
            Color.prototype.a = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.readUint8(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            Color.prototype.r = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.readUint8(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            Color.prototype.g = function () {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? this.bb.readUint8(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            Color.prototype.b = function () {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? this.bb.readUint8(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            Color.startColor = function (builder) {
                builder.startObject(4);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number a
             */
            Color.addA = function (builder, a) {
                builder.addFieldInt8(0, a, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number r
             */
            Color.addR = function (builder, r) {
                builder.addFieldInt8(1, r, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number g
             */
            Color.addG = function (builder, g) {
                builder.addFieldInt8(2, g, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number b
             */
            Color.addB = function (builder, b) {
                builder.addFieldInt8(3, b, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            Color.endColor = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            Color.createColor = function (builder, a, r, g, b) {
                Color.startColor(builder);
                Color.addA(builder, a);
                Color.addR(builder, r);
                Color.addG(builder, g);
                Color.addB(builder, b);
                return Color.endColor(builder);
            };
            return Color;
        }());
        flat.Color = Color;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var RenderMessage = /** @class */ (function () {
            function RenderMessage() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns RenderMessage
             */
            RenderMessage.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param RenderMessage= obj
             * @returns RenderMessage
             */
            RenderMessage.getRootAsRenderMessage = function (bb, obj) {
                return (obj || new RenderMessage()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param RenderMessage= obj
             * @returns RenderMessage
             */
            RenderMessage.getSizePrefixedRootAsRenderMessage = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new RenderMessage()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @returns rlbot.flat.RenderType
             */
            RenderMessage.prototype.renderType = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : rlbot.flat.RenderType.DrawLine2D;
            };
            ;
            /**
             * @param rlbot.flat.Color= obj
             * @returns rlbot.flat.Color|null
             */
            RenderMessage.prototype.color = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? (obj || new rlbot.flat.Color()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * For 2d renders this only grabs x and y
             *
             * @param rlbot.flat.Vector3= obj
             * @returns rlbot.flat.Vector3|null
             */
            RenderMessage.prototype.start = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? (obj || new rlbot.flat.Vector3()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * For 2d renders this only grabs x and y
             *
             * @param rlbot.flat.Vector3= obj
             * @returns rlbot.flat.Vector3|null
             */
            RenderMessage.prototype.end = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? (obj || new rlbot.flat.Vector3()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * Scales the x size of the text/rectangle, is used for rectangles assuming an initial value of 1
             *
             * @returns number
             */
            RenderMessage.prototype.scaleX = function () {
                var offset = this.bb.__offset(this.bb_pos, 12);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 1;
            };
            ;
            /**
             * Scales the y size of the text/rectangle, is used for rectangles assuming an initial value of 1
             *
             * @returns number
             */
            RenderMessage.prototype.scaleY = function () {
                var offset = this.bb.__offset(this.bb_pos, 14);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 1;
            };
            ;
            RenderMessage.prototype.text = function (optionalEncoding) {
                var offset = this.bb.__offset(this.bb_pos, 16);
                return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
            };
            ;
            /**
             * Rectangles can be filled or just outlines.
             *
             * @returns boolean
             */
            RenderMessage.prototype.isFilled = function () {
                var offset = this.bb.__offset(this.bb_pos, 18);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            RenderMessage.startRenderMessage = function (builder) {
                builder.startObject(8);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.RenderType renderType
             */
            RenderMessage.addRenderType = function (builder, renderType) {
                builder.addFieldInt8(0, renderType, rlbot.flat.RenderType.DrawLine2D);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset colorOffset
             */
            RenderMessage.addColor = function (builder, colorOffset) {
                builder.addFieldOffset(1, colorOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset startOffset
             */
            RenderMessage.addStart = function (builder, startOffset) {
                builder.addFieldStruct(2, startOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset endOffset
             */
            RenderMessage.addEnd = function (builder, endOffset) {
                builder.addFieldStruct(3, endOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number scaleX
             */
            RenderMessage.addScaleX = function (builder, scaleX) {
                builder.addFieldInt32(4, scaleX, 1);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number scaleY
             */
            RenderMessage.addScaleY = function (builder, scaleY) {
                builder.addFieldInt32(5, scaleY, 1);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset textOffset
             */
            RenderMessage.addText = function (builder, textOffset) {
                builder.addFieldOffset(6, textOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean isFilled
             */
            RenderMessage.addIsFilled = function (builder, isFilled) {
                builder.addFieldInt8(7, +isFilled, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            RenderMessage.endRenderMessage = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            RenderMessage.createRenderMessage = function (builder, renderType, colorOffset, startOffset, endOffset, scaleX, scaleY, textOffset, isFilled) {
                RenderMessage.startRenderMessage(builder);
                RenderMessage.addRenderType(builder, renderType);
                RenderMessage.addColor(builder, colorOffset);
                RenderMessage.addStart(builder, startOffset);
                RenderMessage.addEnd(builder, endOffset);
                RenderMessage.addScaleX(builder, scaleX);
                RenderMessage.addScaleY(builder, scaleY);
                RenderMessage.addText(builder, textOffset);
                RenderMessage.addIsFilled(builder, isFilled);
                return RenderMessage.endRenderMessage(builder);
            };
            return RenderMessage;
        }());
        flat.RenderMessage = RenderMessage;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var RenderGroup = /** @class */ (function () {
            function RenderGroup() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns RenderGroup
             */
            RenderGroup.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param RenderGroup= obj
             * @returns RenderGroup
             */
            RenderGroup.getRootAsRenderGroup = function (bb, obj) {
                return (obj || new RenderGroup()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param RenderGroup= obj
             * @returns RenderGroup
             */
            RenderGroup.getSizePrefixedRootAsRenderGroup = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new RenderGroup()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param number index
             * @param rlbot.flat.RenderMessage= obj
             * @returns rlbot.flat.RenderMessage
             */
            RenderGroup.prototype.renderMessages = function (index, obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.RenderMessage()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
            };
            ;
            /**
             * @returns number
             */
            RenderGroup.prototype.renderMessagesLength = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * The id of the render group
             *
             * @returns number
             */
            RenderGroup.prototype.id = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            RenderGroup.startRenderGroup = function (builder) {
                builder.startObject(2);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset renderMessagesOffset
             */
            RenderGroup.addRenderMessages = function (builder, renderMessagesOffset) {
                builder.addFieldOffset(0, renderMessagesOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param Array.<flatbuffers.Offset> data
             * @returns flatbuffers.Offset
             */
            RenderGroup.createRenderMessagesVector = function (builder, data) {
                builder.startVector(4, data.length, 4);
                for (var i = data.length - 1; i >= 0; i--) {
                    builder.addOffset(data[i]);
                }
                return builder.endVector();
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number numElems
             */
            RenderGroup.startRenderMessagesVector = function (builder, numElems) {
                builder.startVector(4, numElems, 4);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number id
             */
            RenderGroup.addId = function (builder, id) {
                builder.addFieldInt32(1, id, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            RenderGroup.endRenderGroup = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            RenderGroup.createRenderGroup = function (builder, renderMessagesOffset, id) {
                RenderGroup.startRenderGroup(builder);
                RenderGroup.addRenderMessages(builder, renderMessagesOffset);
                RenderGroup.addId(builder, id);
                return RenderGroup.endRenderGroup(builder);
            };
            return RenderGroup;
        }());
        flat.RenderGroup = RenderGroup;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var QuickChat = /** @class */ (function () {
            function QuickChat() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns QuickChat
             */
            QuickChat.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param QuickChat= obj
             * @returns QuickChat
             */
            QuickChat.getRootAsQuickChat = function (bb, obj) {
                return (obj || new QuickChat()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param QuickChat= obj
             * @returns QuickChat
             */
            QuickChat.getSizePrefixedRootAsQuickChat = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new QuickChat()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @returns rlbot.flat.QuickChatSelection
             */
            QuickChat.prototype.quickChatSelection = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : rlbot.flat.QuickChatSelection.Information_IGotIt;
            };
            ;
            /**
             * The index of the player that sent the quick chat
             *
             * @returns number
             */
            QuickChat.prototype.playerIndex = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * True if the chat is team only false if everyone can see it.
             *
             * @returns boolean
             */
            QuickChat.prototype.teamOnly = function () {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * @returns number
             */
            QuickChat.prototype.messageIndex = function () {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            QuickChat.prototype.timeStamp = function () {
                var offset = this.bb.__offset(this.bb_pos, 12);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            QuickChat.startQuickChat = function (builder) {
                builder.startObject(5);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.QuickChatSelection quickChatSelection
             */
            QuickChat.addQuickChatSelection = function (builder, quickChatSelection) {
                builder.addFieldInt8(0, quickChatSelection, rlbot.flat.QuickChatSelection.Information_IGotIt);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number playerIndex
             */
            QuickChat.addPlayerIndex = function (builder, playerIndex) {
                builder.addFieldInt32(1, playerIndex, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean teamOnly
             */
            QuickChat.addTeamOnly = function (builder, teamOnly) {
                builder.addFieldInt8(2, +teamOnly, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number messageIndex
             */
            QuickChat.addMessageIndex = function (builder, messageIndex) {
                builder.addFieldInt32(3, messageIndex, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number timeStamp
             */
            QuickChat.addTimeStamp = function (builder, timeStamp) {
                builder.addFieldFloat32(4, timeStamp, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            QuickChat.endQuickChat = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset offset
             */
            QuickChat.finishQuickChatBuffer = function (builder, offset) {
                builder.finish(offset);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset offset
             */
            QuickChat.finishSizePrefixedQuickChatBuffer = function (builder, offset) {
                builder.finish(offset, undefined, true);
            };
            ;
            QuickChat.createQuickChat = function (builder, quickChatSelection, playerIndex, teamOnly, messageIndex, timeStamp) {
                QuickChat.startQuickChat(builder);
                QuickChat.addQuickChatSelection(builder, quickChatSelection);
                QuickChat.addPlayerIndex(builder, playerIndex);
                QuickChat.addTeamOnly(builder, teamOnly);
                QuickChat.addMessageIndex(builder, messageIndex);
                QuickChat.addTimeStamp(builder, timeStamp);
                return QuickChat.endQuickChat(builder);
            };
            return QuickChat;
        }());
        flat.QuickChat = QuickChat;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * A minimal version of player data, useful when bandwidth needs to be conserved.
 *
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var TinyPlayer = /** @class */ (function () {
            function TinyPlayer() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns TinyPlayer
             */
            TinyPlayer.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param TinyPlayer= obj
             * @returns TinyPlayer
             */
            TinyPlayer.getRootAsTinyPlayer = function (bb, obj) {
                return (obj || new TinyPlayer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param TinyPlayer= obj
             * @returns TinyPlayer
             */
            TinyPlayer.getSizePrefixedRootAsTinyPlayer = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new TinyPlayer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param rlbot.flat.Vector3= obj
             * @returns rlbot.flat.Vector3|null
             */
            TinyPlayer.prototype.location = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.Vector3()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Rotator= obj
             * @returns rlbot.flat.Rotator|null
             */
            TinyPlayer.prototype.rotation = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? (obj || new rlbot.flat.Rotator()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Vector3= obj
             * @returns rlbot.flat.Vector3|null
             */
            TinyPlayer.prototype.velocity = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? (obj || new rlbot.flat.Vector3()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @returns boolean
             */
            TinyPlayer.prototype.hasWheelContact = function () {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * @returns boolean
             */
            TinyPlayer.prototype.isSupersonic = function () {
                var offset = this.bb.__offset(this.bb_pos, 12);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * @returns number
             */
            TinyPlayer.prototype.team = function () {
                var offset = this.bb.__offset(this.bb_pos, 14);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            TinyPlayer.prototype.boost = function () {
                var offset = this.bb.__offset(this.bb_pos, 16);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            TinyPlayer.startTinyPlayer = function (builder) {
                builder.startObject(7);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset locationOffset
             */
            TinyPlayer.addLocation = function (builder, locationOffset) {
                builder.addFieldStruct(0, locationOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset rotationOffset
             */
            TinyPlayer.addRotation = function (builder, rotationOffset) {
                builder.addFieldStruct(1, rotationOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset velocityOffset
             */
            TinyPlayer.addVelocity = function (builder, velocityOffset) {
                builder.addFieldStruct(2, velocityOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean hasWheelContact
             */
            TinyPlayer.addHasWheelContact = function (builder, hasWheelContact) {
                builder.addFieldInt8(3, +hasWheelContact, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean isSupersonic
             */
            TinyPlayer.addIsSupersonic = function (builder, isSupersonic) {
                builder.addFieldInt8(4, +isSupersonic, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number team
             */
            TinyPlayer.addTeam = function (builder, team) {
                builder.addFieldInt32(5, team, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number boost
             */
            TinyPlayer.addBoost = function (builder, boost) {
                builder.addFieldInt32(6, boost, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            TinyPlayer.endTinyPlayer = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            TinyPlayer.createTinyPlayer = function (builder, locationOffset, rotationOffset, velocityOffset, hasWheelContact, isSupersonic, team, boost) {
                TinyPlayer.startTinyPlayer(builder);
                TinyPlayer.addLocation(builder, locationOffset);
                TinyPlayer.addRotation(builder, rotationOffset);
                TinyPlayer.addVelocity(builder, velocityOffset);
                TinyPlayer.addHasWheelContact(builder, hasWheelContact);
                TinyPlayer.addIsSupersonic(builder, isSupersonic);
                TinyPlayer.addTeam(builder, team);
                TinyPlayer.addBoost(builder, boost);
                return TinyPlayer.endTinyPlayer(builder);
            };
            return TinyPlayer;
        }());
        flat.TinyPlayer = TinyPlayer;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * A minimal version of the ball, useful when bandwidth needs to be conserved.
 *
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var TinyBall = /** @class */ (function () {
            function TinyBall() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns TinyBall
             */
            TinyBall.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param TinyBall= obj
             * @returns TinyBall
             */
            TinyBall.getRootAsTinyBall = function (bb, obj) {
                return (obj || new TinyBall()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param TinyBall= obj
             * @returns TinyBall
             */
            TinyBall.getSizePrefixedRootAsTinyBall = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new TinyBall()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param rlbot.flat.Vector3= obj
             * @returns rlbot.flat.Vector3|null
             */
            TinyBall.prototype.location = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.Vector3()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param rlbot.flat.Vector3= obj
             * @returns rlbot.flat.Vector3|null
             */
            TinyBall.prototype.velocity = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? (obj || new rlbot.flat.Vector3()).__init(this.bb_pos + offset, this.bb) : null;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            TinyBall.startTinyBall = function (builder) {
                builder.startObject(2);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset locationOffset
             */
            TinyBall.addLocation = function (builder, locationOffset) {
                builder.addFieldStruct(0, locationOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset velocityOffset
             */
            TinyBall.addVelocity = function (builder, velocityOffset) {
                builder.addFieldStruct(1, velocityOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            TinyBall.endTinyBall = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            TinyBall.createTinyBall = function (builder, locationOffset, velocityOffset) {
                TinyBall.startTinyBall(builder);
                TinyBall.addLocation(builder, locationOffset);
                TinyBall.addVelocity(builder, velocityOffset);
                return TinyBall.endTinyBall(builder);
            };
            return TinyBall;
        }());
        flat.TinyBall = TinyBall;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * A minimal version of the game tick packet, useful when bandwidth needs to be conserved.
 *
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var TinyPacket = /** @class */ (function () {
            function TinyPacket() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns TinyPacket
             */
            TinyPacket.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param TinyPacket= obj
             * @returns TinyPacket
             */
            TinyPacket.getRootAsTinyPacket = function (bb, obj) {
                return (obj || new TinyPacket()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param TinyPacket= obj
             * @returns TinyPacket
             */
            TinyPacket.getSizePrefixedRootAsTinyPacket = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new TinyPacket()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param number index
             * @param rlbot.flat.TinyPlayer= obj
             * @returns rlbot.flat.TinyPlayer
             */
            TinyPacket.prototype.players = function (index, obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.TinyPlayer()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
            };
            ;
            /**
             * @returns number
             */
            TinyPacket.prototype.playersLength = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param rlbot.flat.TinyBall= obj
             * @returns rlbot.flat.TinyBall|null
             */
            TinyPacket.prototype.ball = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? (obj || new rlbot.flat.TinyBall()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            TinyPacket.startTinyPacket = function (builder) {
                builder.startObject(2);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset playersOffset
             */
            TinyPacket.addPlayers = function (builder, playersOffset) {
                builder.addFieldOffset(0, playersOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param Array.<flatbuffers.Offset> data
             * @returns flatbuffers.Offset
             */
            TinyPacket.createPlayersVector = function (builder, data) {
                builder.startVector(4, data.length, 4);
                for (var i = data.length - 1; i >= 0; i--) {
                    builder.addOffset(data[i]);
                }
                return builder.endVector();
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number numElems
             */
            TinyPacket.startPlayersVector = function (builder, numElems) {
                builder.startVector(4, numElems, 4);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset ballOffset
             */
            TinyPacket.addBall = function (builder, ballOffset) {
                builder.addFieldOffset(1, ballOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            TinyPacket.endTinyPacket = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            TinyPacket.createTinyPacket = function (builder, playersOffset, ballOffset) {
                TinyPacket.startTinyPacket(builder);
                TinyPacket.addPlayers(builder, playersOffset);
                TinyPacket.addBall(builder, ballOffset);
                return TinyPacket.endTinyPacket(builder);
            };
            return TinyPacket;
        }());
        flat.TinyPacket = TinyPacket;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var PredictionSlice = /** @class */ (function () {
            function PredictionSlice() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns PredictionSlice
             */
            PredictionSlice.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param PredictionSlice= obj
             * @returns PredictionSlice
             */
            PredictionSlice.getRootAsPredictionSlice = function (bb, obj) {
                return (obj || new PredictionSlice()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param PredictionSlice= obj
             * @returns PredictionSlice
             */
            PredictionSlice.getSizePrefixedRootAsPredictionSlice = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new PredictionSlice()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * The moment in game time that this prediction corresponds to.
             * This corresponds to 'secondsElapsed' in the GameInfo table.
             *
             * @returns number
             */
            PredictionSlice.prototype.gameSeconds = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * The predicted location and motion of the object.
             *
             * @param rlbot.flat.Physics= obj
             * @returns rlbot.flat.Physics|null
             */
            PredictionSlice.prototype.physics = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? (obj || new rlbot.flat.Physics()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            PredictionSlice.startPredictionSlice = function (builder) {
                builder.startObject(2);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number gameSeconds
             */
            PredictionSlice.addGameSeconds = function (builder, gameSeconds) {
                builder.addFieldFloat32(0, gameSeconds, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset physicsOffset
             */
            PredictionSlice.addPhysics = function (builder, physicsOffset) {
                builder.addFieldOffset(1, physicsOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            PredictionSlice.endPredictionSlice = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            PredictionSlice.createPredictionSlice = function (builder, gameSeconds, physicsOffset) {
                PredictionSlice.startPredictionSlice(builder);
                PredictionSlice.addGameSeconds(builder, gameSeconds);
                PredictionSlice.addPhysics(builder, physicsOffset);
                return PredictionSlice.endPredictionSlice(builder);
            };
            return PredictionSlice;
        }());
        flat.PredictionSlice = PredictionSlice;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var BallPrediction = /** @class */ (function () {
            function BallPrediction() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns BallPrediction
             */
            BallPrediction.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param BallPrediction= obj
             * @returns BallPrediction
             */
            BallPrediction.getRootAsBallPrediction = function (bb, obj) {
                return (obj || new BallPrediction()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param BallPrediction= obj
             * @returns BallPrediction
             */
            BallPrediction.getSizePrefixedRootAsBallPrediction = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new BallPrediction()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * A list of places the ball will be at specific times in the future.
             * It is guaranteed to sorted so that time increases with each slice.
             * It is NOT guaranteed to have a consistent amount of time between slices.
             *
             * @param number index
             * @param rlbot.flat.PredictionSlice= obj
             * @returns rlbot.flat.PredictionSlice
             */
            BallPrediction.prototype.slices = function (index, obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.PredictionSlice()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
            };
            ;
            /**
             * @returns number
             */
            BallPrediction.prototype.slicesLength = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            BallPrediction.startBallPrediction = function (builder) {
                builder.startObject(1);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset slicesOffset
             */
            BallPrediction.addSlices = function (builder, slicesOffset) {
                builder.addFieldOffset(0, slicesOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param Array.<flatbuffers.Offset> data
             * @returns flatbuffers.Offset
             */
            BallPrediction.createSlicesVector = function (builder, data) {
                builder.startVector(4, data.length, 4);
                for (var i = data.length - 1; i >= 0; i--) {
                    builder.addOffset(data[i]);
                }
                return builder.endVector();
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number numElems
             */
            BallPrediction.startSlicesVector = function (builder, numElems) {
                builder.startVector(4, numElems, 4);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            BallPrediction.endBallPrediction = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            BallPrediction.createBallPrediction = function (builder, slicesOffset) {
                BallPrediction.startBallPrediction(builder);
                BallPrediction.addSlices(builder, slicesOffset);
                return BallPrediction.endBallPrediction(builder);
            };
            return BallPrediction;
        }());
        flat.BallPrediction = BallPrediction;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * A bot controlled by the RLBot framework
 *
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var RLBotPlayer = /** @class */ (function () {
            function RLBotPlayer() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns RLBotPlayer
             */
            RLBotPlayer.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param RLBotPlayer= obj
             * @returns RLBotPlayer
             */
            RLBotPlayer.getRootAsRLBotPlayer = function (bb, obj) {
                return (obj || new RLBotPlayer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param RLBotPlayer= obj
             * @returns RLBotPlayer
             */
            RLBotPlayer.getSizePrefixedRootAsRLBotPlayer = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new RLBotPlayer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            RLBotPlayer.startRLBotPlayer = function (builder) {
                builder.startObject(0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            RLBotPlayer.endRLBotPlayer = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            RLBotPlayer.createRLBotPlayer = function (builder) {
                RLBotPlayer.startRLBotPlayer(builder);
                return RLBotPlayer.endRLBotPlayer(builder);
            };
            return RLBotPlayer;
        }());
        flat.RLBotPlayer = RLBotPlayer;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * A normal human player
 *
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var HumanPlayer = /** @class */ (function () {
            function HumanPlayer() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns HumanPlayer
             */
            HumanPlayer.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param HumanPlayer= obj
             * @returns HumanPlayer
             */
            HumanPlayer.getRootAsHumanPlayer = function (bb, obj) {
                return (obj || new HumanPlayer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param HumanPlayer= obj
             * @returns HumanPlayer
             */
            HumanPlayer.getSizePrefixedRootAsHumanPlayer = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new HumanPlayer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            HumanPlayer.startHumanPlayer = function (builder) {
                builder.startObject(0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            HumanPlayer.endHumanPlayer = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            HumanPlayer.createHumanPlayer = function (builder) {
                HumanPlayer.startHumanPlayer(builder);
                return HumanPlayer.endHumanPlayer(builder);
            };
            return HumanPlayer;
        }());
        flat.HumanPlayer = HumanPlayer;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * A psyonix bot, e.g. All Star bot
 *
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var PsyonixBotPlayer = /** @class */ (function () {
            function PsyonixBotPlayer() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns PsyonixBotPlayer
             */
            PsyonixBotPlayer.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param PsyonixBotPlayer= obj
             * @returns PsyonixBotPlayer
             */
            PsyonixBotPlayer.getRootAsPsyonixBotPlayer = function (bb, obj) {
                return (obj || new PsyonixBotPlayer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param PsyonixBotPlayer= obj
             * @returns PsyonixBotPlayer
             */
            PsyonixBotPlayer.getSizePrefixedRootAsPsyonixBotPlayer = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new PsyonixBotPlayer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @returns number
             */
            PsyonixBotPlayer.prototype.botSkill = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            PsyonixBotPlayer.startPsyonixBotPlayer = function (builder) {
                builder.startObject(1);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number botSkill
             */
            PsyonixBotPlayer.addBotSkill = function (builder, botSkill) {
                builder.addFieldFloat32(0, botSkill, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            PsyonixBotPlayer.endPsyonixBotPlayer = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            PsyonixBotPlayer.createPsyonixBotPlayer = function (builder, botSkill) {
                PsyonixBotPlayer.startPsyonixBotPlayer(builder);
                PsyonixBotPlayer.addBotSkill(builder, botSkill);
                return PsyonixBotPlayer.endPsyonixBotPlayer(builder);
            };
            return PsyonixBotPlayer;
        }());
        flat.PsyonixBotPlayer = PsyonixBotPlayer;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * A player that Rocket League treats as human, e.g. has a dedicated camera and can do training mode,
 * but is actually controlled by a bot.
 *
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var PartyMemberBotPlayer = /** @class */ (function () {
            function PartyMemberBotPlayer() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns PartyMemberBotPlayer
             */
            PartyMemberBotPlayer.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param PartyMemberBotPlayer= obj
             * @returns PartyMemberBotPlayer
             */
            PartyMemberBotPlayer.getRootAsPartyMemberBotPlayer = function (bb, obj) {
                return (obj || new PartyMemberBotPlayer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param PartyMemberBotPlayer= obj
             * @returns PartyMemberBotPlayer
             */
            PartyMemberBotPlayer.getSizePrefixedRootAsPartyMemberBotPlayer = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new PartyMemberBotPlayer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            PartyMemberBotPlayer.startPartyMemberBotPlayer = function (builder) {
                builder.startObject(0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            PartyMemberBotPlayer.endPartyMemberBotPlayer = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            PartyMemberBotPlayer.createPartyMemberBotPlayer = function (builder) {
                PartyMemberBotPlayer.startPartyMemberBotPlayer(builder);
                return PartyMemberBotPlayer.endPartyMemberBotPlayer(builder);
            };
            return PartyMemberBotPlayer;
        }());
        flat.PartyMemberBotPlayer = PartyMemberBotPlayer;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * The car type, color, and other aspects of the player's appearance.
 * See https://github.com/RLBot/RLBot/wiki/Bot-Customization
 *
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var PlayerLoadout = /** @class */ (function () {
            function PlayerLoadout() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns PlayerLoadout
             */
            PlayerLoadout.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param PlayerLoadout= obj
             * @returns PlayerLoadout
             */
            PlayerLoadout.getRootAsPlayerLoadout = function (bb, obj) {
                return (obj || new PlayerLoadout()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param PlayerLoadout= obj
             * @returns PlayerLoadout
             */
            PlayerLoadout.getSizePrefixedRootAsPlayerLoadout = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new PlayerLoadout()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @returns number
             */
            PlayerLoadout.prototype.teamColorId = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            PlayerLoadout.prototype.customColorId = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            PlayerLoadout.prototype.carId = function () {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            PlayerLoadout.prototype.decalId = function () {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            PlayerLoadout.prototype.wheelsId = function () {
                var offset = this.bb.__offset(this.bb_pos, 12);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            PlayerLoadout.prototype.boostId = function () {
                var offset = this.bb.__offset(this.bb_pos, 14);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            PlayerLoadout.prototype.antennaId = function () {
                var offset = this.bb.__offset(this.bb_pos, 16);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            PlayerLoadout.prototype.hatId = function () {
                var offset = this.bb.__offset(this.bb_pos, 18);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            PlayerLoadout.prototype.paintFinishId = function () {
                var offset = this.bb.__offset(this.bb_pos, 20);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            PlayerLoadout.prototype.customFinishId = function () {
                var offset = this.bb.__offset(this.bb_pos, 22);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            PlayerLoadout.prototype.engineAudioId = function () {
                var offset = this.bb.__offset(this.bb_pos, 24);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            PlayerLoadout.prototype.trailsId = function () {
                var offset = this.bb.__offset(this.bb_pos, 26);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            PlayerLoadout.prototype.goalExplosionId = function () {
                var offset = this.bb.__offset(this.bb_pos, 28);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param rlbot.flat.LoadoutPaint= obj
             * @returns rlbot.flat.LoadoutPaint|null
             */
            PlayerLoadout.prototype.loadoutPaint = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 30);
                return offset ? (obj || new rlbot.flat.LoadoutPaint()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * Sets the primary color of the car to the swatch that most closely matches the provided
             * RGB color value. If set, this overrides teamColorId.
             *
             * @param rlbot.flat.Color= obj
             * @returns rlbot.flat.Color|null
             */
            PlayerLoadout.prototype.primaryColorLookup = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 32);
                return offset ? (obj || new rlbot.flat.Color()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * Sets the secondary color of the car to the swatch that most closely matches the provided
             * RGB color value. If set, this overrides customColorId.
             *
             * @param rlbot.flat.Color= obj
             * @returns rlbot.flat.Color|null
             */
            PlayerLoadout.prototype.secondaryColorLookup = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 34);
                return offset ? (obj || new rlbot.flat.Color()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            PlayerLoadout.startPlayerLoadout = function (builder) {
                builder.startObject(16);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number teamColorId
             */
            PlayerLoadout.addTeamColorId = function (builder, teamColorId) {
                builder.addFieldInt32(0, teamColorId, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number customColorId
             */
            PlayerLoadout.addCustomColorId = function (builder, customColorId) {
                builder.addFieldInt32(1, customColorId, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number carId
             */
            PlayerLoadout.addCarId = function (builder, carId) {
                builder.addFieldInt32(2, carId, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number decalId
             */
            PlayerLoadout.addDecalId = function (builder, decalId) {
                builder.addFieldInt32(3, decalId, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number wheelsId
             */
            PlayerLoadout.addWheelsId = function (builder, wheelsId) {
                builder.addFieldInt32(4, wheelsId, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number boostId
             */
            PlayerLoadout.addBoostId = function (builder, boostId) {
                builder.addFieldInt32(5, boostId, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number antennaId
             */
            PlayerLoadout.addAntennaId = function (builder, antennaId) {
                builder.addFieldInt32(6, antennaId, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number hatId
             */
            PlayerLoadout.addHatId = function (builder, hatId) {
                builder.addFieldInt32(7, hatId, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number paintFinishId
             */
            PlayerLoadout.addPaintFinishId = function (builder, paintFinishId) {
                builder.addFieldInt32(8, paintFinishId, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number customFinishId
             */
            PlayerLoadout.addCustomFinishId = function (builder, customFinishId) {
                builder.addFieldInt32(9, customFinishId, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number engineAudioId
             */
            PlayerLoadout.addEngineAudioId = function (builder, engineAudioId) {
                builder.addFieldInt32(10, engineAudioId, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number trailsId
             */
            PlayerLoadout.addTrailsId = function (builder, trailsId) {
                builder.addFieldInt32(11, trailsId, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number goalExplosionId
             */
            PlayerLoadout.addGoalExplosionId = function (builder, goalExplosionId) {
                builder.addFieldInt32(12, goalExplosionId, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset loadoutPaintOffset
             */
            PlayerLoadout.addLoadoutPaint = function (builder, loadoutPaintOffset) {
                builder.addFieldOffset(13, loadoutPaintOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset primaryColorLookupOffset
             */
            PlayerLoadout.addPrimaryColorLookup = function (builder, primaryColorLookupOffset) {
                builder.addFieldOffset(14, primaryColorLookupOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset secondaryColorLookupOffset
             */
            PlayerLoadout.addSecondaryColorLookup = function (builder, secondaryColorLookupOffset) {
                builder.addFieldOffset(15, secondaryColorLookupOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            PlayerLoadout.endPlayerLoadout = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            PlayerLoadout.createPlayerLoadout = function (builder, teamColorId, customColorId, carId, decalId, wheelsId, boostId, antennaId, hatId, paintFinishId, customFinishId, engineAudioId, trailsId, goalExplosionId, loadoutPaintOffset, primaryColorLookupOffset, secondaryColorLookupOffset) {
                PlayerLoadout.startPlayerLoadout(builder);
                PlayerLoadout.addTeamColorId(builder, teamColorId);
                PlayerLoadout.addCustomColorId(builder, customColorId);
                PlayerLoadout.addCarId(builder, carId);
                PlayerLoadout.addDecalId(builder, decalId);
                PlayerLoadout.addWheelsId(builder, wheelsId);
                PlayerLoadout.addBoostId(builder, boostId);
                PlayerLoadout.addAntennaId(builder, antennaId);
                PlayerLoadout.addHatId(builder, hatId);
                PlayerLoadout.addPaintFinishId(builder, paintFinishId);
                PlayerLoadout.addCustomFinishId(builder, customFinishId);
                PlayerLoadout.addEngineAudioId(builder, engineAudioId);
                PlayerLoadout.addTrailsId(builder, trailsId);
                PlayerLoadout.addGoalExplosionId(builder, goalExplosionId);
                PlayerLoadout.addLoadoutPaint(builder, loadoutPaintOffset);
                PlayerLoadout.addPrimaryColorLookup(builder, primaryColorLookupOffset);
                PlayerLoadout.addSecondaryColorLookup(builder, secondaryColorLookupOffset);
                return PlayerLoadout.endPlayerLoadout(builder);
            };
            return PlayerLoadout;
        }());
        flat.PlayerLoadout = PlayerLoadout;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * Specification for 'painted' items. See https://github.com/RLBot/RLBot/wiki/Bot-Customization
 *
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var LoadoutPaint = /** @class */ (function () {
            function LoadoutPaint() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns LoadoutPaint
             */
            LoadoutPaint.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param LoadoutPaint= obj
             * @returns LoadoutPaint
             */
            LoadoutPaint.getRootAsLoadoutPaint = function (bb, obj) {
                return (obj || new LoadoutPaint()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param LoadoutPaint= obj
             * @returns LoadoutPaint
             */
            LoadoutPaint.getSizePrefixedRootAsLoadoutPaint = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new LoadoutPaint()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @returns number
             */
            LoadoutPaint.prototype.carPaintId = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            LoadoutPaint.prototype.decalPaintId = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            LoadoutPaint.prototype.wheelsPaintId = function () {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            LoadoutPaint.prototype.boostPaintId = function () {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            LoadoutPaint.prototype.antennaPaintId = function () {
                var offset = this.bb.__offset(this.bb_pos, 12);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            LoadoutPaint.prototype.hatPaintId = function () {
                var offset = this.bb.__offset(this.bb_pos, 14);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            LoadoutPaint.prototype.trailsPaintId = function () {
                var offset = this.bb.__offset(this.bb_pos, 16);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            LoadoutPaint.prototype.goalExplosionPaintId = function () {
                var offset = this.bb.__offset(this.bb_pos, 18);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            LoadoutPaint.startLoadoutPaint = function (builder) {
                builder.startObject(8);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number carPaintId
             */
            LoadoutPaint.addCarPaintId = function (builder, carPaintId) {
                builder.addFieldInt32(0, carPaintId, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number decalPaintId
             */
            LoadoutPaint.addDecalPaintId = function (builder, decalPaintId) {
                builder.addFieldInt32(1, decalPaintId, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number wheelsPaintId
             */
            LoadoutPaint.addWheelsPaintId = function (builder, wheelsPaintId) {
                builder.addFieldInt32(2, wheelsPaintId, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number boostPaintId
             */
            LoadoutPaint.addBoostPaintId = function (builder, boostPaintId) {
                builder.addFieldInt32(3, boostPaintId, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number antennaPaintId
             */
            LoadoutPaint.addAntennaPaintId = function (builder, antennaPaintId) {
                builder.addFieldInt32(4, antennaPaintId, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number hatPaintId
             */
            LoadoutPaint.addHatPaintId = function (builder, hatPaintId) {
                builder.addFieldInt32(5, hatPaintId, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number trailsPaintId
             */
            LoadoutPaint.addTrailsPaintId = function (builder, trailsPaintId) {
                builder.addFieldInt32(6, trailsPaintId, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number goalExplosionPaintId
             */
            LoadoutPaint.addGoalExplosionPaintId = function (builder, goalExplosionPaintId) {
                builder.addFieldInt32(7, goalExplosionPaintId, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            LoadoutPaint.endLoadoutPaint = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            LoadoutPaint.createLoadoutPaint = function (builder, carPaintId, decalPaintId, wheelsPaintId, boostPaintId, antennaPaintId, hatPaintId, trailsPaintId, goalExplosionPaintId) {
                LoadoutPaint.startLoadoutPaint(builder);
                LoadoutPaint.addCarPaintId(builder, carPaintId);
                LoadoutPaint.addDecalPaintId(builder, decalPaintId);
                LoadoutPaint.addWheelsPaintId(builder, wheelsPaintId);
                LoadoutPaint.addBoostPaintId(builder, boostPaintId);
                LoadoutPaint.addAntennaPaintId(builder, antennaPaintId);
                LoadoutPaint.addHatPaintId(builder, hatPaintId);
                LoadoutPaint.addTrailsPaintId(builder, trailsPaintId);
                LoadoutPaint.addGoalExplosionPaintId(builder, goalExplosionPaintId);
                return LoadoutPaint.endLoadoutPaint(builder);
            };
            return LoadoutPaint;
        }());
        flat.LoadoutPaint = LoadoutPaint;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var PlayerConfiguration = /** @class */ (function () {
            function PlayerConfiguration() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns PlayerConfiguration
             */
            PlayerConfiguration.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param PlayerConfiguration= obj
             * @returns PlayerConfiguration
             */
            PlayerConfiguration.getRootAsPlayerConfiguration = function (bb, obj) {
                return (obj || new PlayerConfiguration()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param PlayerConfiguration= obj
             * @returns PlayerConfiguration
             */
            PlayerConfiguration.getSizePrefixedRootAsPlayerConfiguration = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new PlayerConfiguration()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @returns rlbot.flat.PlayerClass
             */
            PlayerConfiguration.prototype.varietyType = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? /**  */ (this.bb.readUint8(this.bb_pos + offset)) : rlbot.flat.PlayerClass.NONE;
            };
            ;
            /**
             * @param flatbuffers.Table obj
             * @returns ?flatbuffers.Table
             */
            PlayerConfiguration.prototype.variety = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.__union(obj, this.bb_pos + offset) : null;
            };
            ;
            PlayerConfiguration.prototype.name = function (optionalEncoding) {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
            };
            ;
            /**
             * @returns number
             */
            PlayerConfiguration.prototype.team = function () {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param rlbot.flat.PlayerLoadout= obj
             * @returns rlbot.flat.PlayerLoadout|null
             */
            PlayerConfiguration.prototype.loadout = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 12);
                return offset ? (obj || new rlbot.flat.PlayerLoadout()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * In the case where the requested player index is not available, spawnId will help
             * the framework figure out what index was actually assigned to this player instead.
             *
             * @returns number
             */
            PlayerConfiguration.prototype.spawnId = function () {
                var offset = this.bb.__offset(this.bb_pos, 14);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            PlayerConfiguration.startPlayerConfiguration = function (builder) {
                builder.startObject(6);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.PlayerClass varietyType
             */
            PlayerConfiguration.addVarietyType = function (builder, varietyType) {
                builder.addFieldInt8(0, varietyType, rlbot.flat.PlayerClass.NONE);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset varietyOffset
             */
            PlayerConfiguration.addVariety = function (builder, varietyOffset) {
                builder.addFieldOffset(1, varietyOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset nameOffset
             */
            PlayerConfiguration.addName = function (builder, nameOffset) {
                builder.addFieldOffset(2, nameOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number team
             */
            PlayerConfiguration.addTeam = function (builder, team) {
                builder.addFieldInt32(3, team, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset loadoutOffset
             */
            PlayerConfiguration.addLoadout = function (builder, loadoutOffset) {
                builder.addFieldOffset(4, loadoutOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number spawnId
             */
            PlayerConfiguration.addSpawnId = function (builder, spawnId) {
                builder.addFieldInt32(5, spawnId, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            PlayerConfiguration.endPlayerConfiguration = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            PlayerConfiguration.createPlayerConfiguration = function (builder, varietyType, varietyOffset, nameOffset, team, loadoutOffset, spawnId) {
                PlayerConfiguration.startPlayerConfiguration(builder);
                PlayerConfiguration.addVarietyType(builder, varietyType);
                PlayerConfiguration.addVariety(builder, varietyOffset);
                PlayerConfiguration.addName(builder, nameOffset);
                PlayerConfiguration.addTeam(builder, team);
                PlayerConfiguration.addLoadout(builder, loadoutOffset);
                PlayerConfiguration.addSpawnId(builder, spawnId);
                return PlayerConfiguration.endPlayerConfiguration(builder);
            };
            return PlayerConfiguration;
        }());
        flat.PlayerConfiguration = PlayerConfiguration;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var MutatorSettings = /** @class */ (function () {
            function MutatorSettings() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns MutatorSettings
             */
            MutatorSettings.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param MutatorSettings= obj
             * @returns MutatorSettings
             */
            MutatorSettings.getRootAsMutatorSettings = function (bb, obj) {
                return (obj || new MutatorSettings()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param MutatorSettings= obj
             * @returns MutatorSettings
             */
            MutatorSettings.getSizePrefixedRootAsMutatorSettings = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new MutatorSettings()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @returns rlbot.flat.MatchLength
             */
            MutatorSettings.prototype.matchLength = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : rlbot.flat.MatchLength.Five_Minutes;
            };
            ;
            /**
             * @returns rlbot.flat.MaxScore
             */
            MutatorSettings.prototype.maxScore = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : rlbot.flat.MaxScore.Unlimited;
            };
            ;
            /**
             * @returns rlbot.flat.OvertimeOption
             */
            MutatorSettings.prototype.overtimeOption = function () {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : rlbot.flat.OvertimeOption.Unlimited;
            };
            ;
            /**
             * @returns rlbot.flat.SeriesLengthOption
             */
            MutatorSettings.prototype.seriesLengthOption = function () {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : rlbot.flat.SeriesLengthOption.Unlimited;
            };
            ;
            /**
             * @returns rlbot.flat.GameSpeedOption
             */
            MutatorSettings.prototype.gameSpeedOption = function () {
                var offset = this.bb.__offset(this.bb_pos, 12);
                return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : rlbot.flat.GameSpeedOption.Default;
            };
            ;
            /**
             * @returns rlbot.flat.BallMaxSpeedOption
             */
            MutatorSettings.prototype.ballMaxSpeedOption = function () {
                var offset = this.bb.__offset(this.bb_pos, 14);
                return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : rlbot.flat.BallMaxSpeedOption.Default;
            };
            ;
            /**
             * @returns rlbot.flat.BallTypeOption
             */
            MutatorSettings.prototype.ballTypeOption = function () {
                var offset = this.bb.__offset(this.bb_pos, 16);
                return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : rlbot.flat.BallTypeOption.Default;
            };
            ;
            /**
             * @returns rlbot.flat.BallWeightOption
             */
            MutatorSettings.prototype.ballWeightOption = function () {
                var offset = this.bb.__offset(this.bb_pos, 18);
                return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : rlbot.flat.BallWeightOption.Default;
            };
            ;
            /**
             * @returns rlbot.flat.BallSizeOption
             */
            MutatorSettings.prototype.ballSizeOption = function () {
                var offset = this.bb.__offset(this.bb_pos, 20);
                return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : rlbot.flat.BallSizeOption.Default;
            };
            ;
            /**
             * @returns rlbot.flat.BallBouncinessOption
             */
            MutatorSettings.prototype.ballBouncinessOption = function () {
                var offset = this.bb.__offset(this.bb_pos, 22);
                return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : rlbot.flat.BallBouncinessOption.Default;
            };
            ;
            /**
             * @returns rlbot.flat.BoostOption
             */
            MutatorSettings.prototype.boostOption = function () {
                var offset = this.bb.__offset(this.bb_pos, 24);
                return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : rlbot.flat.BoostOption.Normal_Boost;
            };
            ;
            /**
             * @returns rlbot.flat.RumbleOption
             */
            MutatorSettings.prototype.rumbleOption = function () {
                var offset = this.bb.__offset(this.bb_pos, 26);
                return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : rlbot.flat.RumbleOption.No_Rumble;
            };
            ;
            /**
             * @returns rlbot.flat.BoostStrengthOption
             */
            MutatorSettings.prototype.boostStrengthOption = function () {
                var offset = this.bb.__offset(this.bb_pos, 28);
                return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : rlbot.flat.BoostStrengthOption.One;
            };
            ;
            /**
             * @returns rlbot.flat.GravityOption
             */
            MutatorSettings.prototype.gravityOption = function () {
                var offset = this.bb.__offset(this.bb_pos, 30);
                return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : rlbot.flat.GravityOption.Default;
            };
            ;
            /**
             * @returns rlbot.flat.DemolishOption
             */
            MutatorSettings.prototype.demolishOption = function () {
                var offset = this.bb.__offset(this.bb_pos, 32);
                return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : rlbot.flat.DemolishOption.Default;
            };
            ;
            /**
             * @returns rlbot.flat.RespawnTimeOption
             */
            MutatorSettings.prototype.respawnTimeOption = function () {
                var offset = this.bb.__offset(this.bb_pos, 34);
                return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : rlbot.flat.RespawnTimeOption.Three_Seconds;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            MutatorSettings.startMutatorSettings = function (builder) {
                builder.startObject(16);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.MatchLength matchLength
             */
            MutatorSettings.addMatchLength = function (builder, matchLength) {
                builder.addFieldInt8(0, matchLength, rlbot.flat.MatchLength.Five_Minutes);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.MaxScore maxScore
             */
            MutatorSettings.addMaxScore = function (builder, maxScore) {
                builder.addFieldInt8(1, maxScore, rlbot.flat.MaxScore.Unlimited);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.OvertimeOption overtimeOption
             */
            MutatorSettings.addOvertimeOption = function (builder, overtimeOption) {
                builder.addFieldInt8(2, overtimeOption, rlbot.flat.OvertimeOption.Unlimited);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.SeriesLengthOption seriesLengthOption
             */
            MutatorSettings.addSeriesLengthOption = function (builder, seriesLengthOption) {
                builder.addFieldInt8(3, seriesLengthOption, rlbot.flat.SeriesLengthOption.Unlimited);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.GameSpeedOption gameSpeedOption
             */
            MutatorSettings.addGameSpeedOption = function (builder, gameSpeedOption) {
                builder.addFieldInt8(4, gameSpeedOption, rlbot.flat.GameSpeedOption.Default);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.BallMaxSpeedOption ballMaxSpeedOption
             */
            MutatorSettings.addBallMaxSpeedOption = function (builder, ballMaxSpeedOption) {
                builder.addFieldInt8(5, ballMaxSpeedOption, rlbot.flat.BallMaxSpeedOption.Default);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.BallTypeOption ballTypeOption
             */
            MutatorSettings.addBallTypeOption = function (builder, ballTypeOption) {
                builder.addFieldInt8(6, ballTypeOption, rlbot.flat.BallTypeOption.Default);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.BallWeightOption ballWeightOption
             */
            MutatorSettings.addBallWeightOption = function (builder, ballWeightOption) {
                builder.addFieldInt8(7, ballWeightOption, rlbot.flat.BallWeightOption.Default);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.BallSizeOption ballSizeOption
             */
            MutatorSettings.addBallSizeOption = function (builder, ballSizeOption) {
                builder.addFieldInt8(8, ballSizeOption, rlbot.flat.BallSizeOption.Default);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.BallBouncinessOption ballBouncinessOption
             */
            MutatorSettings.addBallBouncinessOption = function (builder, ballBouncinessOption) {
                builder.addFieldInt8(9, ballBouncinessOption, rlbot.flat.BallBouncinessOption.Default);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.BoostOption boostOption
             */
            MutatorSettings.addBoostOption = function (builder, boostOption) {
                builder.addFieldInt8(10, boostOption, rlbot.flat.BoostOption.Normal_Boost);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.RumbleOption rumbleOption
             */
            MutatorSettings.addRumbleOption = function (builder, rumbleOption) {
                builder.addFieldInt8(11, rumbleOption, rlbot.flat.RumbleOption.No_Rumble);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.BoostStrengthOption boostStrengthOption
             */
            MutatorSettings.addBoostStrengthOption = function (builder, boostStrengthOption) {
                builder.addFieldInt8(12, boostStrengthOption, rlbot.flat.BoostStrengthOption.One);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.GravityOption gravityOption
             */
            MutatorSettings.addGravityOption = function (builder, gravityOption) {
                builder.addFieldInt8(13, gravityOption, rlbot.flat.GravityOption.Default);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.DemolishOption demolishOption
             */
            MutatorSettings.addDemolishOption = function (builder, demolishOption) {
                builder.addFieldInt8(14, demolishOption, rlbot.flat.DemolishOption.Default);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.RespawnTimeOption respawnTimeOption
             */
            MutatorSettings.addRespawnTimeOption = function (builder, respawnTimeOption) {
                builder.addFieldInt8(15, respawnTimeOption, rlbot.flat.RespawnTimeOption.Three_Seconds);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            MutatorSettings.endMutatorSettings = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            MutatorSettings.createMutatorSettings = function (builder, matchLength, maxScore, overtimeOption, seriesLengthOption, gameSpeedOption, ballMaxSpeedOption, ballTypeOption, ballWeightOption, ballSizeOption, ballBouncinessOption, boostOption, rumbleOption, boostStrengthOption, gravityOption, demolishOption, respawnTimeOption) {
                MutatorSettings.startMutatorSettings(builder);
                MutatorSettings.addMatchLength(builder, matchLength);
                MutatorSettings.addMaxScore(builder, maxScore);
                MutatorSettings.addOvertimeOption(builder, overtimeOption);
                MutatorSettings.addSeriesLengthOption(builder, seriesLengthOption);
                MutatorSettings.addGameSpeedOption(builder, gameSpeedOption);
                MutatorSettings.addBallMaxSpeedOption(builder, ballMaxSpeedOption);
                MutatorSettings.addBallTypeOption(builder, ballTypeOption);
                MutatorSettings.addBallWeightOption(builder, ballWeightOption);
                MutatorSettings.addBallSizeOption(builder, ballSizeOption);
                MutatorSettings.addBallBouncinessOption(builder, ballBouncinessOption);
                MutatorSettings.addBoostOption(builder, boostOption);
                MutatorSettings.addRumbleOption(builder, rumbleOption);
                MutatorSettings.addBoostStrengthOption(builder, boostStrengthOption);
                MutatorSettings.addGravityOption(builder, gravityOption);
                MutatorSettings.addDemolishOption(builder, demolishOption);
                MutatorSettings.addRespawnTimeOption(builder, respawnTimeOption);
                return MutatorSettings.endMutatorSettings(builder);
            };
            return MutatorSettings;
        }());
        flat.MutatorSettings = MutatorSettings;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var MatchSettings = /** @class */ (function () {
            function MatchSettings() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns MatchSettings
             */
            MatchSettings.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param MatchSettings= obj
             * @returns MatchSettings
             */
            MatchSettings.getRootAsMatchSettings = function (bb, obj) {
                return (obj || new MatchSettings()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param MatchSettings= obj
             * @returns MatchSettings
             */
            MatchSettings.getSizePrefixedRootAsMatchSettings = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new MatchSettings()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param number index
             * @param rlbot.flat.PlayerConfiguration= obj
             * @returns rlbot.flat.PlayerConfiguration
             */
            MatchSettings.prototype.playerConfigurations = function (index, obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.PlayerConfiguration()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
            };
            ;
            /**
             * @returns number
             */
            MatchSettings.prototype.playerConfigurationsLength = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns rlbot.flat.GameMode
             */
            MatchSettings.prototype.gameMode = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : rlbot.flat.GameMode.Soccer;
            };
            ;
            /**
             * @returns rlbot.flat.GameMap
             */
            MatchSettings.prototype.gameMap = function () {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : rlbot.flat.GameMap.DFHStadium;
            };
            ;
            /**
             * @returns boolean
             */
            MatchSettings.prototype.skipReplays = function () {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * @returns boolean
             */
            MatchSettings.prototype.instantStart = function () {
                var offset = this.bb.__offset(this.bb_pos, 12);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * @param rlbot.flat.MutatorSettings= obj
             * @returns rlbot.flat.MutatorSettings|null
             */
            MatchSettings.prototype.mutatorSettings = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 14);
                return offset ? (obj || new rlbot.flat.MutatorSettings()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @returns rlbot.flat.ExistingMatchBehavior
             */
            MatchSettings.prototype.existingMatchBehavior = function () {
                var offset = this.bb.__offset(this.bb_pos, 16);
                return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : rlbot.flat.ExistingMatchBehavior.Restart_If_Different;
            };
            ;
            /**
             * @returns boolean
             */
            MatchSettings.prototype.enableLockstep = function () {
                var offset = this.bb.__offset(this.bb_pos, 18);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * @returns boolean
             */
            MatchSettings.prototype.enableRendering = function () {
                var offset = this.bb.__offset(this.bb_pos, 20);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * @returns boolean
             */
            MatchSettings.prototype.enableStateSetting = function () {
                var offset = this.bb.__offset(this.bb_pos, 22);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * @returns boolean
             */
            MatchSettings.prototype.autoSaveReplay = function () {
                var offset = this.bb.__offset(this.bb_pos, 24);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            MatchSettings.startMatchSettings = function (builder) {
                builder.startObject(11);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset playerConfigurationsOffset
             */
            MatchSettings.addPlayerConfigurations = function (builder, playerConfigurationsOffset) {
                builder.addFieldOffset(0, playerConfigurationsOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param Array.<flatbuffers.Offset> data
             * @returns flatbuffers.Offset
             */
            MatchSettings.createPlayerConfigurationsVector = function (builder, data) {
                builder.startVector(4, data.length, 4);
                for (var i = data.length - 1; i >= 0; i--) {
                    builder.addOffset(data[i]);
                }
                return builder.endVector();
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number numElems
             */
            MatchSettings.startPlayerConfigurationsVector = function (builder, numElems) {
                builder.startVector(4, numElems, 4);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.GameMode gameMode
             */
            MatchSettings.addGameMode = function (builder, gameMode) {
                builder.addFieldInt8(1, gameMode, rlbot.flat.GameMode.Soccer);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.GameMap gameMap
             */
            MatchSettings.addGameMap = function (builder, gameMap) {
                builder.addFieldInt8(2, gameMap, rlbot.flat.GameMap.DFHStadium);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean skipReplays
             */
            MatchSettings.addSkipReplays = function (builder, skipReplays) {
                builder.addFieldInt8(3, +skipReplays, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean instantStart
             */
            MatchSettings.addInstantStart = function (builder, instantStart) {
                builder.addFieldInt8(4, +instantStart, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset mutatorSettingsOffset
             */
            MatchSettings.addMutatorSettings = function (builder, mutatorSettingsOffset) {
                builder.addFieldOffset(5, mutatorSettingsOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.ExistingMatchBehavior existingMatchBehavior
             */
            MatchSettings.addExistingMatchBehavior = function (builder, existingMatchBehavior) {
                builder.addFieldInt8(6, existingMatchBehavior, rlbot.flat.ExistingMatchBehavior.Restart_If_Different);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean enableLockstep
             */
            MatchSettings.addEnableLockstep = function (builder, enableLockstep) {
                builder.addFieldInt8(7, +enableLockstep, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean enableRendering
             */
            MatchSettings.addEnableRendering = function (builder, enableRendering) {
                builder.addFieldInt8(8, +enableRendering, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean enableStateSetting
             */
            MatchSettings.addEnableStateSetting = function (builder, enableStateSetting) {
                builder.addFieldInt8(9, +enableStateSetting, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean autoSaveReplay
             */
            MatchSettings.addAutoSaveReplay = function (builder, autoSaveReplay) {
                builder.addFieldInt8(10, +autoSaveReplay, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            MatchSettings.endMatchSettings = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            MatchSettings.createMatchSettings = function (builder, playerConfigurationsOffset, gameMode, gameMap, skipReplays, instantStart, mutatorSettingsOffset, existingMatchBehavior, enableLockstep, enableRendering, enableStateSetting, autoSaveReplay) {
                MatchSettings.startMatchSettings(builder);
                MatchSettings.addPlayerConfigurations(builder, playerConfigurationsOffset);
                MatchSettings.addGameMode(builder, gameMode);
                MatchSettings.addGameMap(builder, gameMap);
                MatchSettings.addSkipReplays(builder, skipReplays);
                MatchSettings.addInstantStart(builder, instantStart);
                MatchSettings.addMutatorSettings(builder, mutatorSettingsOffset);
                MatchSettings.addExistingMatchBehavior(builder, existingMatchBehavior);
                MatchSettings.addEnableLockstep(builder, enableLockstep);
                MatchSettings.addEnableRendering(builder, enableRendering);
                MatchSettings.addEnableStateSetting(builder, enableStateSetting);
                MatchSettings.addAutoSaveReplay(builder, autoSaveReplay);
                return MatchSettings.endMatchSettings(builder);
            };
            return MatchSettings;
        }());
        flat.MatchSettings = MatchSettings;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var QuickChatMessages = /** @class */ (function () {
            function QuickChatMessages() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns QuickChatMessages
             */
            QuickChatMessages.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param QuickChatMessages= obj
             * @returns QuickChatMessages
             */
            QuickChatMessages.getRootAsQuickChatMessages = function (bb, obj) {
                return (obj || new QuickChatMessages()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param QuickChatMessages= obj
             * @returns QuickChatMessages
             */
            QuickChatMessages.getSizePrefixedRootAsQuickChatMessages = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new QuickChatMessages()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param number index
             * @param rlbot.flat.QuickChat= obj
             * @returns rlbot.flat.QuickChat
             */
            QuickChatMessages.prototype.messages = function (index, obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.QuickChat()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
            };
            ;
            /**
             * @returns number
             */
            QuickChatMessages.prototype.messagesLength = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            QuickChatMessages.startQuickChatMessages = function (builder) {
                builder.startObject(1);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset messagesOffset
             */
            QuickChatMessages.addMessages = function (builder, messagesOffset) {
                builder.addFieldOffset(0, messagesOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param Array.<flatbuffers.Offset> data
             * @returns flatbuffers.Offset
             */
            QuickChatMessages.createMessagesVector = function (builder, data) {
                builder.startVector(4, data.length, 4);
                for (var i = data.length - 1; i >= 0; i--) {
                    builder.addOffset(data[i]);
                }
                return builder.endVector();
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number numElems
             */
            QuickChatMessages.startMessagesVector = function (builder, numElems) {
                builder.startVector(4, numElems, 4);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            QuickChatMessages.endQuickChatMessages = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            QuickChatMessages.createQuickChatMessages = function (builder, messagesOffset) {
                QuickChatMessages.startQuickChatMessages(builder);
                QuickChatMessages.addMessages(builder, messagesOffset);
                return QuickChatMessages.endQuickChatMessages(builder);
            };
            return QuickChatMessages;
        }());
        flat.QuickChatMessages = QuickChatMessages;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * Sent when connecting to RLBot to indicate what type of messages are desired.
 * This could be sent by a bot, or a bot manager governing several bots, an
 * overlay, or any other utility that connects to the RLBot process.
 *
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var ReadyMessage = /** @class */ (function () {
            function ReadyMessage() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns ReadyMessage
             */
            ReadyMessage.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param ReadyMessage= obj
             * @returns ReadyMessage
             */
            ReadyMessage.getRootAsReadyMessage = function (bb, obj) {
                return (obj || new ReadyMessage()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param ReadyMessage= obj
             * @returns ReadyMessage
             */
            ReadyMessage.getSizePrefixedRootAsReadyMessage = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new ReadyMessage()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @returns boolean
             */
            ReadyMessage.prototype.wantsBallPredictions = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * @returns boolean
             */
            ReadyMessage.prototype.wantsQuickChat = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * @returns boolean
             */
            ReadyMessage.prototype.wantsGameMessages = function () {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            ReadyMessage.startReadyMessage = function (builder) {
                builder.startObject(3);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean wantsBallPredictions
             */
            ReadyMessage.addWantsBallPredictions = function (builder, wantsBallPredictions) {
                builder.addFieldInt8(0, +wantsBallPredictions, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean wantsQuickChat
             */
            ReadyMessage.addWantsQuickChat = function (builder, wantsQuickChat) {
                builder.addFieldInt8(1, +wantsQuickChat, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param boolean wantsGameMessages
             */
            ReadyMessage.addWantsGameMessages = function (builder, wantsGameMessages) {
                builder.addFieldInt8(2, +wantsGameMessages, +false);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            ReadyMessage.endReadyMessage = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            ReadyMessage.createReadyMessage = function (builder, wantsBallPredictions, wantsQuickChat, wantsGameMessages) {
                ReadyMessage.startReadyMessage(builder);
                ReadyMessage.addWantsBallPredictions(builder, wantsBallPredictions);
                ReadyMessage.addWantsQuickChat(builder, wantsQuickChat);
                ReadyMessage.addWantsGameMessages(builder, wantsGameMessages);
                return ReadyMessage.endReadyMessage(builder);
            };
            return ReadyMessage;
        }());
        flat.ReadyMessage = ReadyMessage;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * Notification that a player triggers some in-game event, such as:
 *		Win, Loss, TimePlayed;
 *		Shot, Assist, Center, Clear, PoolShot;
 *		Goal, AerialGoal, BicycleGoal, BulletGoal, BackwardsGoal, LongGoal, OvertimeGoal, TurtleGoal;
 *		AerialHit, BicycleHit, BulletHit, !BackwardsHit, JuggleHit, FirstTouch, BallHit;
 *		Save, EpicSave, FreezeSave;
 *		HatTrick, Savior, Playmaker, MVP;
 *		FastestGoal, SlowestGoal, FurthestGoal, OwnGoal;
 *		MostBallTouches, FewestBallTouches, MostBoostPickups, FewestBoostPickups, BoostPickups;
 *		CarTouches, Demolition, Demolish;
 *		LowFive, HighFive;
 *
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var PlayerStatEvent = /** @class */ (function () {
            function PlayerStatEvent() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns PlayerStatEvent
             */
            PlayerStatEvent.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param PlayerStatEvent= obj
             * @returns PlayerStatEvent
             */
            PlayerStatEvent.getRootAsPlayerStatEvent = function (bb, obj) {
                return (obj || new PlayerStatEvent()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param PlayerStatEvent= obj
             * @returns PlayerStatEvent
             */
            PlayerStatEvent.getSizePrefixedRootAsPlayerStatEvent = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new PlayerStatEvent()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * index of the player associated with the event
             *
             * @returns number
             */
            PlayerStatEvent.prototype.playerIndex = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            PlayerStatEvent.prototype.statType = function (optionalEncoding) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            PlayerStatEvent.startPlayerStatEvent = function (builder) {
                builder.startObject(2);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number playerIndex
             */
            PlayerStatEvent.addPlayerIndex = function (builder, playerIndex) {
                builder.addFieldInt32(0, playerIndex, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset statTypeOffset
             */
            PlayerStatEvent.addStatType = function (builder, statTypeOffset) {
                builder.addFieldOffset(1, statTypeOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            PlayerStatEvent.endPlayerStatEvent = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            PlayerStatEvent.createPlayerStatEvent = function (builder, playerIndex, statTypeOffset) {
                PlayerStatEvent.startPlayerStatEvent(builder);
                PlayerStatEvent.addPlayerIndex(builder, playerIndex);
                PlayerStatEvent.addStatType(builder, statTypeOffset);
                return PlayerStatEvent.endPlayerStatEvent(builder);
            };
            return PlayerStatEvent;
        }());
        flat.PlayerStatEvent = PlayerStatEvent;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * Notification when the local player is spectating another player.
 *
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var PlayerSpectate = /** @class */ (function () {
            function PlayerSpectate() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns PlayerSpectate
             */
            PlayerSpectate.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param PlayerSpectate= obj
             * @returns PlayerSpectate
             */
            PlayerSpectate.getRootAsPlayerSpectate = function (bb, obj) {
                return (obj || new PlayerSpectate()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param PlayerSpectate= obj
             * @returns PlayerSpectate
             */
            PlayerSpectate.getSizePrefixedRootAsPlayerSpectate = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new PlayerSpectate()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * index of the player that is being spectated. Will be -1 if not spectating anyone.
             *
             * @returns number
             */
            PlayerSpectate.prototype.playerIndex = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            PlayerSpectate.startPlayerSpectate = function (builder) {
                builder.startObject(1);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number playerIndex
             */
            PlayerSpectate.addPlayerIndex = function (builder, playerIndex) {
                builder.addFieldInt32(0, playerIndex, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            PlayerSpectate.endPlayerSpectate = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            PlayerSpectate.createPlayerSpectate = function (builder, playerIndex) {
                PlayerSpectate.startPlayerSpectate(builder);
                PlayerSpectate.addPlayerIndex(builder, playerIndex);
                return PlayerSpectate.endPlayerSpectate(builder);
            };
            return PlayerSpectate;
        }());
        flat.PlayerSpectate = PlayerSpectate;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * Rocket League is notifying us that some player has moved their controller. This is an *output*
 *
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var PlayerInputChange = /** @class */ (function () {
            function PlayerInputChange() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns PlayerInputChange
             */
            PlayerInputChange.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param PlayerInputChange= obj
             * @returns PlayerInputChange
             */
            PlayerInputChange.getRootAsPlayerInputChange = function (bb, obj) {
                return (obj || new PlayerInputChange()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param PlayerInputChange= obj
             * @returns PlayerInputChange
             */
            PlayerInputChange.getSizePrefixedRootAsPlayerInputChange = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new PlayerInputChange()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @returns number
             */
            PlayerInputChange.prototype.playerIndex = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param rlbot.flat.ControllerState= obj
             * @returns rlbot.flat.ControllerState|null
             */
            PlayerInputChange.prototype.controllerState = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? (obj || new rlbot.flat.ControllerState()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ;
            /**
             * @returns number
             */
            PlayerInputChange.prototype.dodgeForward = function () {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * @returns number
             */
            PlayerInputChange.prototype.dodgeRight = function () {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            PlayerInputChange.startPlayerInputChange = function (builder) {
                builder.startObject(4);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number playerIndex
             */
            PlayerInputChange.addPlayerIndex = function (builder, playerIndex) {
                builder.addFieldInt32(0, playerIndex, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset controllerStateOffset
             */
            PlayerInputChange.addControllerState = function (builder, controllerStateOffset) {
                builder.addFieldOffset(1, controllerStateOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number dodgeForward
             */
            PlayerInputChange.addDodgeForward = function (builder, dodgeForward) {
                builder.addFieldFloat32(2, dodgeForward, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number dodgeRight
             */
            PlayerInputChange.addDodgeRight = function (builder, dodgeRight) {
                builder.addFieldFloat32(3, dodgeRight, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            PlayerInputChange.endPlayerInputChange = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            PlayerInputChange.createPlayerInputChange = function (builder, playerIndex, controllerStateOffset, dodgeForward, dodgeRight) {
                PlayerInputChange.startPlayerInputChange(builder);
                PlayerInputChange.addPlayerIndex(builder, playerIndex);
                PlayerInputChange.addControllerState(builder, controllerStateOffset);
                PlayerInputChange.addDodgeForward(builder, dodgeForward);
                PlayerInputChange.addDodgeRight(builder, dodgeRight);
                return PlayerInputChange.endPlayerInputChange(builder);
            };
            return PlayerInputChange;
        }());
        flat.PlayerInputChange = PlayerInputChange;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var GameMessageWrapper = /** @class */ (function () {
            function GameMessageWrapper() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns GameMessageWrapper
             */
            GameMessageWrapper.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param GameMessageWrapper= obj
             * @returns GameMessageWrapper
             */
            GameMessageWrapper.getRootAsGameMessageWrapper = function (bb, obj) {
                return (obj || new GameMessageWrapper()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param GameMessageWrapper= obj
             * @returns GameMessageWrapper
             */
            GameMessageWrapper.getSizePrefixedRootAsGameMessageWrapper = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new GameMessageWrapper()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @returns rlbot.flat.GameMessage
             */
            GameMessageWrapper.prototype.MessageType = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? /**  */ (this.bb.readUint8(this.bb_pos + offset)) : rlbot.flat.GameMessage.NONE;
            };
            ;
            /**
             * @param flatbuffers.Table obj
             * @returns ?flatbuffers.Table
             */
            GameMessageWrapper.prototype.Message = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.__union(obj, this.bb_pos + offset) : null;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            GameMessageWrapper.startGameMessageWrapper = function (builder) {
                builder.startObject(2);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param rlbot.flat.GameMessage MessageType
             */
            GameMessageWrapper.addMessageType = function (builder, MessageType) {
                builder.addFieldInt8(0, MessageType, rlbot.flat.GameMessage.NONE);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset MessageOffset
             */
            GameMessageWrapper.addMessage = function (builder, MessageOffset) {
                builder.addFieldOffset(1, MessageOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            GameMessageWrapper.endGameMessageWrapper = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            GameMessageWrapper.createGameMessageWrapper = function (builder, MessageType, MessageOffset) {
                GameMessageWrapper.startGameMessageWrapper(builder);
                GameMessageWrapper.addMessageType(builder, MessageType);
                GameMessageWrapper.addMessage(builder, MessageOffset);
                return GameMessageWrapper.endGameMessageWrapper(builder);
            };
            return GameMessageWrapper;
        }());
        flat.GameMessageWrapper = GameMessageWrapper;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
/**
 * We have some very small messages that are only a few bytes but potentially sent at high frequency.
 * Bundle them into a packet to reduce the overhead of sending data over TCP.
 *
 * @constructor
 */
(function (rlbot) {
    var flat;
    (function (flat) {
        var MessagePacket = /** @class */ (function () {
            function MessagePacket() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns MessagePacket
             */
            MessagePacket.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param MessagePacket= obj
             * @returns MessagePacket
             */
            MessagePacket.getRootAsMessagePacket = function (bb, obj) {
                return (obj || new MessagePacket()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param MessagePacket= obj
             * @returns MessagePacket
             */
            MessagePacket.getSizePrefixedRootAsMessagePacket = function (bb, obj) {
                bb.setPosition(bb.position() + flatbuffers_1.flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new MessagePacket()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ;
            /**
             * @param number index
             * @param rlbot.flat.GameMessageWrapper= obj
             * @returns rlbot.flat.GameMessageWrapper
             */
            MessagePacket.prototype.messages = function (index, obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new rlbot.flat.GameMessageWrapper()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
            };
            ;
            /**
             * @returns number
             */
            MessagePacket.prototype.messagesLength = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @returns number
             */
            MessagePacket.prototype.gameSeconds = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            ;
            /**
             * @returns number
             */
            MessagePacket.prototype.frameNum = function () {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            MessagePacket.startMessagePacket = function (builder) {
                builder.startObject(3);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param flatbuffers.Offset messagesOffset
             */
            MessagePacket.addMessages = function (builder, messagesOffset) {
                builder.addFieldOffset(0, messagesOffset, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param Array.<flatbuffers.Offset> data
             * @returns flatbuffers.Offset
             */
            MessagePacket.createMessagesVector = function (builder, data) {
                builder.startVector(4, data.length, 4);
                for (var i = data.length - 1; i >= 0; i--) {
                    builder.addOffset(data[i]);
                }
                return builder.endVector();
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number numElems
             */
            MessagePacket.startMessagesVector = function (builder, numElems) {
                builder.startVector(4, numElems, 4);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number gameSeconds
             */
            MessagePacket.addGameSeconds = function (builder, gameSeconds) {
                builder.addFieldFloat32(1, gameSeconds, 0.0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number frameNum
             */
            MessagePacket.addFrameNum = function (builder, frameNum) {
                builder.addFieldInt32(2, frameNum, 0);
            };
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            MessagePacket.endMessagePacket = function (builder) {
                var offset = builder.endObject();
                return offset;
            };
            ;
            MessagePacket.createMessagePacket = function (builder, messagesOffset, gameSeconds, frameNum) {
                MessagePacket.startMessagePacket(builder);
                MessagePacket.addMessages(builder, messagesOffset);
                MessagePacket.addGameSeconds(builder, gameSeconds);
                MessagePacket.addFrameNum(builder, frameNum);
                return MessagePacket.endMessagePacket(builder);
            };
            return MessagePacket;
        }());
        flat.MessagePacket = MessagePacket;
    })(flat = rlbot.flat || (rlbot.flat = {}));
})(rlbot = exports.rlbot || (exports.rlbot = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmxib3RfZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZsYXQvcmxib3RfZ2VuZXJhdGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxRUFBcUU7OztBQUVyRSwyQ0FBeUM7QUFDekM7O0dBRUc7QUFDSCxJQUFpQixLQUFLLENBTXBCO0FBTkYsV0FBaUIsS0FBSztJQUFDLElBQUEsSUFBSSxDQU16QjtJQU5xQixXQUFBLElBQUk7UUFDM0IsSUFBWSxjQUtYO1FBTEQsV0FBWSxjQUFjO1lBQ3hCLG1EQUFPLENBQUE7WUFDUCwyREFBVyxDQUFBO1lBQ1gsaUVBQWMsQ0FBQTtZQUNkLHFFQUFnQixDQUFBO1FBQ2xCLENBQUMsRUFMVyxjQUFjLEdBQWQsbUJBQWMsS0FBZCxtQkFBYyxRQUt6QjtJQUFBLENBQUMsRUFOcUIsSUFBSSxHQUFKLFVBQUksS0FBSixVQUFJLFFBTXpCO0FBQUQsQ0FBQyxFQU5lLEtBQUssR0FBTCxhQUFLLEtBQUwsYUFBSyxRQU1wQjtBQUFBLENBQUM7QUFFSDs7R0FFRztBQUNILFdBQWlCLEtBQUs7SUFBQyxJQUFBLElBQUksQ0FrQnpCO0lBbEJxQixXQUFBLElBQUk7UUFDM0IsSUFBWSxTQWlCWDtRQWpCRCxXQUFZLFNBQVM7WUFDbkIsK0NBQVUsQ0FBQTtZQUVWOztlQUVHO1lBQ0gsNkNBQVMsQ0FBQTtZQUVUOztlQUVHO1lBQ0gsK0NBQVUsQ0FBQTtZQUVWOztlQUVHO1lBQ0gseUNBQU8sQ0FBQTtRQUNULENBQUMsRUFqQlcsU0FBUyxHQUFULGNBQVMsS0FBVCxjQUFTLFFBaUJwQjtJQUFBLENBQUMsRUFsQnFCLElBQUksR0FBSixVQUFJLEtBQUosVUFBSSxRQWtCekI7QUFBRCxDQUFDLEVBbEJlLEtBQUssR0FBTCxhQUFLLEtBQUwsYUFBSyxRQWtCcEI7QUFBQSxDQUFDO0FBRUg7O0dBRUc7QUFDSCxXQUFpQixLQUFLO0lBQUMsSUFBQSxJQUFJLENBVXpCO0lBVnFCLFdB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
//./dist/index.js
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var BotClient_1 = require("./BotClient");
var BotManager_1 = require("./BotManager");
var utils_1 = require("./utils");
var QuickChats_1 = __importDefault(require("./QuickChats"));
var renderStuff = __importStar(require("./RenderManager"));
var controllerStuff = __importStar(require("./ControllerManager"));
var gameStateStuff = __importStar(require("./GameState"));
module.exports = __assign(__assign(__assign(__assign({ Client: BotClient_1.BotClient,
    Manager: BotManager_1.BotManager,
    quickChats: QuickChats_1["default"] }, utils_1.flatstructs), controllerStuff), renderStuff), gameStateStuff);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBa0Q7QUFDbEQsMkNBQXFEO0FBQ3JELGlDQUFzQztBQUN0Qyw0REFBc0M7QUFDdEMsMkRBQStDO0FBQy9DLG1FQUF1RDtBQUN2RCwwREFBOEM7QUFFOUMsTUFBTSxDQUFDLE9BQU8seUNBQ1osTUFBTSx1QkFBQTtJQUNOLE9BQU8seUJBQUE7SUFDUCxVQUFVLHlCQUFBLElBQ1AsbUJBQVcsR0FDWCxlQUFlLEdBQ2YsV0FBVyxHQUNYLGNBQWMsQ0FDbEIsQ0FBQyJ9
//./dist/utils.js
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
exports.flatstructs = exports.decodeFlat = exports.encodeFlat = exports.Logger = exports.Uint8ArrayToString = exports.Uint16to8Array = void 0;
require("colors");
var rlbot_generated_1 = require("./flat/rlbot_generated");
var flatbuffers_1 = require("flatbuffers");
var flatstructs = __importStar(require("./flat/flatstructs"));
exports.flatstructs = flatstructs;
var Logger = /** @class */ (function () {
    function Logger(name) {
        this.enabled = true;
        this.name = name;
    }
    Logger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this.enabled)
            return;
        var cats = args.splice(0, args.length - 1);
        var message = args[0];
        cats.unshift("");
        var catstring = cats.reduce(function (total, next) {
            return total + "[" + next.cyan + "] ";
        });
        console.log("[" + ("Easy".green + "RLBot".blue).bold + "] [" + this.name.magenta + "] " + catstring + message.white);
    };
    return Logger;
}());
exports.Logger = Logger;
function Uint8ArrayToString(bytes) {
    return bytes.reduce(function (str, byte) { return str + byte.toString(2).padStart(8, "0"); }, "");
}
exports.Uint8ArrayToString = Uint8ArrayToString;
function Uint16to8Array(array16) {
    var result = new Uint8Array(array16.buffer, array16.byteOffset, array16.byteLength);
    return result;
}
exports.Uint16to8Array = Uint16to8Array;
function encodeFlat(messageTypeInt, flatArray) {
    var messageType = new Uint16Array(1);
    messageType.set([messageTypeInt]);
    var messageLen = new Uint16Array(1);
    messageLen.set([flatArray.length]);
    var mergedArray = new Uint8Array(4 + flatArray.length);
    mergedArray.set(Uint16to8Array(messageType).reverse(), 0);
    mergedArray.set(Uint16to8Array(messageLen).reverse(), 2);
    mergedArray.set(flatArray, 4);
    return mergedArray;
}
exports.encodeFlat = encodeFlat;
function decodeFlat(bytes) {
    var rawBytes = bytes.subarray(4);
    var dataType = bytes.subarray(0, 2)[0] + bytes.subarray(0, 2)[1];
    var buf = new flatbuffers_1.flatbuffers.ByteBuffer(rawBytes);
    var root;
    try {
        switch (dataType) {
            case 1:
                root = rlbot_generated_1.rlbot.flat.GameTickPacket.getRootAsGameTickPacket(buf);
                break;
            case 2:
                root = rlbot_generated_1.rlbot.flat.FieldInfo.getRootAsFieldInfo(buf);
                break;
            case 3:
                root = rlbot_generated_1.rlbot.flat.MatchSettings.getRootAsMatchSettings(buf);
                break;
            case 4:
                throw "Invalid type for decoding '4'";
                break;
            case 5:
                throw "Invalid type for decoding '5'";
                break;
            case 6:
                throw "Invalid type for decoding '6'";
                break;
            case 7:
                throw "Invalid type for decoding '7'";
                break;
            case 8:
                throw "Invalid type for decoding '8'";
                break;
            case 9:
                root = rlbot_generated_1.rlbot.flat.QuickChat.getRootAsQuickChat(buf);
                break;
            case 10:
                root = rlbot_generated_1.rlbot.flat.BallPrediction.getRootAsBallPrediction(buf);
                break;
            case 11:
                throw "Invalid type for decoding '11'";
                break;
            case 12:
                root = rlbot_generated_1.rlbot.flat.MessagePacket.getRootAsMessagePacket(buf);
                break;
        }
    }
    catch (e) {
        throw "";
    }
    return { root: root, type: dataType };
}
exports.decodeFlat = decodeFlat;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGtCQUFnQjtBQUNoQiwwREFBK0M7QUFDL0MsMkNBQTBDO0FBQzFDLDhEQUFrRDtBQTRHaEQsa0NBQVc7QUExR2I7SUFHRSxnQkFBWSxJQUFZO1FBRHhCLFlBQU8sR0FBWSxJQUFJLENBQUM7UUFFdEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUNELG9CQUFHLEdBQUg7UUFBSSxjQUFpQjthQUFqQixVQUFpQixFQUFqQixxQkFBaUIsRUFBakIsSUFBaUI7WUFBakIseUJBQWlCOztRQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU87WUFBRSxPQUFPO1FBQzFCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDM0MsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDakIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFDLEtBQUssRUFBRSxJQUFJO1lBQ3RDLE9BQU8sS0FBSyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sQ0FBQyxHQUFHLENBQ1QsTUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksV0FDcEMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLFVBQ2QsU0FBUyxHQUFHLE9BQU8sQ0FBQyxLQUFPLENBQ2pDLENBQUM7SUFDSixDQUFDO0lBQ0gsYUFBQztBQUFELENB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
