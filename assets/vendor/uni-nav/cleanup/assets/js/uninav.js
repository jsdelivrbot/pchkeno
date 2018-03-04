require("../css/uni-nav.css")
window.PCH = window.PCH || {};
PCH.uniExp = PCH.uniExp || {};
require("./Uni-nav");
PCH.uniExp.callTokenBalanceApi = require("./Token-center").callTokenBalanceApi;
PCH.uniExp.tokenCenter = require("./Token-center").tokenCenter;
require("./Token-center").tokenCenterClick();
PCH.completeRegister = require("./Pchfrontpage");
