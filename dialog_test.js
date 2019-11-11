const dialogflow = require('dialogflow');
class Dialogflow{
        constructor(sessionId,projectId,languageCode){
                this.sessionId = sessionId;
                this.projectId = projectId;
                this.languageCode = languageCode;
                this.credentials_file_path = './babytalk-scpoyd-5bd9882161da.json';
                this.sessionClient = new dialogflow.SessionsClient({
                        projectId, keyFilename: this.credentials_file_path
                });       
                this.sessionPath=this.sessionClient.sessionPath(projectId,sessionId);
        }
        async sendDialogflows(text){
                const request={
                        session:this.sessionPath, 
                        queryInput:{
                                text:{
                                        text:text,
                                        languageCode:this.languageCode
                                }
                        }
                };
                console.log(request);
                let answer = await this.sessionClient.detectIntent(request)
                return answer;
        }
}

module.exports = Dialogflow;

