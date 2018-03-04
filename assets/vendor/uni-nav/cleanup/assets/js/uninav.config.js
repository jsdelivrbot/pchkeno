var PCHMINIBOOTSTRAP = PCHMINIBOOTSTRAP || {};
if (typeof PCHMINIBOOTSTRAP.contentBaseURL === "undefined") PCHMINIBOOTSTRAP.contentBaseURL = "";

module.exports = {
callTokenBalanceApiURL: PCHMINIBOOTSTRAP.contentBaseURL + 'index.php?option=com_pchcom_content&task=tokenBalance&format=raw&' + new Date().getTime()
}