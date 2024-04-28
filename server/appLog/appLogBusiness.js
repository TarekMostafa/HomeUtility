const AppLogRepo = require('./appLogRepo');

class AppLogBusiness {
    async addAppLog({method, pathname, query, userId, userName, reqBody}) {
        const appLog = await AppLogRepo.addLog({
            logUserId: userId,
            logUserName: userName,
            logMethod: method,
            logPathName: pathname,
            logReqQuery: query,
            logReqBody: reqBody,
            logReqTimestamp: new Date().getTime(),
            logResStatus: null,
            logResStatusCode: null,
            logResErrorMsg: null
        }, null);
        return appLog.logId;
    }

    async updateAppLog(id, {resStatus, resStatusCode, resErrorMsg}) {
        let appLog = await AppLogRepo.getLog(id);
        if(!appLog) return;

        appLog.logResStatus = resStatus;
        appLog.logResStatusCode = resStatusCode;
        appLog.logResErrorMsg = resErrorMsg ? 
            (resErrorMsg.length > 1000? resErrorMsg.substring(1, 1000): resErrorMsg): resErrorMsg;
        appLog.logResTimestamp = new Date().getTime();
        appLog.save();
    }
}

module.exports = AppLogBusiness;